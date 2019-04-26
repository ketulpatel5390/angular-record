<?php 
	require_once 'api.class.php';
	require_once 'functions.php'; 
	//header('Content-Type: application/json');
	
	//require '../includes/mainfile.php';
	
	//session_start();
	//require_login();
	
	class SongsController extends API {
		public function __construct($request, $origin) {
			parent::__construct($request);
			
		}
		
		/**
		 * Example of an Endpoint
		 */
		protected function property($id) {
            $id = $id[0];
            switch ($id){
                case 'States':
                    $rv = getStates();
                    break;
                case 'Countries':
                    $rv = getCountries();
					break;
				default:
					$rv = getProperty($id);
            }

            return $rv;
        }

		protected function audioSource($args){
			$songId = $args[0];
			$full = filter_var($args[1], FILTER_VALIDATE_BOOLEAN);
			getAudioSource($songId, $full);
			//return $rv;
		}
		
		protected function crate($args){
			$songId = $args[0];
			$favourite = $args[1];
			$rv = addSongToCrate($songId,$favourite);
			return $rv;
		}

		protected function distributeSongs($args) {
			$userId = $args[0];
			$rv = distributeSongs($userId);
			return $rv;
		}

		protected function artistImage($args){
			$filename = $args[0];
			$rv = getArtistImage($filename);
			return $rv;
		}
		
		protected function feedback(){
			$feedbackData = json_decode($this->file);
			return postFeedback($feedbackData);
		}
		protected function postFeedbackcomment(){
			$feedbackData = json_decode($this->file);
			
			return postFeedbackcomment($feedbackData);
		}
		
		
		protected function library($args){
			$skip = $args[0];
			$take = $args[1];

			$sortbygener=$_REQUEST['sortbygener'];
			$sortkey=$_REQUEST['sortkey'];
			$sortreverse=$_REQUEST['sortreverse'];

			return getLibrary($skip, $take ,$sortbygener, $sortkey,$sortreverse);
		}
		protected function LibraryCount(){

			$sortbygener=$_REQUEST['sortbygener'];
			$sortkey=$_REQUEST['sortkey'];
			$sortreverse=$_REQUEST['sortreverse'];

			return LibraryCount($sortbygener, $sortkey,$sortreverse);
		}
		
		protected function portfolio($args){
			$skip = $args[0];
			$take = $args[1];
			return getPortfolio($skip, $take);
		}
		protected function PortfolioCount(){
			return PortfolioCount();
		}
		
		
		protected function song($args) {
			$song = json_decode($this->file);
			if ($this->method == 'PUT'){
				$song->songId = $args[0];
				
				$rv = updateSong($song);
			}  
			else {
				$rv = uploadSong($song);
			}
			return $rv;
		}
		protected function updatesongs(){
			$song = json_decode($this->file);
			$rv = updateSongs($song);
			return $rv;
		}
		protected function songOnly() {
			$song = json_decode($this->file);
			return strlen($song->data);
			$rv = uploadSong($song);
			return $rv;
		}

		protected function songData($args){
			$songId = $args[0];
			sendSongData($songId);
		}

		protected function songs($args){
			$songData = json_decode($this->file);
			//$skip = $songData->skip;
			//$take = $songData->take;
			$skip = $args[0];
			$take = $args[1];
			
			if( $_REQUEST['searchname'] == 'undefined'){
				$searchname = '';
			}else{
				$searchname = $_REQUEST['searchname'];
			}

			return getSongs($skip, $take,$searchname);
		}

		protected function songsCount(){
			$songData = json_decode($this->file);
			//$searchname = $_REQUEST['searchname'];
			if( $_REQUEST['searchname'] == 'undefined'){
				$searchname = '';
			}else{
				$searchname = $_REQUEST['searchname'];
			}
			return getSongsCount($searchname);
		}

		
		protected function songsToReview($args){
			$userId = $args[0];
			$skip = $args[1];
			$take = $args[2];
			$rv = getSongsToReview($userId,$skip,$take);
			return $rv;
		}
		protected function songsToReviewCount($args){
			$userId = $args[0];
			$rv = getsongsToReviewCount($userId);
			return $rv;
		}
		protected function deletesongs($args){
			$songId = $args[0];
			$rv = getdeletesongs($songId);
			//print_r($args);
			return $rv;

		}
		protected function editsongbyuser($args){
			$songId = $args[0];
			$rv = geteditsongbyuser($songId);
			//print_r($args);
			return $rv;
			
		}
		protected function addSongToListeningRoom($args){
			$songId = $args[0];
			$rv = getaddSongToListeningRoom($songId);
			//print_r($args);
			return $rv;

		}
		protected function getSongFeedback($args){
			$songId = $args[0];
			$rv = getSongFeedback($songId);
			return $rv;
			
		}
		protected function postMessage($args){
			$song = json_decode($this->file);
			
			$rv = getpostMessage($song->songId,$song->subject,$song->messsage);
			return $rv;
			
		}
		protected function getFavouriteMember(){
			$rv = getFavouriteMembers();
			return $rv;
		}
		protected function getFavouriteMemberStateOrProvinance(){
			$rv = getFavouriteMemberStateOrProvinance();
			return $rv;
		}

		protected function submitdistribution(){
			$song = json_decode($this->file);
			
			$rv = getsubmitdistribution($song);
			return $rv;
			
		}
		protected function songreviewedcount($args){
			$songId = $args[0];
			$rv = getsongreviewedcount($songId);
			return $rv;
		}	
		protected function songcrateaddedcount($args){
			$songId = $args[0];
			$rv = getsongcrateaddedcount($songId);
			return $rv;
		}
		protected function songcrateaddedcountinuser($args){
			$songId = $args[0];
			$rv = getsongcrateaddedcountinuser($songId);
			return $rv;
		}
		
		protected function songfavouriteaddedcount($args){
			$songId = $args[0];
			$rv = getsongfavouriteaddedcount($songId);
			return $rv;
		}	

		protected function SongFeedbackinfo($args){
			$songId = $args[0];
			//$skip = $args[1];
			//$take = $args[2];
			//return getSongFeedbackinfo($songId,$skip, $take);
			return getSongFeedbackinfo($songId);
		}
		protected function SongFeedbackinfocount($args){
			$songId = $args[0];
			return getSongFeedbackinfocount($songId);
		}
		protected function SongpostMessage($args){
			$song = json_decode($this->file);
			$rv = getSongpostMessage($song->songId,$song->Rec_UserId,$song->subject,$song->messsage);
			return $rv;
			
		}
		protected function SendGeolocationMessage($args){
			$song = json_decode($this->file);
			$rv = getSendGeolocationMessage($song->songId,$song->region,$song->subject,$song->messsage);
			return $rv;
			
		}
		protected function sharemycrate($args){
			$songcrateuser = json_decode($this->file);
			return sharemycrate($songcrateuser->username);
		}
		protected function Songcratefriendsinfo($args){
			$skip = $args[0];
			$take = $args[1];
			$rv = getSongcratefriendsinfo($skip,$take);
			return $rv;
		}
		protected function SongcratefriendsinfoCount(){
			$rv = getSongcratefriendsinfoCount();
			return $rv;
		}

		protected function PendingSongcratefriendsinfo($args){
			$skip = $args[0];
			$take = $args[1];
			$rv = getPendingSongcratefriendsinfo($skip,$take);
			return $rv;
		}
		protected function PendingSongcratefriendsinfoCount(){
			$rv = getPendingSongcratefriendsinfoCount();
			return $rv;
		}

		protected function getSongcraterequest($args){
			$skip = $args[0];
			$take = $args[1];
			$rv = getSongcraterequests($skip,$take);
			return $rv;
		}
		protected function getSongcraterequestCount(){
			$rv = getSongcraterequestCounts();
			return $rv;
		}
		protected function actionrequestsongcrate($args){
			$songcrate = json_decode($this->file);
			return actionrequestsongcrate($songcrate->crateid,$songcrate->touserid,$songcrate->status);
		}
		protected function Songcratecurrentuserinfo($args){
			$userid = $args[0];
			$rv = getSongcratecurrentuserinfo($userid);
			return $rv;
		}
		protected function getcrateuserSongs($args){
			$userId = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return getcrateuserSongss($userId,$skip, $take);
		}
		protected function getcrateuserSongsCount($args){
			$userId = $args[0];
			return getcrateuserSongsCount($userId);
		}
		protected function insertalbuminfo(){
			$albuminfo = json_decode($this->file);
			
			return getinsertalbuminfo($albuminfo);
		}
		protected function getalbumdetail($args){
			$albumid = $args[0];
			$rv = getalbumdetails($albumid);
			return $rv;
		}

		protected function getPortfoliobyalbumid($args){
			$albumid = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return getPortfoliobyalbumid($albumid,$skip, $take);
		}
		protected function getPortfolioCountbyalbumid($args){
			$albumid = $args[0];
			
			return getPortfolioCountbyalbumid($albumid);
		}
		protected function albumsonguploadsCountByUser($args){
			$albumid = $args[0];
			$albumtype = $args[1];
			
			return getalbumsonguploadsCountByUser($albumid,$albumtype);
		}

		protected function albumsongs($args){
			$albumid = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return getalbumsongs($albumid, $skip, $take);
		}

		protected function albumsongsCount($args){
			 $albumid = $args[0];
			
			return getalbumsongsCount($albumid);
		}
		protected function albumSongsToReview($args){
			$albumid = $args[0];
			$userId = $args[1];
			$skip = $args[2];
			$take = $args[3];
			$rv = getalbumSongsToReview($albumid,$userId,$skip,$take);
			return $rv;
		}
		protected function albumSongsToReviewCount($args){
			$albumid = $args[0];
			$userId = $args[1];
			$rv = getalbumSongsToReviewCount($albumid,$userId);
			return $rv;
		}

		protected function AlbumLibrary($args){
			$albumid = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return getAlbumLibrary($albumid,$skip, $take);
		}
		protected function AlbumLibraryCount($args){
			$albumid = $args[0];
			return getAlbumLibraryCount($albumid);
		}

		
		protected function albumImage($args){
			$albumid = $args[0];
			$rv = getalbumImage($albumid);
			return $rv;
		}
		protected function exportdatatopdf($args){
			$songid = $args[0];
			$rv = exportdatatopdf($songid);
			return $rv;
		}
		protected function deletesongswithalbum($args){
			$songId = $args[0];
			$albumid = $args[1];
			$rv = getdeletesongs($songId);
			$rv = getalbumDelete($albumid);
			//print_r($args);
			return $rv;

		}
		protected function updateUserpackage($args){
			$packageId = $args[0];
			$rv = updateUserpackage($packageId);
			return $rv;
		}
		protected function deletesongcratefriend($args){
			$crateId = $args[0];
			$rv = deletesongcratefriend($crateId);
			return $rv;
		}
		protected function getuserinfo($args){
			$userid = $args[0];
			$rv = getuserinfo($userid);
			return $rv;
		}
		protected function songdestributioncount($args){
			$songId = $args[0];
			$rv = getsongdestributioncount($songId);
			return $rv;
		}
		
		protected function finishsongswithalbumid($args){
			$albumid = $args[0];
			$rv = finishsongswithalbumid($albumid);
			return $rv;

		}
		protected function deletesongsbyalbum($args){
			$albumid = $args[0];
			$rv = deletesongsbyalbum($albumid);
			return $rv;

		}
		protected function getpackagedetail($args){
			$packageId = $args[0];
			$rv = getpackagedetail($packageId);
			return $rv;

		}
		protected function paypalUserpayment($args){
			$packageId = $args[0];
			$paymentid = $args[1];
			$rv = paypalUserpayment($packageId,$paymentid);
			return $rv;

		}
		protected function songinuserlisteningroom($args){
			$songId = $args[0];
			$rv = getsonginuserlisteningroom($songId);
			return $rv;
		}
		protected function addmultiplesonginuserlisteningroom($args){
			$songIds = $args[0];
			$rv = addmultiplesonginuserlisteningroom($songIds);
			return $rv;
		}
		protected function songAvgrating($args){
			$songId = $args[0];
			$rv = songAvgrating($songId);
			return $rv;
		}
		protected function getPortfolionew(){
			
			return getPortfolionew();
		}
		protected function getPortfolioEp(){
			
			return getPortfolioEp();
		}
		protected function getPortfolioAlbum(){
			
			return getPortfolioAlbum();
		}
		protected function getGenreGroupNamesedit() {
            $rv = getGenreGroupNamesedit();
			return $rv;
        }
        protected function getdeleteSongcraterequest($args){
			$crate_id = $args[0];
			$rv = getdeleteSongcraterequest($crate_id);
			return $rv;
		}
		protected function getUswersGenreGroupNames() {
            $rv = getUswersGenreGroupNames();
			return $rv;
        }
         protected function getGenreGroupNamesbrowse() {
            $rv = getGenreGroupNamesbrowse();
			return $rv;
        }
        
         protected function getSubGenreByid($args) {
         	$generid = $args[0];
            $rv = getSubGenreByid($generid);
			return $rv;
		}
		protected function getsongalbumdetail($args){
			 $albumId = $args[0];
			$rv = getnewsongalbumdetail($albumId);
			return $rv;
		}
		protected function getmessagedetails(){
			$rv = getmessagedetails();
			return $rv;
		}
		protected function messagelistbyid($args){
			$songId = $args[0];
			$rv = messagelistbyid($songId);
			return $rv;
		}
		protected function getsongmessagedetails($args){
			$songid = $args[0];
			$rv = getsongmessagedetails($songid);
			return $rv;
		}
		protected function varificationemail(){
			
			return varificationemail();
		}
		protected function inserterrorreport(){
			$errorreportinfo = json_decode($this->file);
			
			return inserterrorreportemail($errorreportinfo);
		}
		protected function getGenreNamewheneditsong($args){
			$songid = $args[0];
			$rv = getGenreNamewheneditsong($songid);
			return $rv;
		}
		protected function getlargestpackageid(){
			return getlargestpackageid();
		}
		protected function getUswersGenreGroupNamesbyuser($args) {
			$currentuserid = $args[0];
            $rv = getUswersGenreGroupNamesbyuser($currentuserid);
			return $rv;
        }

	}