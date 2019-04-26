<?php

    require_once 'dataService.php';
    require_once("class.IPmp3.php");
    require_once('mpeg.php');
    require_once('3rdParty/getid3/getid3.php');
    include('phpmailer.php');
    include('class.smtp.php');
include ("simpleimage.php");
include ("fpdf.php");

function getConnectionStatus(){
    $ds = new DataService();
    return $ds->getConnectionStatus(); 
}

class LoginInfo {
    public $Username = '';
    public $UserId = 0;
    public $isAuthenticated = false;
    public $isAdmin = false;
    public $errvar = 0;
    public $errMsg = '';
    public $admin_status = 0;
    public $radio_status = 0;
    public $Approval_Status = 'P';
    public $is_songbook = false;
    public $token = '';
    public $isupload = '';
}
class SongInfo {
    public $status = 0;
    public $error = '';
}

function addSongToCrate(int $songId,string $favourite){
    $ds = new DataService;
    $userId = getUserId();
    $crateEntry = $ds->getCrateEntry($userId, $songId, $favourite);
    if (!$crateEntry) {
        $rv = $ds->addSongToCrate($userId, $songId, $favourite);
        insertAuditLog($userId, 'Add Song To Crate', json_encode($songId));
    }
    else
        $rv = $crateEntry->Id;
    return $rv;
}

function approveApplication(int $appId): int {
    $userId = getUserId();
    $ds = new DataService;
    $musicserved = $ds->getmusicservedwhenapprove($appId);
    $musicservedids = implode(',', array_column($musicserved,'Id'));
    $getApplicationById = $ds->getApplicationById($appId);
    $SongsReview = $getApplicationById->SongsReview;
    $appUser = $getApplicationById->UserId;
     $ds->getadminupdateregisterApplication($appUser);
    $addSonginlistening = $ds->getmusicservedSongswhenapprove($musicservedids,$SongsReview);
    foreach ($addSonginlistening as $addSonginlisteningvalue) {
        $ds->getaddSongToListeningRoom($appUser,$addSonginlisteningvalue['SongId']);
    }

    $rv = $ds->updateApplication($appId, ['Approval_Status'=>'A']);
    if ($rv == 1) {
        //sendApprovalEmail($appId);
        insertAuditLog($userId, 'Approve Application', json_encode($appId));
    }
    else{
        $rv = -1;
    }

    return $rv;
 }

 function changePassword($passwordChange){
    $ds = new DataService;
    if ($passwordChange->username && $passwordChange->resetCode){
        $user = $ds->getUser($passwordChange->username);
        if (strtolower($user->Username) != strtolower($passwordChange->username) || $user->ResetCode != $passwordChange->resetCode){
            //throw new Exception('Invalid Reset Code/Username', 400);
            return false;
        }
        
        $userId = $user->UserId;
    }
    else{
        $userId = getUserId();
        $user = $ds->getUserById($userId);
        if ($passwordChange->oldPassword != decodePassword($user))
          return false;  //throw new Exception('Invalid Password', 400);
    }

    $rv = $ds->updateUser($userId, [
        'ResetCode' => null,
        'Password' => $passwordChange->newPassword
    ]);
    $app_data = $ds->getApplication($userId);
    $rv = $ds->updateApplication($app_data->AppId, ['AppConfirmed'=>'1']);
     insertAuditLog($userId, 'Password Changed');
    return $rv;
 }
  function ckeckoldPassword(string $passwordChange){

        $rv = new LoginInfo();
        $ds = new DataService;
        $userId = getUserId();
        $user = $ds->getUserById($userId);
        if ($passwordChange != decodePassword($user))
        {
            $rv->errvar = 1;
            $rv->errMsg = "Invalid  Old Password ";
        }else{
            $rv->errvar = 0;
            $rv->errMsg = "";
        }
   
    return $rv;
 }

function checkAdminAuthorization(){
    if (UNDER_CONSTRUCTION == 1) return false;

    $user = getUserId();    //throws error if user not yet authenticated
    $authToken = substr($_SERVER['HTTP_AUTHORIZATION'],7);
    $token = $_SESSION['token'];
    return $authToken === $token && userIsAdmin($user);
}

function checkAuthorization(){
    if (UNDER_CONSTRUCTION == 1) return false;

    $user = getUserId();    //throws error if user not yet authenticated
    $authToken = substr($_SERVER['HTTP_AUTHORIZATION'],7);
   
    if (!$authToken && substr($_REQUEST['r'], 0, 15) == 'songs/songData/') 
        $authToken = $_REQUEST['a'];

    if (!$authToken && substr($_REQUEST['r'], 0, 18) == 'songs/audioSource/') 
        $authToken = $_REQUEST['a'];

    $token = $_SESSION['token'];
    return $authToken === $token;
}
function getchecksession(){
    if($_SESSION['token'] != ""){
        return 1;
        //print_r($_SESSION);
    }else{
        return 2;
    }
}
function checkLogin(string $username, string $password): LoginInfo {
    // $key = "klksdj03jlksd3nlka02k95n85bb73bjkaaljmcaikd129750nfks";

    $rv = new LoginInfo();
    $rv->Username = $username;
        if($username == '' || $password == '' )
    
            {
            
                //require_once("header.php");
                
                $rv->errvar = 1;
                $rv->errMsg = "Username and Password Required";
    
        //		header
    
                 return $rv;
    
            }	
    
    $ds = new DataService();
   $q_res = $ds->getUser($username);
    //$q_res = $ds->getUserlogin($username);
    if ($q_res) {
        insertAuditLog($q_res->UserId, 'LoginAttempted');
        $rv->Username = $q_res->Username;
         $dbPassword = decodePassword($q_res);
        if ($dbPassword == $password)
        {
            insertAuditLog($q_res->UserId, 'UserAuthenticated');
            $rv->UserId = $q_res->UserId;
           $rv->admin_status = $q_res->admin_status; 
           if($rv->admin_status !="0"){
            $rv->isAdmin = true;
           }
           
           $rv->radio_status = $q_res->radio_status; 
            if($q_res->admin_status == '0' 
                && $q_res->radio_status == '1')
            {
                $radio_data = $ds->getRadioStationUser($q_res->UserId);
                if($radio_data) 
                {
                    $rv->Approval_Status = $radio_data->status;
                    if($radio_data->status!='A')		
                    {
                        //require_once("header.php");
    
                        $rv->errvar = 2;    //_logout(); 
                        $rv->errMsg = "Your application is still pending approval or has been denied.";
    
                        return $rv;
                    }	
                }
                else
                {
                        //_logout(); 
    
                        return $rv;
                }
            }	
    
            else 
    
            {
    
      
                     $app_data = $ds->getApplication($q_res->UserId);
                    /*print_r($app_data);
                    exit;*/
                    if($app_data) 
    
                    {
                        $rv->Approval_Status = $app_data->Approval_Status;
                        if($app_data->Approval_Status=='A')		
                        {
                            /* Start remove songs from listeningroom using listeningroomconfig days */
                            $siteconfiginfo = $ds->getSiteconfiginfo();
                            $listeningroomconfigdays =$siteconfiginfo->listeningroomconfig;
                            $ds->removesongfromListeninggivennotreview($q_res->UserId,$listeningroomconfigdays);
                            /* End Of remove songs from listeningroom using listeningroomconfig days */

                            $rv->isupload = $app_data->isupload;
                            $rv->is_songbook = $ds->hasAccessToPackage($q_res->UserId, SONGBOOK_PKGID);
                            //Check songbook access
                            if (IS_SONGBOOK == 1){
                                if (!$rv->is_songbook){
                                    $rv->errvar = 3;
                                    $rv->errMsg = "Your account does not have access to Songbook.life. Please contact the administrators.";
                                    //return $rv;
                                }
                            }
                        }else if($app_data->Approval_Status=='P' && $app_data->AppConfirmed == '0'){
                            $rv->errvar = 6;
                            $rv->errMsg = "Please verify your email then after login.";
                            //$rv->isAuthenticated = true;
                            return $rv;
                        }
                        else {
                            $rv->errvar = 4;
                            $rv->errMsg = "Your application is still pending approval or has been denied.";
                             ///$rv->isAuthenticated = true;
                            //return $rv;
                             }
    
                    } 
    
                    else
    
                    {
    
                        //_logout(); 
    
                        if (!$rv->isAdmin) return $rv;
    
                    }
                    /*print_r($rv);
                    exit;*/
    
              }
              $rv->isAuthenticated = true;
            return $rv; 
    
        } 
    
        else 
    
        { 
            $rv->errvar = 5;
            $rv->errMsg = "Username and password do not match.";
            insertAuditLog($q_res->UserId, 'AuthenticationFailed');
            return $rv;
        } 
    
    } 
    
    else
    
     { 
         return $rv;
    } 
    
} 

function confirmEmail($conf_uid, $userId){
    $ds = new DataService;
    //$var = $ds->confirmEmail($conf_uid, $userId);
    $checkapp = $ds->checkconfirmEmail($conf_uid, $userId);
    if($checkapp){
        $var = $checkapp;
    }else{
        $var = $ds->confirmEmail($conf_uid, $userId);
        /*$appId =$ds->checkconfirmapplicationUserId($userId);
        $ds = new DataService;
        $musicserved = $ds->getmusicservedwhenapprove($appId);
        $musicservedids = implode(',', array_column($musicserved,'Id'));
        $getApplicationById = $ds->getApplicationById($appId);
        $SongsReview = $getApplicationById->SongsReview;
        $appUser = $getApplicationById->UserId;
         $ds->getadminupdateregisterApplication($appUser);
        $addSonginlistening = $ds->getmusicservedSongswhenapprove($musicservedids,$SongsReview);
        foreach ($addSonginlistening as $addSonginlisteningvalue) {
            $ds->getaddSongToListeningRoom($appUser,$addSonginlisteningvalue['SongId']);
        }

        $rv = $ds->updateApplication($appId, ['Approval_Status'=>'A', 'AppConfirmed'=>'1']);
        if ($rv == 1) {
            sendApprovalEmail($appId);
            insertAuditLog($userId, 'Approve Application', json_encode($appId));
        }
        else{
            $rv = -1;
        }*/
    }
    return $var;
}

function convertToKVP($res, $keyName, $valueName){
    $rv = [];
    foreach($res as $value)
        array_push($rv, ['key'=> $value[$keyName], 'value'=> $value[$valueName]]);
    return $rv;
}

function create_guid(){
    return bin2hex(openssl_random_pseudo_bytes(16));
}

function createPayPalPayment($package){
    $rv = (object)[
        'paymentId' => 0
    ];
    return $rv;
}
  
function createSampleFile($sampleInfo){
    if (!$sampleInfo->SampleFile)
        $sampleFilename =  create_guid() . '.mp3';									 
    else
        $sampleFilename = $sampleInfo->SampleFile;
	$mp3 = new mp3;
    if ($mp3->cut_mp3("../$sampleInfo->SongPath/$sampleInfo->SongFile", 
        "../$sampleInfo->SongPath/$sampleFilename", 0, 40, 'second', false))
        return $sampleFilename;
    else
        return false;

}

function decodePassword($user){

   
//print_r($user);
    if ($user->RowVersion < 1){
        //echo "123456";
       /* $dbPassword = iconv('utf-8', 'iso-8859-1', $user->Password);
        $dbPassword = stripslashes(decryptText($dbPassword));*/
         $dbPassword = base64_decode($user->Password);
         $dbPassword = decryptText($dbPassword);

    }
    else{
       
         $dbPassword = base64_decode($user->Password);
         $dbPassword = decryptText($dbPassword);
        

    } 
    
   
    return $dbPassword;
}

function decryptText($crypt){
    $rv = decrypt_md5($crypt, KEY);
    return $rv; 
}
function encryptText($text){
    $rv = crypt_md5($text, KEY);
    return $rv;
}

function distributeSongs($userId){
    $ds = new DataService;
    $app = $ds->getApplication($userId);
    if ($app) {
        $numSongs = $ds->getFeedbackNeededCount($userId);
        if ($numSongs < $app->SongsReview){
            $songsNeeded = $app->SongsReview - $numSongs;
            $acceptedGenres = ExpandGenre($app->MusicServed);
            $numSongsDistributed = $ds->distributeSongs($userId, $songsNeeded, $acceptedGenres);
        
            insertAuditLog($userId, 'Distribute Songs', json_encode(
                [
                    'numSongs'=> $numSongs,
                    'songsNeeded'=> $songsNeeded,
                    'songsDistributed'=> $numSongsDistributed
                ]));
        }
        $rv = "Your song review limit is $app->SongsReview; Feedback needed = $numSongs
            Accepted = $acceptedGenres; Songs Distributed = $numSongsDistributed";
    }
    else {
        $rv = "You do not have any subscriptions";
    }
    return $rv;
}

function ExpandGenre($genres){
    $rv = explode('|', $genres);
    $genreMap = getProperty('Genres');
    foreach ($genreMap as $value){
        if (in_array($value['key'], $rv)) array_push($rv, $value['value']);
    }
    $rv = array_map(function($x){return "'$x'";}, $rv);
    $rv = implode(',', $rv);
    return $rv;
}

function getApplication(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getApplicationByUserId($userId);
    return $rv;
}

function getApplications($skip,$take,$searchby,$sortkey,$sortreverse){
    $ds = new DataService;
    $rv = $ds->getApplications($skip,$take,$searchby,$sortkey,$sortreverse);
    return $rv;
}

function getApplicationsCount($searchby,$sortkey,$sortreverse){
    
    $ds = new DataService;
    $rv = $ds->getApplicationsCount($searchby,$sortkey,$sortreverse);
    return $rv;
}

function getArtistImage($filename){

    $filename = "../images/artist_images/$filename";
    $content = file_get_contents($filename);

    if($content == ""){
        $filename = "../images/artist_images/noimage.png";
        $content = file_get_contents($filename);
    }
    $rv = 'data:image/JPEG;base64,' . base64_encode($content);
    return $rv;
}

function getAudioSource(int $songId, bool $full = false){
    $userId = getUserId();
    $ds = new DataService;
    $sampleInfo = $ds->getSampleFilename($userId, $songId);
    if (!$sampleInfo){
        //throw new Exception('Sample not found', 404);
        $sampleInfo->SampleFile = createSampleFile($sampleInfo);
        $ds->updateSampleFile($songId, $sampleInfo->SampleFile);
    }

    if (!$sampleInfo->SampleFile) {
        $sampleInfo->SampleFile = createSampleFile($sampleInfo);
        $ds->updateSampleFile($songId, $sampleInfo->SampleFile);
    }

    $rv = "/$sampleInfo->SongPath/$sampleInfo->SampleFile";
    /*if (!file_exists("..$rv")){
        $sampleInfo->SampleFile = createSampleFile($sampleInfo);
        $ds->updateSampleFile($songId, $sampleInfo->SampleFile);
    }*/
    /*print_r($sampleInfo);
    echo $filename = "../$sampleInfo->SongPath/$sampleInfo->SampleFile";
    exit;*/
    $filename = "../$sampleInfo->SongPath/$sampleInfo->SampleFile";
            if (!isset($_SERVER['PATH_INFO'])) {
                $_SERVER['PATH_INFO'] = substr($_SERVER["ORIG_SCRIPT_FILENAME"], strlen($_SERVER["SCRIPT_FILENAME"]));
            }
            $request = substr($_SERVER['PATH_INFO'], 1);
            $file = $filename;
            $fp = fopen($file, 'r');
            if($fp){
            $size   = filesize($filename); // File size
            $length = $size;           // Content length
            
            $start  = 0;               // Start byte
            $end    = $size - 1;
            header('Content-type: audio/mpeg');
            header("Accept-Ranges: bytes");

            if (isset($_SERVER['HTTP_RANGE'])) {
                    $c_start = $start;
                    $c_end   = $end;
                    list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
                    /*if (strpos($range, ',') !== false) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }*/
                    if ($range == '-') {
                        $c_start = $size - substr($range, 1);
                    }else{
                        $range  = explode('-', $range);
                        $c_start = $range[0];
                        $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
                    }
                    $c_end = ($c_end > $end) ? $end : $c_end;
                    if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }
                    $start  = $c_start;
                    $end    = $c_end;
                    $length = $end - $start + 1;
                    fseek($fp, $start);
                    header('HTTP/1.1 206 Partial Content');
                }
                header("Content-Range: bytes $start-$end/$size");
                header("Content-Length: ".$length);
                $buffer = 1024 * 8;
                while(!feof($fp) && ($p = ftell($fp)) <= $end) {
                    if ($p + $buffer > $end) {
                        $buffer = $end - $p + 1;
                    }
                    set_time_limit(0);
                    echo fread($fp, $buffer);
                    flush();
                }
                fclose($fp);
                insertLog('Get Audio Source', null, Categories::Diagnostic, $userId, json_encode($sampleInfo));
            }
    /*if ($full){
        $filename = "../$sampleInfo->SongPath/$sampleInfo->SongFile";
        $content = file_get_contents($filename);
        $rv = 'data:audio/mpeg;base64,' . base64_encode($content);
    }*/
    //print_r($sampleInfo);
    //exit;


    
    exit;
    //return $rv;
}

function getAuditLog($skip, $take){
    $ds = new DataService;
    $rv = $ds->getAuditLog($skip, $take);
    return $rv;
}
function getCountries(){
    $ds = new DataService;
    $res = $ds->getCountries();
    $rv = convertToKVP($res, 'country_code', 'country_name');
    return $rv;
}

function getGenresList(){
    $ds = new DataService;
    $res = $ds->getGenresList();
    $rv = convertToKVP($res, 'Id', 'Name_GroupName');
    return $rv;
}

function getLibrary($skip, $take, $sortbygener, $sortkey,$sortreverse){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getLibrary($userId,$skip, $take, $sortbygener, $sortkey,$sortreverse);
    return $rv;
}
function LibraryCount($sortbygener, $sortkey,$sortreverse){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getLibraryCount($userId,$sortbygener, $sortkey,$sortreverse);
    return $rv;
}

function getLog($skip, $take){
    $ds = new DataService;
    $rv = $ds->getLog($skip, $take);
    return $rv;
}

function getPackagesList(){
    $ds = new DataService;
    $res = $ds->getPackagesList();
    $rv = convertToKVP($res, 'PkgId', 'PkgDisplayName');
    return $rv;
}

function getPortfolio($skip, $take){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolio($userId,$skip, $take);
    return $rv;
}
function PortfolioCount(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolioCount($userId);
    return $rv;
}



function getProperty($key){
    $ds = new DataService;
    $res = $ds->getProperty($key);
    if (strrpos($res->Value, '|') !== false){
        $rv = [];
        $arr = explode('|', $res->Value);
        foreach($arr as $value){
            $arr1 = explode(':', $value);
            array_push($rv, ['key'=> $arr1[0], 'value'=> $arr1[1]]);
        }
    }
    return $rv;
}

function getSongDuration($filename){
    
    // $mpeg = new mpeg($filename);
    // $mpeg->getInfo();
    // $info = $mpeg->return_info();
    // $songduration = $info['length'];

    $getID3 = new getID3();
    $result = $getID3->analyze($filename);

    return $result['playtime_string'];
}

function getSongs($skip, $take, $searchname){
    $ds = new DataService;
     $userId = getUserId();
    $rv = $ds->getSongs($skip, $take,$userId, $searchname);
    return $rv;
}

function getSongsCount($searchname){
    $ds = new DataService;
     $userId = getUserId();
    $rv = $ds->getSongsCount($userId,$searchname);
    return $rv;
}

function getSongsToReview($userId,$skip, $take){
    $ds = new DataService;
    //$numSongs = $ds->getFeedbackNeededCount($userId);
    //if ($numSongs == 0) distributeSongs($userId);
    //$rv = $ds->getSongsToReview($userId,$skip,$take);
    $generObj = $ds->getSongsToReviewgener($userId);
    
    /*print_r($generObj);
    exit;*/
    
    return $generObj;
}
function getsongsToReviewCount($userId){
    $ds = new DataService;
    $rv = $ds->getsongsToReviewCount($userId);
    return $rv;
}

function getStates(){
    $ds = new DataService;
    $res = $ds->getStates();
    $rv = convertToKVP($res, 'State_Abbr', 'State');
    return $rv;
}

function getUserId(bool $throwException = true){
    $rv = $_SESSION['userId'];

       if (!$rv)
        if ($throwException) throw new Exception('Unauthorized', 401); 
        else $rv = 0;
    
    return $rv;
}
/**
* Returns a GUIDv4 string
*
* Uses the best cryptographically secure method 
* for all supported pltforms with fallback to an older, 
* less secure version.
*
* @param bool $trim
* @return string
*/
function GUIDv4 ($trim = true)
{
    // Windows
    if (function_exists('com_create_guid') === true) {
        if ($trim === true)
            return trim(com_create_guid(), '{}');
        else
            return com_create_guid();
    }

    // OSX/Linux
    if (function_exists('openssl_random_pseudo_bytes') === true) {
        $data = openssl_random_pseudo_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);    // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);    // set bits 6-7 to 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    // Fallback (PHP 4.2+)
    mt_srand((double)microtime() * 10000);
    $charid = strtolower(md5(uniqid(rand(), true)));
    $hyphen = chr(45);                  // "-"
    $lbrace = $trim ? "" : chr(123);    // "{"
    $rbrace = $trim ? "" : chr(125);    // "}"
    $guidv4 = $lbrace.
              substr($charid,  0,  8).$hyphen.
              substr($charid,  8,  4).$hyphen.
              substr($charid, 12,  4).$hyphen.
              substr($charid, 16,  4).$hyphen.
              substr($charid, 20, 12).
              $rbrace;
    return $guidv4;
}

function insertAuditLog(int $userId, string $action, string $actionData = null){
    $ds = new DataService;
    $rv = $ds->insertAuditLog($userId, $action, $actionData);
    return $rv;
}

function insertLog(string $title, string $description = null, 
    int $categoryId = Categories::Diagnostic, int $userId = 0, string $logData = null){
    $ds = new DataService;
    $rv = $ds->insertLog($title, $description, $categoryId, $userId, $logData);
    return $rv;
}

function insertNotificationRequest($notificationRequest){
    try{
        if (ValidateMail($notificationRequest->email)[0]) {
            $ds = new DataService;
            $rv = $ds->insertNotificationRequest($notificationRequest);
            if ($rv > 0) sendNotificationAckEmail($notificationRequest);
            return $rv;
        }
        else
            return 0;
    }
    catch (Exception $e) {
        return 0;
    }
}

function massageSongProperties($song){
    if (!$song->distType) $song->distType = 'Random';
    if (!$song->region) $song->region = '';
    if (!$song->djAssociation) $song->djAssociation = '';
    if (!$song->normalDist) $song->normalDist = 'Y';
    if (!$song->subDistType) $song->subDistType = '';
    if (!$son->fans) $song->fans = '';
    //if (!$song->artistImage) $song->artistImage = 'thlogo.jpg';
    if (!property_exists($song, 'website')) $song->website = '';
    if (!property_exists($song, 'whereToBuy')) $song->whereToBuy = '';
    if (!property_exists($song, 'copyrightOwner')) $song->copyrightOwner = '';
}

function postFeedback($feedbackData){
    $ds = new DataService;
    $userId = getUserId();
    $rv = $ds->postFeedback($feedbackData, $userId);

    insertAuditLog($userId, 'Feedback Posted', json_encode($feedbackData));

    return $rv;
}
function postFeedbackcomment($feedbackData){
    $ds = new DataService;
    $userId = getUserId();
    $rv = $ds->postFeedbackcomment($feedbackData, $userId);

    insertAuditLog($userId, 'Feedback Posted', json_encode($feedbackData));

    return $rv;
}

function rejectApplication(int $appId): int {
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->updateApplication($appId, ['Approval_Status'=>'D']);
    $ds->updatedeletedateApplication($appId);
    if ($rv == 1) {
        sendRejectionEmail($appId);
        insertAuditLog($userId, 'Reject Application', json_encode($appId));
    }
    else{
        $rv = -1;
    }
    return $rv;
 }
 function deleteApplication(int $appId): int {
    $userId = getUserId();
    $ds = new DataService;
    $rvobj = $ds->getApplicationById($appId);
    

    if ($rvobj) {

        sendDeletionionEmail($appId);
        
        insertAuditLog($userId, 'Delete Application and User', json_encode($rvobj));
        $rv = $ds->deleteApplicationByadmin($appId);
        $rv1 =$ds->deleteUser($rvobj->UserId);

        //$rv = 1;
    }
    else{
        $rv = -1;
    }
    return $rv;
 }

 function resetPassword(string $username){
    $ds = new DataService;
    $user = $ds->getUser($username);
    if ($user) {
        $app = $ds->getApplicationByUserId($user->UserId);
        $resetGuid = GUIDv4();
        $rv = $ds->updateUser($user->UserId, ['ResetCode'=>$resetGuid]);
        sendResetPasswordEmail($user, $app, $resetGuid);
    }
 }
  function resetPasswords(string $username,string $email){
    $ds = new DataService;
    $user = $ds->getUserwithemail($username,$email);
    if ($user) {
        //$app = $ds->getApplicationByUserId($user->UserId);
        $resetGuid = GUIDv4();
        $rv = $ds->updateUser($user->UserId, ['ResetCode'=>$resetGuid]);
        sendResetPasswordEmail($user, $user->email, $resetGuid);
        return true;
    }else{
        return false;
    }
 }

 function sendApprovalEmail(int $appId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $app = $ds->getApplicationById($appId);
$usersdata = $ds->getUserById($app->UserId);
    if($app->FirstName != "" || $app->LastName != ""){
        $name = $app->FirstName." ".$app->LastName;
    }else{
        $name =$usersdata->Username;
    }

    $subject =  "Record Drop Account Activated-Approved";
    $recipient =  $app->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Hello $name<br><br>";
    $message .=  "Congratulations! Your RecordDrop.com Account is now open. Your user name is:<br><br>";
    $message .= "User Name: $usersdata->Username <br><br>";
    $message .= "You may log in immediately to begin receiving great new music by independent recording artists from around the world. As you use your account please keep in mind the following:<br><br>";
    $message .= "1. New songs can be reviewed from within your “Listening Room”. <br><br>";
    $message .= "2. You must submit feedback on a song before you can place it in your “Song Crate” to download it. .<br><br>";
    $message .= "3. After you place a song in your Song Crate you can add it to your playlist, download it, send messages to recording artists, and connect to the artist via their social media links (if available).<br><br>";
    $message .= "4. Songs that you do not listen to within 30 days will be purged from your account, but you can re-add it to your listening room by using song Browse/Search. <br><br>";

    $message .="If you have any questions or concerns, please feel free to contact us at support@recorddrop.com. <br><br>";
    $message .="Once again welcome, and enjoy the music! <br><br>";
    $message .="Member Services <br>";
    $message .="RecordDrop.com <br>";
   
    $message .=  "</td></tr></table></body></html>";
    smtpmail($from,$recipient,$subject,$message);
}

function sendCloseEmail(int $appId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;

    $ds = new DataService;
    $app = $ds->getApplicationById($appId);

    $subject =  "Member Close Email";
    $recipient =  $app->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear $app->LastName, $app->FirstName" . ",<br><br>";
    $message .=  "Your account has been closed. Please contact <a href='mailto:customerservice@$domain'>customerservice@$domain</a><br><br>";
    
    smtpmail($from,$recipient,$subject,$message);
}

function sendConfirmEmail($app, $conf_uid, $userId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;
    				
    $subject =  sprintf("Welcome to %s", SITE_TITLE);
    $recipient =  $app->email;
    $message = "Please click the below link to confirm your account";
    
    // $message .=  "<a  href='http://{$_SERVER['SERVER_NAME']}/confirm_application.php?r=".$conf_uid."&u=".$uid."'>http://{$_SERVER['SERVER_NAME']}/confirm_application.php?r=".$conf_uid."&u=".$uid."&musicpro=1</a>";
    //$url = "http://{$_SERVER['SERVER_NAME']}/api/register/confirm/$conf_uid/$userId";
    $url = "http://{$_SERVER['SERVER_NAME']}/emailverification/$conf_uid/$userId";
    $message .=  "<a  href='$url'>$url</a>";
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
    //mail($recipient, $subject, $message, $headers);
    //smtpmail('mnakum@webmyne.com',$recipient,$subject,$message);
    smtpmail($from,$recipient,$subject,$message);

}

function sendNotificationAckEmail($notificationRequest){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;

    $subject =  "Notification Request Acknowledgement Email";
    $recipient =  $notificationRequest->email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear Sir/Madam,<br><br>";
    $message .=  "Thank you for your interest in $title. The site is currently under construction. You will be notified via email when it is ready. Please contact <a href='mailto:customerservice@$domain'>customerservice@$domain</a><br><br>";
    if (strlen($notificationRequest->message) > 0)
        $message .= "The following message as been delivered to the admins on your behalf:<br>$notificationRequest->message";
    
    smtpmail($from,$recipient,$subject,$message);
}

function sendRejectionEmail(int $appId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;

    $ds = new DataService;
    $app = $ds->getApplicationById($appId);

    $subject =  "Member Rejection Email";
    $recipient =  $app->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear $app->LastName, $app->FirstName" . ",<br><br>";
    $message .=  "Your account has been denied. Please contact <a href='mailto:customerservice@$domain'>customerservice@$domain</a><br><br>";
    
    smtpmail($from,$recipient,$subject,$message);
}
function sendDeletionionEmail(int $appId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;

    $ds = new DataService;
    $app = $ds->getApplicationById($appId);

    $subject =  "Member Deletion Email";
    $recipient =  $app->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear $app->LastName, $app->FirstName" . ",<br><br>";
    $message .=  "Your account has been deleted. Please contact <a href='mailto:customerservice@$domain'>customerservice@$domain</a><br><br>";
    
    smtpmail($from,$recipient,$subject,$message);
}
function sendResetPasswordEmail($user, $email, $resetCode){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;
    				
    $subject =  'Password Reset';
    $recipient =  $email;
    $message = "Please click the below link to reset the password to your account";
    
    //$url = "http://{$_SERVER['SERVER_NAME']}/resetpassword?u=$user->Username&rc=$resetCode";
    $url = "http://{$_SERVER['SERVER_NAME']}/resetpassword/$user->Username/$resetCode";
    $message .=  "<a  href='$url'>$url</a>";
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
    //mail($recipient, $subject, $message, $headers);
    //smtpmail('mnakum@webmyne.com',$recipient,$subject,$message);
    smtpmail($from,$recipient,$subject,$message);

}
    
function sendSongData(int $songId){
    $userId = getUserId();
    $ds = new DataService;
    //make sure song is in user crate
    
    $crateEntry = $ds->getCrateEntry($userId, $songId);
    if ($crateEntry){
        $song = $ds->getSong($songId);
        if ($song){
            $filename = "../$song->SongPath/$song->SongFile";
            if (!isset($_SERVER['PATH_INFO'])) {
                $_SERVER['PATH_INFO'] = substr($_SERVER["ORIG_SCRIPT_FILENAME"], strlen($_SERVER["SCRIPT_FILENAME"]));
            }
            $request = substr($_SERVER['PATH_INFO'], 1);
            $file = $filename;
            $fp = fopen($file, 'r');
            if($fp){
            $size   = filesize($filename); // File size
            $length = $size;           // Content length
            
            $start  = 0;               // Start byte
            $end    = $size - 1;
            header("Pragma: public"); // required
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private",false); // required for certain browsers 
            header('Content-type: audio/mpeg');
           
            // header('Content-Type: application/octet-stream');
           
            header("Accept-Ranges: bytes");

            if (isset($_SERVER['HTTP_RANGE'])) {
                    $c_start = $start;
                    $c_end   = $end;
                    list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
                    /*if (strpos($range, ',') !== false) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }*/
                    if ($range == '-') {
                        $c_start = $size - substr($range, 1);
                    }else{
                        $range  = explode('-', $range);
                        $c_start = $range[0];
                        $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
                    }
                    $c_end = ($c_end > $end) ? $end : $c_end;
                    if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }
                    $start  = $c_start;
                    $end    = $c_end;
                    $length = $end - $start + 1;
                    fseek($fp, $start);
                    header('HTTP/1.1 206 Partial Content');
                }
                header("Content-Range: bytes $start-$end/$size");
                header("Content-Length: ".$length);
                header("Content-Disposition: attachment; filename=$song->Filename;");
                header("Content-Transfer-Encoding: binary");
                $buffer = 1024 * 8;
                while(!feof($fp) && ($p = ftell($fp)) <= $end) {
                    if ($p + $buffer > $end) {
                        $buffer = $end - $p + 1;
                    }
                    set_time_limit(0);
                    echo fread($fp, $buffer);
                    flush();
                }
                fclose($fp);
                insertLog('Song Downloaded', null, Categories::Diagnostic, $userId, json_encode($songId));
            
            }
            /*header("Pragma: public"); // required
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private",false); // required for certain browsers 
            header("Content-Type: audio/mpeg");
            header("Accept-Ranges: bytes");
            header("Content-Range: bytes $start-$end/$size");
            header("Content-Length: ".$length);
            header("Content-Disposition: attachment; filename=$song->Filename;");
            header("Content-Transfer-Encoding: binary");
            readfile("$filename");*/

            
            exit();
           
        }
        else
            throw new Exception('Song not found', 404);
    }
    else{
        $song = $ds->getSongbyuser($songId,$userId);
        if ($song){
            $filename = "../$song->SongPath/$song->SongFile";
            if (!isset($_SERVER['PATH_INFO'])) {
                $_SERVER['PATH_INFO'] = substr($_SERVER["ORIG_SCRIPT_FILENAME"], strlen($_SERVER["SCRIPT_FILENAME"]));
            }
            $request = substr($_SERVER['PATH_INFO'], 1);
            $file = $filename;
            $fp = fopen($file, 'r');
            if($fp){
            $size   = filesize($filename); // File size
            $length = $size;           // Content length
            
            $start  = 0;               // Start byte
            $end    = $size - 1;
            header('Content-type: audio/mpeg');
            header("Accept-Ranges: bytes");

            if (isset($_SERVER['HTTP_RANGE'])) {
                    $c_start = $start;
                    $c_end   = $end;
                    list(, $range) = explode('=', $_SERVER['HTTP_RANGE'], 2);
                    /*if (strpos($range, ',') !== false) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }*/
                    if ($range == '-') {
                        $c_start = $size - substr($range, 1);
                    }else{
                        $range  = explode('-', $range);
                        $c_start = $range[0];
                        $c_end   = (isset($range[1]) && is_numeric($range[1])) ? $range[1] : $size;
                    }
                    $c_end = ($c_end > $end) ? $end : $c_end;
                    if ($c_start > $c_end || $c_start > $size - 1 || $c_end >= $size) {
                        header('HTTP/1.1 416 Requested Range Not Satisfiable');
                        header("Content-Range: bytes $start-$end/$size");
                        exit;
                    }
                    $start  = $c_start;
                    $end    = $c_end;
                    $length = $end - $start + 1;
                    fseek($fp, $start);
                    header('HTTP/1.1 206 Partial Content');
                }
                header("Content-Range: bytes $start-$end/$size");
                header("Content-Length: ".$length);
                $buffer = 1024 * 8;
                while(!feof($fp) && ($p = ftell($fp)) <= $end) {
                    if ($p + $buffer > $end) {
                        $buffer = $end - $p + 1;
                    }
                    set_time_limit(0);
                    echo fread($fp, $buffer);
                    flush();
                }
                fclose($fp);
                insertLog('Song Downloaded', null, Categories::Diagnostic, $userId, json_encode($songId));
            }
            /*header("Pragma: public"); // required
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private",false); // required for certain browsers 
            header("Content-Type: audio/mpeg");
            header("Accept-Ranges: bytes");
            header("Content-Range: bytes $start-$end/$size");
            header("Content-Length: ".$length);
            header("Content-Disposition: attachment; filename=$song->Filename;");
            header("Content-Transfer-Encoding: binary");
            readfile("$filename");*/
 
            exit();
           
        }
        else
            throw new Exception('Song not found', 404);
        //throw new Exception('Forbidden', 403);
    }
}

function smtpmail($from,$to,$subject,$body,$pathprefix = '')
{
$title = SITE_TITLE;
//$from = DO_NOT_REPLY_EMAIL;
$domain = EMAIL_DOMAIN;

$mail = new PHPMailer();

/*$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = "mail.webmyne.com";  // specify main and backup server
$mail->SMTPAuth = true;     // turn on SMTP authentication
$mail->Username = "mnakum@webmyne.com";  // SMTP username
$mail->Password = "1234567890"; // SMTP password



$mail->From = "donotreply@recorddrop.com"; 
$mail->FromName = "recorddrop.com";
$mail->AddAddress("".$to."");
$mail->AddAddress("manish_nakum@hotmail.com", "Information");
$mail->AddAddress("mnakum@webmyne.com", "Information");
$mail->AddReplyTo($from);
*/

$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = "smtp.gmail.com";  // specify main and backup server
$mail->SMTPAuth = true; 
$mail->SMTPSecure = 'ssl';    // turn on SMTP authentication
//$mail->Username = "donotreply@recorddrop.com";  // SMTP username
//$mail->Password = "donotreply"; // SMTP password
$mail->Username = "himanshudrupal@gmail.com";
$mail->Password = "DRUPAL$$777";
$mail->Port = 465;



$mail->From = "support@recorddrop.com"; 
$mail->FromName = "recorddrop.com";
$mail->AddAddress("".$to."");
//$mail->AddAddress("manish_nakum@hotmail.com", "Information");
//$mail->AddAddress("mnakum@webmyne.com", "Information");
$mail->AddReplyTo($from);


$mail->WordWrap = 50;                                 // set word wrap to 50 characters
$mail->AddAttachment("/var/tmp/file.tar.gz");         // add attachments
$mail->AddAttachment("/tmp/image.jpg", "new.jpg");    // optional name
$mail->IsHTML(true);                                  // set email format to HTML
$mail->Timeout = 60;

$mail->Subject = $subject;
$mail->Body    = $body."</b>";
$mail->AltBody = "";

$status_of_to = ValidateMail($to);

if($status_of_to[0])
{
	if(!$mail->Send())
	{
       insertAuditLog(getUserId(false), 'Sent Email Error', json_encode($mail));
       //echo "Message could not be sent. <p>";
	   //echo "Mailer Error: " . $mail->ErrorInfo;
	   //exit;
    }
    
    insertAuditLog(getUserId(false), 'Sent Email', json_encode(
        [
            'to' => $to,
            'subject' => $subject,
            'body' => $body
        ]
    ));
    
}
/*

    require("path.php");
    require("Mail.php");
	
$from = "recorddrop.com <".$from.">";
$to = "Ramona Recipient <".to.">";

$from = "donotreply@recorddrop.com";
$host = "mail.recorddrop.com";
$username = "donotreply@recorddrop.com";
$password = "donotreply";


$headers = array ('From' => $from,
  'To' => $to,
  'Subject' => $subject);

$smtp = Mail::factory('smtp',
  array ('host' => $host,
    'auth' => true,
    'username' => $username,
    'password' => $password));


$mail = $smtp->send($to, $headers, $body);


		 if (PEAR::isError($mail)) 
		 {
		 
		  echo("<p>" . $mail->getMessage() . "</p>");
		 
		 } 
		 else 
		 {
		  
		  echo("<p>Message successfully sent!</p>");
 		 
		 }

*/

}	

function submitApplication($app){
    $rv = 0; //success
    $ds = new DataService;
  
    $dateOfBirth = $app->dob;
	$today = date("Y-m-d");
	$diff = date_diff(date_create($dateOfBirth), date_create($today));
   
    //Validate application !$app->firstName || !$app->lastName ||
    if(!$app->username || !$app->password || !$app->confirmPassword || 
         !$app->dob ||  !$app->email) {
        $rv = 1;    //Missing data
    }
    elseif(!preg_match("/^[a-zA-Z0-9]+/", $app->username) || 
        strcmp($app->password, $app->confirmPassword)!= 0 ||
        ($app->website && !is_url($app->website)) ) {	
        $rv = 2; //"Invalid data
    }
    elseif ($ds->userExists($app->username)) {
        $rv = 3;    //Username already taken 
    }
    else {
        
        $userId = $ds->insertUser($app->username, $app->password, $app->email , $app->facebookid);
        if ($userId){
            $conf_uid = mt_rand();
            $appId = $ds->insertApplication($app, $userId, $conf_uid);
            if ($appId){
               if($app->uploadasong == "No"){
                    $packageid=117;
                    sendConfirmEmail($app, $conf_uid, $userId);
                    sendAdminApplicationEmail($app, $userId,$packageid);
                }
            }
            else {
                $rv = 5;    //failed to insert application
                $ds->deleteUser($userId);
            }
        }
        else {
            $rv = 4;    //failed to insert user
        }
    }

    $rv = new ApiResults($rv);
    
    if ($rv->status == 0){
        $rv->data = new stdClass();
        $rv->data->uploadasong = $app->uploadasong;
        $rv->data->appId = $appId;
        $rv->data->userId = $userId;
       /* $rv->data->package = $ds->getPackage($app->package);
        $rv->data->package->appId = $appId;
        $rv->data->package->userId = $userId;
        if ($rv->data->package->Price > 0) $rv->data->payment = createPayPalPayment($rv->data->package);*/
    }
    return $rv;
	
}

function updateApplicationStatus(int $appId, string $status): int {
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->updateApplication($appId, ['Approval_Status'=>$status]);
    if($status == 'D' || $status == 'C'){
        $ds->updatedeletedateApplication($appId);

    }
    
    if ($rv == 1) {
        switch($status) {
            case 'A':
                sendApprovalEmail($appId);
                break;
            case 'D':
                sendRejectionEmail($appId);
                break;
            case 'C':
                sendCloseEmail($appId);
                break;
        }
        insertAuditLog($userId, 'Update Application Status', json_encode(['AppId'=>$appId, 'Status'=>$status]));
    }
    else{
        $rv = -1;
    }
    return $rv;
 }

 function updateSong($song){
    $userId = getUserId();
    $username = $_SESSION['username'];

        //Create db record

        massageSongProperties($song);

        $ds = new DataService;
        
        $rv = $ds->updateSong($song);

        insertAuditLog($userId, 'Updated Song', json_encode($song));

        return $rv;
}
 function updateSongs($song){
    $userId = getUserId();
    $username = $_SESSION['username'];
    if($song->imageInput != ""){
    $sitepath="http://uat.recorddrop.com/images/artist_images";
    $ProfilePath = "images/artist_images";
    if(!file_exists("../$ProfilePath")) {
        mkdir("../$ProfilePath");
         chmod($dest, 0777);
    }
    $base64 = substr($song->imageInput, strpos($song->imageInput, 'base64,') + 7);
    $bytes = base64_decode($base64);

    list($type, $data) = explode(';', $song->imageInput);
    list(, $data)      = explode(',', $data);
     $data = base64_decode($data);
 
    $songFile = 'Song_'.create_guid().'.jpg';

    file_put_contents("../$ProfilePath/$songFile", $data);
    $imagepath=$sitepath."/".$songFile;

    $newsongFile = '250_Song_'.create_guid().'.jpg';
    $newsongFilepath="../images/artist_images/".$newsongFile;
    $image = new SimpleImage(); 
    $image->load($imagepath); 
    $image->resize(250,250);
    $image->save($newsongFilepath);

    $song->artistImage=$newsongFile;
    unlink($imagepath);
    }

    massageSongProperties($song);

    $ds = new DataService;
    $rv = $ds->updateSong($song);
    sendSonguploadedEmail($userId);
    unset($song->avatar);
    unset($song->imageInput);
    insertAuditLog($userId, 'Updated Song', json_encode($song));
    return $rv;
}

function uploadSong($song){
    $userId = getUserId();
    $username = $_SESSION['username'];
    if($song->artist_image){
    /* artist_images upload code */ 
    $sitepath="http://uat.recorddrop.com/images/artist_images";
    $ProfilePath = "images/artist_images";
    if(!file_exists("../$ProfilePath")) {
        mkdir("../$ProfilePath");
         chmod($dest, 0777);
    }
    $artbase64 = substr($song->artist_image, strpos($song->artist_image, 'base64,') + 7);
    //$bytes = base64_decode($artbase64);

    list($type, $data) = explode(';', $song->artist_image);
    list(, $data)      = explode(',', $data);
     $data = base64_decode($data);
 
    $songFile = 'Song_'.create_guid().'.jpg';

    file_put_contents("../$ProfilePath/$songFile", $data);
    $imagepath=$sitepath."/".$songFile;

    $newsongFile = '250_Song_'.create_guid().'.jpg';
    $newsongFilepath="../images/artist_images/".$newsongFile;
    $image = new SimpleImage(); 
    $image->load($imagepath); 
    $image->resize(250,250);
    $image->save($newsongFilepath);

    $song->artist_image=$newsongFile;
    unlink($imagepath);

    }
    else{
        
        $song->artist_image="noimage.png";
    }

    /* mp3 song upload code */ 
    $songPath = "songs/$username";
    if(!file_exists("../$songPath")) {
        mkdir("../$songPath");
        // chmod($dest, 0777);
    }
    $songFile = 'Full_' . create_guid() . '.mp3';

    //Save song to disk
    $base64 = substr($song->file->data, strpos($song->file->data, 'base64,') + 7);
    $bytes = base64_decode($base64);
    if (file_put_contents("../$songPath/$songFile", $bytes)){
        //Create sample
        $sampleInfo = (object)[
            'SongPath' => $songPath,
            'SongFile' => $songFile,
        ];
        $sampleInfo->SampleFile = createSampleFile($sampleInfo);
        if(!$sampleInfo->SampleFile) $sampleInfo->SampleFile = null;

        //Create db record
        $song->SongPath = $songPath;
        $song->SongFile = $songFile;
        $song->SampleFile = $sampleInfo->SampleFile;
        $song->duration = getSongDuration("../$songPath/$songFile");
        massageSongProperties($song);

        $ds = new DataService;
        $rv = $ds->insertSong($song, $userId);

        insertAuditLog($userId, 'Uploaded Song', json_encode([
            'songId'=>$rv,
            'sampleInfo'=> $sampleInfo
        ]));

        return $rv;
    }
    else
        throw new Exception("Unable to create file $songFile : $song->file->filename");
}

function userIsAdmin(int $userId): bool {
    $ds = new DataService;
    $admindetail=$ds->getUserById($userId);
    if($admindetail->admin_status == '1' || $admindetail->admin_status == '2' || $admindetail->admin_status == '3' || $admindetail->admin_status == '4' || $admindetail->admin_status == '5'){
        $rv = $admindetail->admin_status;
    }
    
    return $rv;
}

function ValidateMail($Email) { 

    global $HTTP_HOST; 

    $result = array(); 

    if (!preg_match('/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/i', $Email)) { 

  			$result[0]=false; 

        $result[1]="$Email is not properly formatted"; 

        return $result; 

    }
	
    //2015-12-31 Ian Pitt - Domain validation is flaky so skip it for now
    /*
    list ( $Username, $Domain ) = split ("@",$Email); 

  	
	if (getmxrr($Domain, $MXHost))  { 



        $ConnectAddress = $MXHost[0]; 

    } else { 


        $ConnectAddress = $Domain; 



   }

    $Connect = fsockopen ( $ConnectAddress, 25 ); 


    if ($Connect) { 



        if (ereg("^220", $Out = fgets($Connect, 1024))) { 

        	stream_set_timeout($Connect, 1);
        	
        	while ($Out = fgets($Connect, 1024) !== false){
        		//echo "Hello $Out";
        	}
        	
           fputs ($Connect, "HELO $HTTP_HOST\r\n"); 

           $Out = fgets ( $Connect, 1024 ); 

           fputs ($Connect, "MAIL FROM: <{$Email}>\r\n"); 

           $From = fgets ( $Connect, 1024 ); 

           fputs ($Connect, "RCPT TO: <{$Email}>\r\n"); 

           $To = fgets ($Connect, 1024); 

           fputs ($Connect, "QUIT\r\n"); 

           fclose($Connect); 

//echo "<br>$From<br>$To<br>";

				if (!ereg ("^250", $From) || !ereg ( "^250", $To )) 
				{ 
				   $result[0]=false; 
				   $result[1]="$Email Server rejected address"; 
				   return $result; 
				} 

        } else { 



            $result[0] = false; 

            $result[1] = "No response from server"; 

            return $result; 

          } 



    }  else { 



        $result[0]=false; 

        $result[1]="Can not connect E-Mail server."; 

        return $result; 

    }
    */ 

    $result[0]=true; 

    $result[1]="$Email appears to be valid."; 

    return $result; 

}

function getPassword($username){
    $ds = new DataService;
    $user = $ds->getUser($username);
    $dbPassword = iconv('utf-8', 'iso-8859-1', $user->Password);
    $rv = stripslashes(decrypt_md5($dbPassword, KEY)); 
    return $rv;
}

function applicationsUserCount(){

    $ds = new DataService;
    $rv = $ds->getapplicationsUserCount();
    return $rv;
}

function getallSongsCount(){
    $ds = new DataService;
    $rv = $ds->getallSongsCount();
    return $rv;
}
function getallArtistCount(){
    $ds = new DataService;
    $rv = $ds->getallArtistCount();
    return $rv;
}

function submitfacebookapplication($email,$name,$id){
    $rv = 0; //success
    $ds = new DataService;
    //print_r($app);
    
    $userId = $ds->checkfbUser($email,$id);
    
    $rv = $ds->getUserById($userId);

    $rv->isAuthenticated = true;
     return $rv;
}


function getapplicationpackage(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getapplicationpackageByUserId($userId);
    return $rv;
}
function getsonguploadsCountByUser(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsonguploadsCountByUser($userId);
    return $rv;
}
function getsonguploadsRemainingCountByUser(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsonguploadsRemainingCountByUser($userId);
    return $rv;
}
function getdeletesongs($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getdeletesongs($userId,$songId);
    return $rv;
}
function geteditsongbyuser($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->geteditsongbyuser($userId,$songId);
    return $rv;
}
function getupdateGeneralinfo($appGeneralinfo){
    
    $userId = getUserId();
    $username = $_SESSION['username'];
    $ProfilePath = "images/ProfileImage/$username";
    if(!file_exists("../$ProfilePath")) {
        mkdir("../$ProfilePath");
         chmod($dest, 0777);
    }

    if($appGeneralinfo->imageInput != ""){
     $base64 = substr($appGeneralinfo->imageInput, strpos($appGeneralinfo->imageInput, 'base64,') + 7);
    
    $bytes = base64_decode($base64);

    list($type, $data) = explode(';', $appGeneralinfo->imageInput);
    list(, $data)      = explode(',', $data);
     $data = base64_decode($data);
 
    $songFile = 'Prifile_'.create_guid().'.jpg';

    file_put_contents("../$ProfilePath/$songFile", $data);



    $appGeneralinfo->imageInput=$ProfilePath.'/'.$songFile;
    }else{
        $appGeneralinfo->imageInput="";
    }
    $ds = new DataService;
    $rv = $ds->getupdateGeneralinfo($appGeneralinfo);
    return $rv;

}
function getupdateGetmusic($appGetmusicinfo){
    //print_r($appGeneralinfo);
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getupdateGetmusic($userId,$appGetmusicinfo);
    return $rv;

}
function getFrontsongs($skip, $take, $searchval){
    $ds = new DataService;
    $rv = $ds->getFrontsongs($skip, $take, $searchval);
    return $rv;
}

function getFrontsongsCount($searchval){
    $ds = new DataService;
    $rv = $ds->getFrontsongsCount($searchval);
    return $rv;
}
function getFrontallsongs($skip, $take){
    $ds = new DataService;
    $rv = $ds->getFrontallsongs($skip, $take);
    return $rv;
}

function getFrontallsongsCount(){
    $ds = new DataService;
    $rv = $ds->getFrontallsongsCount();
    return $rv;
}
function getaddSongToListeningRoom($songId){
    $userId = getUserId();
    $ds = new DataService;
    
    $songsDistributed = $ds->getSong_Distribution($songId,$userId);
    if($songsDistributed){
        $createntry = $ds->getCrateEntry($userId,$songId);
        if($createntry){
            $rv = 1;
            
            //$rv->error = "The song has already been reviewed and is in your Song Crate";
        }else{
            $rv = 2;
            
            //$rv->error = "The song is already in your Listening Room waiting for you review";
        }

    }else{
        $songsFeedback = $ds->getsongFeedback($songId,$userId);
         if($songsFeedback){
            $rv = 3;
            //$rv->error = "You have already submitted feedback on this song, would you like to add it to your Song Crage” Y/N";

         }else{
            $rv1 = $ds->getaddSongToListeningRoom($userId,$songId);
            $rv = 4;
            //$rv->error = "The song is add in your Listening Room waiting for you review";
         }
    }
   
    return $rv;
}
function getSongFeedback($songId){
    //print_r($appGeneralinfo);
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->geteditSongFeedback($userId,$songId);
    return $rv;

}
function getpostMessage($songId,$subject,$messsage){
    //print_r($appGeneralinfo);
    $from_user = getUserId();
    $ds = new DataService;
    $song = $ds->getSong($songId);
    $to_user=$song->UserId;
    
    $rv = $ds->getpostMessage($from_user,$to_user,$songId,$subject,$messsage);
    return $rv;

}

function getpromember(){
    $user_id = getUserId();
    $ds = new DataService;
    $rv = $ds->getpromember($user_id);
    return $rv;

}
function getFavouriteMembers(){
    $user_id = getUserId();
    $ds = new DataService;
    $rv = $ds->getFavouriteMember($user_id);
    //print_r($rv);
    return $rv;
}
function getFavouriteMemberStateOrProvinance(){
    $user_id = getUserId();
    $ds = new DataService;
    $rv = $ds->getFavouriteMemberStateOrProvinance($user_id);
    //print_r($rv);
    return $rv;
}


function getsubmitdistribution($song){
    //print_r($song);
    $songid=$song->songid;
    $Favorites=$song->addLink;
    $fans=$song->favourite;
    $fansfav='';
    if($Favorites == "Yes" &&  $fans =="Individual"){
        $normal_dist='N';
        $fansfav = implode(',', $song->fav);
        $dist_type='Favourite';
        $sub_distype='Individual';
        $Region='';
    }else if($Favorites == "Yes" &&  $fans =="Allfans"){
        $normal_dist='N';
        $dist_type='Favourite';
        $sub_distype='Allfans';
        $fansfav='';
        $Region='';
    }else if($Favorites == "Yes" &&  $fans =="Regions"){
        $normal_dist='N';
        $dist_type='Favourite';
        $sub_distype='Regions';
        $fansfav='';
        $Region=implode(',', $song->region);

    }else{
        
        $normal_dist='Y';
        $fansfav='';
        $dist_type='Normal';
        $sub_distype='';
        $Region='';
    }


    $user_id = getUserId();
    $ds = new DataService;

    $rv = $ds->getsubmitdistribution($songid,$normal_dist,$dist_type,$sub_distype,$fansfav,$Region);
    //sendSonguploadedEmail($user_id);
    //insertAuditLog($userId, 'Your Song has been uploaded', json_encode(['SongId'=>$songid]));
    //print_r($rv);
    return $rv;
}
 function sendSonguploadedEmail($user_id){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($user_id);
    $usersdata = $ds->getUserById($appdata->UserId);
    if($appdata->FirstName != "" || $appdata->LastName != ""){
        $name = $appdata->FirstName." ".$appdata->LastName;
    }else{
        $name =$usersdata->Username;
    }

    $subject =  "Your Song has been uploaded";
    $recipient =  $appdata->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear " . $name.",<br><br>";
    $message .=  "The song(s) that you uploaded has been received and is currently under review by our Quality Assurance department. RecordDrop.com requires that all songs submitted meet minimum standards of audio quality before we distribute them. During the review process all songs uploaded are checked for things such as pops, white noise, muffled or incoherent words or music, or just plain bad audio quality. In the event a song does not pass QA it will not be distributed. However, if the song is not distributed you will retain the storage allotment that you had in your package prior to uploading. You will be receiving an e-mail shortly letting you know the status of your song. In the mean time if you have questions you may contact us at Support@recorddrop.com. <br><br>";
    $message .=  "<br><br>Sincerely,<br>Member Services<br>RecordDrop.com</td></tr></table></body></html>";
    smtpmail($from,$recipient,$subject,$message);
}


function SongApprove($filterby,$skip, $take){
    $ds = new DataService;
    $rv = $ds->SongApprove($filterby,$skip, $take);
    return $rv;
}
function SongApproveCount($filterby){
   $ds = new DataService;
    $rv = $ds->SongApproveCount($filterby);
    return $rv;
}

function getApprovesong($songId,$UserId){
    $ds = new DataService;
    $rv = $ds->getGlobalSetting();
    $DISTRIBUTION_VALUE=$rv->set_distibution;
    $approvesong = $ds->getApprovesong($songId);
    if($approvesong){
        $ds->setDistDatesong($songId);
    }
    $song_data = $ds->getSongfordistribute($songId);
    $Dist_Type = $song_data->Dist_Type;
    $sub_distype = $song_data->sub_distype;
    $normal_dist = $song_data->Normal_Dist; 
    $fanlist = $song_data->fans; 
    $gengroup =  $song_data->Genername;

    $UserId =  $song_data->UserId;
    $Region =  $song_data->Region;
    $song_data = $ds->getUsersfordistribute($UserId,$normal_dist,$Dist_Type,$sub_distype,$fanlist,$gengroup,$Region,$DISTRIBUTION_VALUE);
    foreach ($song_data as $val_song_data) {
        //print_r($val_song_data);
        $dist_UserId=$val_song_data['UserId'];
         $SongsReview=$val_song_data['SongsReview'];
        $Email=$val_song_data['Email'];
        $songdistributed = $ds->checksongreviewlimit($dist_UserId,date('m'),date('Y'));
         $songremains =  $SongsReview - $songdistributed;
       
        if($songremains > 0) 
        {
            $ds->insertindistribute($dist_UserId,$songId);
            //sendnewSongaddEmail($Email);
            $ds->setDistDatesong($songId);

        }

    }
    //exit;
     sendapproveSongEmail($UserId);

    return $approvesong;
}
function sendapproveSongEmail($UserId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($UserId);
    $usersdata = $ds->getUserById($appdata->UserId);
    if($appdata->FirstName != "" || $appdata->LastName != ""){
        $name = $appdata->FirstName." ".$appdata->LastName;
    }else{
        $name =$usersdata->Username;
    }

    $subject =  "Song Approved";
    $recipient =  $appdata->Email;
    $message =  "Congratulations $name,<br><br> ";
    $message .=  "We are very pleased to inform you that your song has passed QA and has been distributed to the RecordDrop.com community and/or direct to your fans. You can expect to receive feedback on your song soon. To view the ratings and feedback that your song has, log in with your User Name and Password. Your song’s feedback will be listed under the “Profiles” section of your account. If you have questions about your account, you may send an email to support@recorddrop.com.<br><br> ";        
    $message .= "Once again congratulations and we wish you much success.<br><br>"; 
    $message .= "Members Services<br>";
    $message .= "RecordDrop.com<br>";   

    smtpmail($from,$recipient,$subject,$message);
}
 function sendnewSongaddEmail($Email){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    

    $subject =  "New songs have been added to your recorddrop.com account";
    $recipient =  $Email;
    $message =  "Dear Member,<br><br> ";
    $message .=  "New songs have been added to your recorddrop.com account. Log in today to hear these great new songs from some of the hottest major and independent recording artist in the music industry today.<br><br> ";        
    $headers =  "From: recorddrop <noreply@recorddrop.com >\n";
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n";  
    smtpmail($from,$recipient,$subject,$message);
}



function getRejectsong($songId,$UserId){
   $ds = new DataService;
    $rv = $ds->getRejectsong($songId);
    sendSongrejectEmail($UserId);
    return $rv;
}
 function sendSongrejectEmail($UserId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($UserId);
    $usersdata = $ds->getUserById($appdata->UserId);
    if($appdata->FirstName != "" || $appdata->LastName != ""){
        $name = $appdata->FirstName." ".$appdata->LastName;
    }else{
        $name =$usersdata->Username;
    }

    $subject =  "Song Rejected";
    $recipient =  $appdata->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'>";
    $message .= "Dear " . $name.",<br><br>";
    $message .=  "After thorough review the song that you have submitted for review has not been distributed for the following reason.<br><br>";
    $message .=  "• The song does not meet our minimum standard for song audio quality.<br><br>";
    $message .=  "• The song violates our member policy or user agreement regarding lyrical content or copyright usage.<br><br>";
    $message .=  "Although your song has not been distributed, your account will retain the storage capacity contained within your song package prior to uploading. If you believe the outcome of our review to be in error, you may simply re-upload the song(s) and our QA department will be more than happy to review it again or you may email our Customer Support department at support@recorddrop.com.<br><br>";
    $message .=  "Thank you!.<br><br>";
    $message .=  "Member Services<br>";
    $message .=  "RecordDrop.com<br>";
    $message .=  "</td></tr></table></body></html>";
    
    smtpmail($from,$recipient,$subject,$message);
}


function getsongreviewedcount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsongreviewedcount($userId,$songId);
    return $rv;
}
function getsongcrateaddedcount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsongcrateaddedcount($userId,$songId);
    return $rv;
}
function getsongcrateaddedcountinuser($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsongcrateaddedcountinuser($userId,$songId);
    return $rv;
}

function getsongfavouriteaddedcount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsongfavouriteaddedcount($userId,$songId);
    return $rv;
}


function getSongFeedbackinfo($songId){
    //,$skip, $take
    $userId = getUserId();
    $ds = new DataService;
    //$rv = $ds->getSongFeedbackinfo($userId,$songId,$skip, $take);
    $rv = $ds->getSongFeedbackinfo($userId,$songId);
    
    return $rv;
}
function getSongFeedbackinfocount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getSongFeedbackinfocount($userId,$songId);
    return $rv;
}
function getSongpostMessage($songId,$Rec_UserId,$subject,$messsage){
    //print_r($appGeneralinfo);
    $from_user = getUserId();
    $ds = new DataService;
    $to_user=$Rec_UserId;
    
    $rv = $ds->getSongpostMessage($from_user,$to_user,$songId,$subject,$messsage);
    return $rv;

}
function getSendGeolocationMessage($songId,$region,$subject,$messsage){
    //print_r($appGeneralinfo);
    $from_user = getUserId();
    $ds = new DataService;
    $to_user=$Rec_UserId;
    
    $rv = $ds->getSendGeolocationMessage($from_user,$region,$songId,$subject,$messsage);
    return $rv;

}

function getAdminuser($skip, $take){
    $ds = new DataService;
    $rv = $ds->getAdminuser($skip, $take);
    return $rv;
}

function getAdminuserCount(){
    $ds = new DataService;
    $rv = $ds->getAdminuserCount();
    return $rv;
}

function addadminuser($username, $password,$adminstatus,$email)
{
     $ds = new DataService;
    $rv = $ds->addadminuser($username, $password,$adminstatus,$email);
    return $rv;
}
function getadmindetails($userId)
{
     $ds = new DataService;
    $rv = $ds->getadmindetails($userId);
    return $rv;
}
function editadminuser($userId, $username, $password,$email,$adminstatus)
{
     $ds = new DataService;
    $rv = $ds->editadminuser($userId, $username, $password,$email,$adminstatus);
    return $rv;
}
function getdeleteadminuser($userId)
{
     $ds = new DataService;
    $rv = $ds->getdeleteadminuser($userId);
    return $rv;
}
function sharemycrate($crateUsername){

    //print_r($crateUsername);
    $userid = getUserId();
    $ds = new DataService;
    $user = $ds->getUser($crateUsername);
    if($user){

        if($userid == $user->UserId)
        {
            return 2;
        }else{
            $checkcrate = $ds->checksharemycrate($userid,$user->UserId);
           
            if($checkcrate){
                return 3;
            }else{
                $rv = $ds->getsharemycrate($userid,$user->UserId);
                sendsharemycrateEmail($userid,$user);
                return 1;
            }
            
        }
         
    }else{
        return false;
    }
   

}

function sendsharemycrateEmail($UserId,$user){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($user->UserId);
    $usersdata = $ds->getUserById($UserId);
    $subject =  "Song Share Crate";
    $recipient =  $appdata->Email;
    
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear " . $user->Username. ",<br><br>";
    $message .=  "Dear recorddrop.Com Member,
                <p> ".$usersdata->Username." Send to Song Crate Request. Please Approve My Song Crate Request. ";
    $message .=  "</p></td></tr></table></body></html>";
    
    smtpmail($from,$recipient,$subject,$message);
}

function getSongcratefriendsinfo($skip, $take){
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getSongcratefriendsinfo($userid,$skip,$take);
    return $rv;
}
function getSongcratefriendsinfoCount(){
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getSongcratefriendsinfoCount($userid);
    return $rv;
}
function getPendingSongcratefriendsinfo($skip, $take){
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getPendingSongcratefriendsinfo($userid,$skip, $take);
    return $rv;
}
function getPendingSongcratefriendsinfoCount(){
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getPendingSongcratefriendsinfoCount($userid);
    return $rv;
}

function getSongcraterequests($skip, $take)
{
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getSongcraterequests($userid,$skip, $take);
    return $rv;
}

function getSongcraterequestCounts(){
    $userid = getUserId();
    $ds = new DataService;
    $rv = $ds->getSongcraterequestCounts($userid);
    return $rv;
}
function actionrequestsongcrate($crateid,$touserid,$status){
    $from_userid = getUserId();
    $ds = new DataService;

    if($status == 'Approved'){
        //echo $crateid."===".$from_userid;
        $crateinfo = $ds->checksongcrate($crateid);
        $touserid=$crateinfo->from_userid;
        $fromuserid=$crateinfo->to_userid;
         approvesongcrateEmail($touserid, $fromuserid);
        
    }else if($status == 'Denied'){
        $crateinfo = $ds->checksongcrate($crateid);
        $touserid=$crateinfo->from_userid;
        $fromuserid=$crateinfo->to_userid;
        denysongcrateEmail($touserid, $fromuserid);
       
    }else if($status == 'Block'){
        $status = 'Pending';
        $block_status='Block';
    }else if($status == 'Unblock'){
        $status = 'Pending';
        $block_status='';
    }else{
        $block_status='';
    }
    $rv = $ds->getactionrequestsongcrate($crateid,$status,$block_status);
    return $rv;
}

function approvesongcrateEmail($touserid,$fromuserid){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($touserid);
    $usersdata = $ds->getUserById($touserid);
    $fromusersdata = $ds->getUserById($fromuserid);
    $subject =  "Approved Song Share Crate ";
    $recipient =  $appdata->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear " . $usersdata->Username. ",<br><br>";
    $message .=  "Dear recorddrop.Com Member,
                <p> ".$fromusersdata->Username." Approved Your Song Crate Request. ";
    $message .=  "</p></td></tr></table></body></html>";
    
    smtpmail($from,$recipient,$subject,$message);
}
function denysongcrateEmail($touserid,$fromuserid){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $ds = new DataService;
    $appdata = $ds->getApplicationByUserId($touserid);
    $usersdata = $ds->getUserById($touserid);
    $fromusersdata = $ds->getUserById($fromuserid);
    $subject =  "Denied Song Share Crate ";
    $recipient =  $appdata->Email;
    $message = "<html><body><table width='100%'><tr><td width='100%'><font face='Verdana' size='2'>";
    $message .= "Dear " . $usersdata->Username. ",<br><br>";
    $message .=  "Dear recorddrop.Com Member,
                <p> ".$fromusersdata->Username." Denied Your Song Crate Request. ";
    $message .=  "</p></td></tr></table></body></html>";
    
    smtpmail($from,$recipient,$subject,$message);
} 

function getSongcratecurrentuserinfo($userId){
    $ds = new DataService;
    $rv = $ds->getSongcratecurrentuserinfo($userId);
    return $rv;
}

function getcrateuserSongss($userId,$skip,$take){
    $ds = new DataService;
    $rv = $ds->getcrateuserSongs($userId,$skip,$take);
    return $rv;
}
function getcrateuserSongsCount($userId){
    $ds = new DataService;
    $rv = $ds->getcrateuserSongsCount($userId);
    return $rv;
}


function getinsertalbuminfo($albuminfo){
    
    $userId = getUserId();
    $username = $_SESSION['username'];
    if($albuminfo->imageInput){
        $sitepath="http://uat.recorddrop.com";
        $albumPath = "images/AlbumImage";
        if(!file_exists("../$albumPath")) {
            mkdir("../$albumPath");
             chmod($dest, 0777);
        }
        $ProfilePath = "images/AlbumImage/$username";
        if(!file_exists("../$ProfilePath")) {
            mkdir("../$ProfilePath");
             chmod($dest, 0777);
        }

        
         $base64 = substr($albuminfo->imageInput, strpos($albuminfo->imageInput, 'base64,') + 7);
        $bytes = base64_decode($base64);

        list($type, $data) = explode(';', $albuminfo->imageInput);
        list(, $data)      = explode(',', $data);
         $data = base64_decode($data);
     
        $songFile = 'Album_'.create_guid().'.jpg';

        file_put_contents("../$ProfilePath/$songFile", $data);

        $imagepath=$sitepath."/".$ProfilePath."/".$songFile;

        $newsongFile = '250_Album_'.create_guid().'.jpg';
        $newsongFilepath="../".$ProfilePath."/".$newsongFile;
        
        $image = new SimpleImage(); 
        $image->load($imagepath); 
        $image->resize(250,250);
        $image->save($newsongFilepath);
        
        $albuminfo->albumPath=$ProfilePath;
        $albuminfo->imageInput=$songFile;
        unlink($imagepath);
    }else{
        $albuminfo->albumPath="images";
        $albuminfo->imageInput=="noimage.png";
    }
    $ds = new DataService;
    $rv = $ds->getinsertalbuminfo($albuminfo,$userId);
    return $rv;

}
function getalbumdetails($albumId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getalbumdetails($albumId,$userId);
    return $rv;
}

function getPortfoliobyalbumid($albumId,$skip, $take){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfoliobyalbumid($albumId,$userId,$skip, $take);
    return $rv;
}
function getPortfolioCountbyalbumid($albumId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolioCountbyalbumid($albumId,$userId);
    return $rv;
}

function getalbumsonguploadsCountByUser($albumId,$albumtype){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getalbumsonguploadsCountByUser($albumId,$albumtype,$userId);
    return $rv;
}

function getAlbumwiseSongApprove($albumid,$skip, $take){
    $ds = new DataService;
    $rv = $ds->getAlbumwiseSongApprove($albumid,$skip, $take);
    return $rv;
}
function getAlbumwiseSongApproveCount($albumid){
   $ds = new DataService;
    $rv = $ds->getAlbumwiseSongApproveCount($albumid);
    return $rv;
}

function getalbumsongs($albumid, $skip, $take){
    $ds = new DataService;
    $rv = $ds->getalbumsongs($albumid, $skip, $take);
    return $rv;
}

function getalbumsongsCount($albumid){

    $ds = new DataService;
    $rv = $ds->getalbumsongsCount($albumid);
    return $rv;
}

function getalbumSongsToReview($albumid,$userId,$skip, $take){
    $ds = new DataService;
    $rv = $ds->getalbumSongsToReview($albumid,$userId,$skip,$take);
    return $rv;
}
function getalbumSongsToReviewCount($albumid,$userId){
    $ds = new DataService;
    $rv = $ds->getalbumSongsToReviewCount($albumid,$userId);
    return $rv;
}

function getAlbumLibrary($albumid, $skip, $take){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getAlbumLibrary($albumid,$userId,$skip, $take);
    return $rv;
}
function getAlbumLibraryCount($albumid){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getAlbumLibraryCount($albumid,$userId);
    return $rv;
}


function getalbumImage($albumid){

    $ds = new DataService;
    $rv = $ds->getsongalbumdetails($albumid);
    $filename = "../".$rv->album_image_path."/".$rv->album_image;
    $content = file_get_contents($filename);

    if($content == "")
    {
        //$filename = "../assets/images/noimage.png";
        $filename = "../images/artist_images/noimage.png";
        $content = file_get_contents($filename);
    }
    $rv = 'data:image/JPEG;base64,' . base64_encode($content);
    return $rv;
}

function getSiteconfiginfo(){
    $ds = new DataService;
    $rv = $ds->getSiteconfiginfo();
    $globalsetting = $ds->getGlobalSetting();
    $rv->set_distibution=$globalsetting->set_distibution;
    return $rv;
}
 function updateSiteconfiginfo($Siteconfig){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->updateSiteconfiginfo($Siteconfig);
    insertAuditLog($userId, 'Updated Site config', json_encode($Siteconfig));
    return $rv;
}

function getSearchapplications($search){
    $ds = new DataService;
    $rv = $ds->getSearchapplications($search);
    return $rv;
}
function getadminrights($userId){
    $ds = new DataService;
    $rv = $ds->getadminrights($userId);
    return $rv;
}


function editadminrights($editadminrights){
    $ds = new DataService;
     $userId = getUserId();
     $rightsuser = $ds->getadminrightsbyid($editadminrights->userId);
     //print_r($rightsuser);
     //exit;
     if($rightsuser){
         $rv = $ds->updateadminrights($editadminrights);
        insertAuditLog( $userId, 'Updated User Rights', json_encode($editadminrights));
        
     }else{
        $rv = $ds->insertadminrights($editadminrights);
        insertAuditLog( $userId, 'Updated User Rights', json_encode($editadminrights));
     }
     //print_r($rv);
    //$rv = $ds->getadminrights($userId);
    return $rv;
}
function exportdatatopdf($songid){
    //,$skip, $take

    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->exportdatatopdf($userId,$songid);
    $songobj = $ds->geteditsongbyuser($userId,$songid);
    $songreviewcount = $ds->getsongreviewedcount($userId,$songid);
    $songcratecount = $ds->getsongcrateaddedcount($userId,$songid);
    $songfavouritecount = $ds->getsongfavouriteaddedcount($userId,$songid);

    $pdf = new FPDF();
    $pdf->SetFillColor(255,255,255);
    $pdf->SetTextColor(0);
    $pdf->SetDrawColor(128,0,0);
    $pdf->SetLineWidth(.3);
    $pdf->AddPage();
    $pdf->SetFont('Arial','B',14);
    $pdf->Cell(195,10,'Record Drop Account Activity Report',1,0,'C',true);
    $pdf->Ln();
    $pdf->Ln();

     $pdf->SetFont('Times','B',10);
    $pdf->Cell(195,10,'Song Title : '.$songobj->SongTitle,1,0,'L',true);
    $pdf->Ln();
    $pdf->Cell(195,10,'Album Name : '.$songobj->AlbumName,1,0,'L',true);
    $pdf->Ln();
    $pdf->Cell(195,10,'Artist Name : '.$songobj->ArtistName,1,0,'L',true);
    $pdf->Ln();
    $pdf->Cell(195,10,'Number of Users who have reviewed the song : '.$songreviewcount,1,0,'L',true);
    $pdf->Ln();
    $pdf->Cell(195,10,'Number of Users who have added the song to their Crate : '.$songcratecount,1,0,'L',true);
    $pdf->Ln();
    $pdf->Cell(195,10,'Number of users who have added the song as a Favorite : '.$songfavouritecount,1,0,'L',true);
    $pdf->Ln();
    $pdf->Ln();
    $pdf->Ln();
    
    
    $header = array('Country','State','City','Username','Rating','Crate','Favorite');
    $headerc = array('L','L','L','L','C','C','C');
    $w = array(30, 30, 30, 60,15,15,15);
    for($i=0;$i<count($header);$i++)
        $pdf->Cell($w[$i],10,$header[$i],1,0,$headerc[$i],true);
    $pdf->Ln();

     // Data
    $fill = true;
    $keys = [];
    $countrys = null;
    $states  = null;
    $pdf->SetFont('Times','',10);
    foreach($rv as $row)
    {  
        $rvs = $ds->checkincrate($row['UserId'],$songid);
        //print_r($rvs);
        if(isset($rvs->Id)){
            $crate='Yes';
             $favourite =$rvs->favourite;

        }else{
            $crate='No';
            $favourite = 'No';
        }
        $r_countrys = $row['Country'];
        $r_states = $row['StateOrProvince'];
          /*if($countrys !=  $r_countrys){
            
            $countrys = $r_countrys;
            $pdf->Cell($w[0],6,$row['Country'],0,0,'L',$fill);
            $pdf->Cell($w[1],6,'',0,0,'L',$fill);
            $pdf->Cell($w[2],6,'',0,0,'L',$fill);
            $pdf->Cell($w[3],6,'',0,0,'L',$fill);
            $pdf->Cell($w[4],6,'',0,0,'L',$fill);
            $pdf->Cell($w[5],6,'',0,0,'L',$fill);
            $pdf->MultiCell($w[6],6,'',0,'L',$fill);
            $pdf->Ln();

            $fill = !$fill;*/
            if($states !=  $r_states){
            
                    $states = $r_states;

                    $pdf->Cell($w[0],8,$row['Country'],1,0,'L',$fill);
                    $pdf->Cell($w[1],8,$row['StateOrProvince'],1,0,'L',$fill);
                    $pdf->Cell($w[2],8,'',1,0,'L',$fill);
                    $pdf->Cell($w[3],8,'',1,0,'L',$fill);
                    $pdf->Cell($w[4],8,'',1,0,'L',$fill);
                    $pdf->Cell($w[5],8,'',1,0,'L',$fill);
                    $pdf->MultiCell($w[6],8,'',1,'L',$fill);
                    //$pdf->Ln();
                    //$fill = !$fill;
            }
           
            
         // }
        
        $pdf->Cell($w[0],8,'',1,0,'L',$fill);
        $pdf->Cell($w[1],8,'',1,0,'L',$fill);
        $pdf->Cell($w[2],8,$row['City'],1,0,'L',$fill);
        $pdf->Cell($w[3],8,$row['Username'],1,0,'L',$fill);
        $pdf->Cell($w[4],8,$row['OverallRating'],1,0,'C',$fill);
        $pdf->Cell($w[5],8,$crate,1,0,'C',$fill);
        $pdf->MultiCell($w[6],8,$favourite,1,'C',$fill);
       
        //$pdf->Ln();
        //$fill = !$fill;
    }
    
    // Closing line
    $pdf->Cell(array_sum($w),0,'',0);

return $pdf->Output();


 }
 function deleteregisterApplication($appId,$userId){
    $ds = new DataService;
    $ds->deleteApplicationByadmin($appId);
    $ds->deleteUser($userId);
    $ds->deleteUserpackage($userId);
    return true;
}
 function updateregisterApplication($appId,$userId){
    $ds = new DataService;
    $rv = $ds->getupdateregisterApplication($userId);
    return $rv;
}
function getalbumDelete($album_id){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getalbumDelete($album_id,$userId);
    return $rv;
}
function updateUserpackage($packageId)
{
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->updateUserpackage($packageId,$userId);
    return $rv;
}
function deletesongcratefriend($crateId)
{
   $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getdeleteCrateFriend($crateId,$userId);
    return $rv;
}
function getuserinfo($UserId)
{
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getuserinfo($UserId);
    return $rv;
}




function getsongdetails($songId){
    $ds = new DataService;
    $rv = $ds->getsongdetails($songId);
    return $rv;
}
function adminsongreviewedcount($songId){
    $ds = new DataService;
    $rv = $ds->adminsongreviewedcount($songId);
    return $rv;
}
function adminsongaveragecountcount($songId){
    $ds = new DataService;
    $rv = $ds->adminsongaveragecountcount($songId);
    return $rv;
}
function adminsonglisteningroomcount($songId){
    $ds = new DataService;
    $rv = $ds->adminsonglisteningroomcount($songId);
    return $rv;
}
function adminsongcrateaddedcount($songId){
    $ds = new DataService;
    $rv = $ds->adminsongcrateaddedcount($songId);
    return $rv;
}
function adminsongfavouriteaddedcount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->adminsongfavouriteaddedcount($songId);
    return $rv;
}
function admingetSongFeedbackinfo($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->admingetSongFeedbackinfo($songId);
    return $rv;
}
function deletesongsbyadmin($songId){
    $ds = new DataService;
    $rv = $ds->deletesongsbyadmin($songId);
    return $rv;
} 
function getsongdestributioncount($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getsongdestributioncount($userId,$songId);
    return $rv;
}

function getmusicservedSongs_tier1(){
    $ds = new DataService;
    $rv = $ds->getmusicservedSongs_tier1();
    return $rv;
}

function getTotalNumberOfUser_tier1($Genre,$songid){
    $ds = new DataService;
    $rv = $ds->getTotalNumberOfUser_tier1($Genre,$songid);
    return $rv;
}

function getsongdestributioncount_tier($songid,$tier){
    $ds = new DataService;
    $rv = $ds->getsongdestributioncount_tier($songid,$tier);
    return $rv;
}

function getsongfeedbackcount_tier($songid,$tier){
    $ds = new DataService;
    $rv = $ds->getsongfeedbackcount_tier($songid,$tier);
    return $rv;
}

function getmusicservedSongs_tier2(){
    $ds = new DataService;
    $rv = $ds->getmusicservedSongs_tier2();
    return $rv;
}

function getTotalNumberOfUser_tier2($Genre,$songid){
    $ds = new DataService;
    $rv = $ds->getTotalNumberOfUser_tier2($Genre,$songid);
    return $rv;
}


function getmusicservedSongs_tier3(){
    $ds = new DataService;
    $rv = $ds->getmusicservedSongs_tier3();
    return $rv;
}


function getTotalNumberOfUser_tier3($Genre,$songid){
    $ds = new DataService;
    $rv = $ds->getTotalNumberOfUser_tier3($Genre,$songid);
    return $rv;
}


function getmusicservedSongs_tier4(){
    $ds = new DataService;
    $rv = $ds->getmusicservedSongs_tier4();
    return $rv;
}


function getTotalNumberOfUser_tier4($Genre,$songid){
    $ds = new DataService;
    $rv = $ds->getTotalNumberOfUser_tier4($Genre,$songid);
    return $rv;
}

function finishsongswithalbumid($album_id){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getfinishsongswithalbumid($album_id,$userId);
    return $rv;
}
function deletesongsbyalbum($albumId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->deletesongsbyalbum($userId,$albumId);
    return $rv;
}
function getpackagedetail($packageId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPackage($packageId);
    return $rv;
}
function paypalUserpayment($packageId,$paymentid){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getpaypalUserpayment($userId,$packageId,$paymentid);
    $ds->updateUserpackage($packageId,$userId);
    sendpaypalUserpaymentEmail($userId);
    return $rv;
}
function sendpaypalUserpaymentEmail($userId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;

    $ds = new DataService;
    $app = $ds->getApplicationByUserId($userId);
    $usersdata = $ds->getUserById($userId);
    if($app->FirstName != "" || $app->LastName != ""){
        $name = $app->FirstName." ".$app->LastName;
    }else{
        $name =$usersdata->Username;
    }

    $subject =  "Annual Music Premium Renewal";
    $recipient =  $app->Email;
    $message = "Hello $name,<br><br>";
    $message .=  "Thank you for renewing your RecordDrop.com account. If you have any questions or concerns, please feel free to contact us at support@recorddrop.com . <br><br>
        Member Services <br>
        recorddrop.com<br><br>";
    
    smtpmail($from,$recipient,$subject,$message);
}
function registerpaypalUserpayment($packageId,$paymentid,$userId){
    $ds = new DataService;
    $rv = $ds->getpaypalUserpayment($userId,$packageId,$paymentid);
    return $rv;
}
function getsonginuserlisteningroom($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->songinuserlisteningroom($songId,$userId);
    return $rv;
}
function addmultiplesonginuserlisteningroom($songIds){
    $data= json_decode($songIds);
    $userId = getUserId();
    $ds = new DataService;
   foreach ($data as $datavalue) {
       $songId= $datavalue->SongId;
       $ds->getaddSongToListeningRoom($userId,$songId);
   }
    /*$userId = getUserId();
    $ds = new DataService;
    $rv = $ds->songinuserlisteningroom($songId,$userId);
    return $rv;*/
    return true;
}
function songAvgrating($songId){
    $ds = new DataService;
    $rv = $ds->songAvgrating($songId);
    return $rv;
}
function getGenreGroupNames(){
    $ds = new DataService;
    $rv = $ds->getGenreGroupNames();
    return $rv;
}
function getPortfolionew(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolionew($userId);
    return $rv;
}
function getPortfolioEp(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolioEp($userId);
    return $rv;
}
function getPortfolioAlbum(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getPortfolioAlbum($userId);
    return $rv;
}
function getGenreGroupNamesedit(){
    $ds = new DataService;
    $rv = $ds->getGenreGroupNamesedit();
    return $rv;
}
function getdeleteSongcraterequest($crate_id){
    $ds = new DataService;
    $rv = $ds->getdeleteSongcraterequest($crate_id);
    return $rv;
}
function getUswersGenreGroupNames(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getUswersGenreGroupNames($userId);
    return $rv;
}
function getGenreGroupNamesbrowse(){
    $ds = new DataService;
    $rv = $ds->getGenreGroupNamesbrowse();
    return $rv;
}
function getSubGenreByid($generid){
    $ds = new DataService;
    $rv = $ds->getSubGenreByid($generid);
    return $rv;
}
function getnewsongalbumdetail($albumId){
    $ds = new DataService;
    $rv = $ds->getnewsongalbumdetail($albumId);
    return $rv;
}
function getmessagedetails(){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getmessagedetails($userId);
    return $rv;
}
function messagelistbyid($songId){
    $userId = getUserId();
    $ds = new DataService;
    $rv = $ds->getmessagelistbyid($userId,$songId);
    return $rv;
}
function getsongmessagedetails($songid){
    $ds = new DataService;
    $userId = getUserId();
    $rv = $ds->getsongmessagedetails($userId,$songid);
    return $rv;
}
function getregpackagedetail($packageId){
    $ds = new DataService;
    $rv = $ds->getPackage($packageId);
    return $rv;
}
function packageregisterApplication($packageid,$appId,$userId){
    $ds = new DataService;
    $rv = $ds->packageregisterApplication($packageid,$appId,$userId);
    $app = $ds->getAppforvarificationemail($userId);
    resendConfirmEmail($app->Email, $app->AppConfirmUID, $userId);
    sendAdminApplicationEmail($app, $userId,$packageid);
    return $rv;
}
function getAppPackagesList(){
    $ds = new DataService;
    $res = $ds->getAppPackagesList();
    $rv = convertToKVP($res, 'PkgId', 'PkgDisplayName');
    return $rv;
}
function varificationemail(){
    $ds = new DataService;
    $userId = getUserId();
    $app = $ds->getAppforvarificationemail($userId);
    resendConfirmEmail($app->Email, $app->AppConfirmUID, $userId);
    return true;
   
}
function resendConfirmEmail($email, $conf_uid, $userId){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;
                    
    $subject =  sprintf("Welcome to %s", SITE_TITLE);
    $recipient =  $email;
    $message = "Please click the below link to confirm your account";
    
    $url = "http://{$_SERVER['SERVER_NAME']}/emailverification/$conf_uid/$userId";
    $message .=  "<a  href='$url'>$url</a>";
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
    smtpmail($from,$recipient,$subject,$message);

}
function sendAdminApplicationEmail($app, $userId,$packageid){
    $ds = new DataService;
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;
    $usersdata = $ds->getUserById($userId); 
    $packagedata = $ds->getPackage($packageid);

    $subject =  sprintf("New User Registration", SITE_TITLE);
    $recipient =  DO_NOT_REPLY_EMAIL;
    $message = "Dear Admin<br><br>";
    $message .=" User Register Successfully.<br>";
    $message .=" User Name : ".$usersdata->Username." .<br>";
    $message .=" Email : ".$app->Email.".<br>";
    $message .=" Plan Name : ".$packagedata->PkgDetail.".<br>";
     
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
    smtpmail($from,$recipient,$subject,$message);

}
function emailcheck(){
    $title = SITE_TITLE;
    $from = DO_NOT_REPLY_EMAIL;
    $domain = EMAIL_DOMAIN;
    
    $subject =  sprintf("Error Reporting", SITE_TITLE);
    $recipient =  DO_NOT_REPLY_EMAIL;
    $message = "Dear Admin<br><br>";
    $message .="Error Reporting Please Find Attachment .<br>";
    
     
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
     smtpmail1($from,$recipient,$subject,$message);
}
function smtpmail1($from,$to,$subject,$body,$attachment = '')
{
$title = SITE_TITLE;
//$from = DO_NOT_REPLY_EMAIL;
$domain = EMAIL_DOMAIN;
$mail = new PHPMailer(true);
$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = "smtp.gmail.com";  // specify main and backup server
$mail->SMTPAuth = true; 
$mail->SMTPSecure = 'ssl';    // turn on SMTP authentication
//$mail->Username = "donotreply@recorddrop.com";  // SMTP username
//$mail->Password = "donotreply"; // SMTP password
$mail->Username = "himanshudrupal@gmail.com";
$mail->Password = "DRUPAL$$777";
$mail->Port = 465;

$mail->From = "support@recorddrop.com"; 
$mail->FromName = "recorddrop.com";
//$mail->AddAddress("".$to."");
$mail->AddAddress("ketulpatel@webmynesystems.com");
$mail->AddReplyTo($from);
$name="error.jpg";
if($attachment != ""){
$mail->AddAttachment($attachment,$name,$encoding ='base64',$type = 'application/octet-stream');
}
$mail->IsHTML(true); 


$mail->Subject = $subject;
$mail->Body    = $body."</b>";
$mail->AltBody = "";

$status_of_to = ValidateMail($to);

if($status_of_to[0])
{
    if(!$mail->Send())
    {
       insertAuditLog(getUserId(false), 'Sent Email Error', json_encode($mail));
      
    }
    
    insertAuditLog(getUserId(false), 'Sent Email', json_encode(
        [
            'to' => $to,
            'subject' => $subject,
            'body' => $body
        ]
    ));
    
}
}

function inserterrorreportemail($errorreportinfo){
     $ds = new DataService;
    $userId = getUserId();
    $usersdata = $ds->getUserById($userId);
    $username = $_SESSION['username'];
    $albumPath = "images/errorreport";
    if(!file_exists("../$albumPath")) {
        mkdir("../$albumPath");
         chmod($dest, 0777);
    }
    $ProfilePath = "images/errorreport/$username";
    if(!file_exists("../$ProfilePath")) {
        mkdir("../$ProfilePath");
         chmod($dest, 0777);
    }

    if($errorreportinfo->imageInput != ""){
     $base64 = substr($errorreportinfo->imageInput, strpos($errorreportinfo->imageInput, 'base64,') + 7);
     $bytes = base64_decode($base64);

    list($type, $data) = explode(';', $errorreportinfo->imageInput);
    list(, $data)      = explode(',', $data);
     $data = base64_decode($data);
 
    $songFile = 'Error_'.create_guid().'.jpg';

    file_put_contents("../$ProfilePath/$songFile", $data);

    $attachment=$_SERVER['DOCUMENT_ROOT']."/".$ProfilePath."/".$songFile;
    }else{
        $attachment="";
    }
    

    $title = SITE_TITLE;
    $from = $usersdata->email;
    $domain = EMAIL_DOMAIN;
    
    $subject =  "Error Report By ".$username;
    $recipient =  DO_NOT_REPLY_EMAIL;
    $message = "<p>".$errorreportinfo->description."</p>";
   
    
    $headers =  sprintf("From: %s <$from>\n", SITE_TITLE);
    $headers .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
     smtpmail1($from,$recipient,$subject,$message,$attachment);

    return true;

}
function getGenreNamewheneditsong($songid){
    $ds = new DataService;
    $userId = getUserId();
    $rv = $ds->getGenreNamewheneditsong($userId,$songid);
    return $rv;
}
function admingetpackagedetails(){
    $ds = new DataService;
    $rv = $ds->admingetpackagedetails();
    return $rv;
}
function editpackageinfo($packagedetail){
    $ds = new DataService;
    $rv = $ds->editpackageinfo($packagedetail);
    return $rv;
}
function getlargestpackageid(){
    $ds = new DataService;
    $rv = $ds->getlargestpackageid();
    return $rv;
}
function adminverificationemail($userId){
    $ds = new DataService;
    $app = $ds->getAppforvarificationemail($userId);
    resendConfirmEmail($app->Email, $app->AppConfirmUID, $userId);
    return true;
   
}
function getAuditlogCount(){
    $ds = new DataService;
    $rv = $ds->getAuditlogCount();
    return $rv;
}
function getlogCount(){
    $ds = new DataService;
    $rv = $ds->getlogCount();
    return $rv;
}
function getUswersGenreGroupNamesbyuser($userId){
    $ds = new DataService;
    $rv = $ds->getUswersGenreGroupNamesbyuser($userId);
    return $rv;
}