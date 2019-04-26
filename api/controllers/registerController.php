<?php 
	require_once 'api.class.php';
	require_once 'functions.php'; 
	//header('Content-Type: application/json');
	
	//require '../includes/mainfile.php';
	
	//session_start();
	//require_login();
	
	class RegisterController extends API {
		public function __construct($request, $origin) {
			parent::__construct($request);
			
		}
		
		/**
		 * Example of an Endpoint
		 */
		protected function property($id) {
            $id = $id[0];
            switch ($id){
				case 'Genres':
					$rv = getGenresList();
					break;
                case 'States':
                    $rv = getStates();
                    break;
                case 'Countries':
                    $rv = getCountries();
					break;
				case 'Packages':
					$rv = getPackagesList();
					break;
				case 'AppPackages':
					$rv = getAppPackagesList();
					break;
				/*default:
					$rv = getProperty($id);*/
            }

            return $rv;
        }
		
		protected function application() {
			$app = json_decode($this->file);
			$rv = submitApplication($app);
			return $rv;
		}
		
		protected function authenticate(){
			$cred = json_decode($this->file);
			$rv = checkLogin($cred->username, $cred->password);
			if ($rv->isAuthenticated){
				$rv->token = base64_encode(random_bytes(32));
				//$rv->isAdmin = $rv->admin_status == 1;
				session_start();
				$_SESSION['token'] = $rv->token;
				$_SESSION['userId'] = $rv->UserId;
				$_SESSION['username'] = $rv->Username;
			}
		    return $rv;
		}

		protected function emailConfirmation($args){
			$userId = $args[0];
			$ds = new DataService;
			$rv = $ds->emailConfirmed($userId);
			return $rv;
		}

		protected function confirm($args){
			//print_r($args);

			list($conf_uid, $userId) = $args;
			$data =confirmEmail($conf_uid, $userId);
			if($data){
				echo "SuccessFully confirm Your Email Address";
			}else{
				echo "Invalid Email Address";
			}
		}

		protected function connection(){
			return getConnectionStatus(); 
		}

		protected function logout(){
			unset($_SESSION['token']);
			unset($_SESSION['userId']);
			unset($_SESSION['username']);

		}

		protected function notificationRequest(){
			$notificationRequest = json_decode($this->file);
			return insertNotificationRequest($notificationRequest);
		}

		protected function password(){
			$passwordChange = json_decode($this->file);
			$rv = changePassword($passwordChange);
			return $rv;
		}
		protected function ckeckoldPassword($args){
			
			$passwordChange = $args[0];
			
			$rv = ckeckoldPassword($passwordChange);
			return $rv;
		}
		
		protected function passwordReset($args){
			$username = $args[0];
			$rv = resetPassword($username);
			return $rv;
		}
		protected function passwordResets($args){
			$username = $args[0];
			$email = $args[1];
			$rv = resetPasswords($username,$email);
			return $rv;
		}

		protected function testHash(){
			$username = $this->verb;
			$ds = new DataService();
			$rv = $ds->getUser($username);
			return $rv;
		}
	
		protected function testSession(){
			// //setcookie('X-XSRF-TOKEN', 'i8XNjC4b8KVok4uw5RftR38Wgp2BFwql');
			if (!$_SESSION['userId']) 
			 	$_SESSION['userId'] = date('Y-m-d h:i:s a');
			$authToken = $_SERVER['HTTP_AUTHORIZATION'];
			$token = $_SESSION['token'];
			return SID . $_SESSION['userId'] . "$authToken = $token" ;
		}

		protected function getPassword($args){
			$username = $args[0];
			return getPassword($username);
		}
		protected function applicationsUserCount(){
			return applicationsUserCount();
		}
		protected function getallSongsCount(){
			return getallSongsCount();
		}
		protected function getallArtistCount(){
			return getallArtistCount();
		}
		
		protected function facebookapplication() {
			$cred = json_decode($this->file);
			$rv = submitfacebookapplication($cred->email, $cred->name, $cred->id);
			
			if ($rv->isAuthenticated){
				$rv->token = base64_encode(random_bytes(32));
				//$rv->isAdmin = $rv->admin_status == 1;

				$_SESSION['token'] = $rv->token;
				$_SESSION['userId'] = $rv->UserId;
				$_SESSION['username'] = $rv->Username;

			}
			return $rv;
		}
		protected function frontsongs($args){
			$skip = $args[0];
			$take = $args[1];
			$searchval = $args[2];
			return getFrontsongs($skip, $take,$searchval);
		}

		protected function frontsongsCount($args){
			$searchval = $args[0];
			return getFrontsongsCount($searchval);
		}
		protected function frontallsongs($args){
			$skip = $args[0];
			$take = $args[1];
			return getFrontallsongs($skip, $take);
		}

		protected function frontallsongsCount(){
			return getFrontallsongsCount();
		}
		protected function frontartistImage($args){
			$filename = $args[0];
			$rv = getArtistImage($filename);
			return $rv;
		}
		protected function getpromember(){
			return getpromember();
		}
		
		protected function checksession(){
			$rv = getchecksession();
			return $rv;
			
		}
		protected function Siteconfiginfo(){
			return getSiteconfiginfo();
		}
		protected function deleteregisterApplication($args){
			$appId = $args[0];
			$userId = $args[1];
			$rv = deleteregisterApplication($appId,$userId);
			return $rv;
		}
		protected function updateregisterApplication($args){
			$appId = $args[0];
			$userId = $args[1];
			$rv = updateregisterApplication($appId,$userId);
			return $rv;
		}
		protected function getEmailVerification($args){
			$confirmId = $args[0];
			$userId = $args[1];
			$rv = confirmEmail($confirmId,$userId);
			return $rv;
		}


		protected function tier1(){
			$rv=getmusicservedSongs_tier1(); 
			$NumberOfUser="";
			foreach ($rv as $value) {
				$Genre=$value['Genre_name'];
				$songid=$value['SongId'];
				$NumberOfUser.=getTotalNumberOfUser_tier1($Genre,$songid); 
			}
			
			$NumberOfUser1=rtrim($NumberOfUser,"<br>");
			if($NumberOfUser1!=""){
			$NumberOfUser1=@explode("<br>", $NumberOfUser1);

			if(count($NumberOfUser1)<=0){
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			}else{
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			
			return $NumberOfUser1;
			
		}
		protected function tier2(){
			
			$siteconfig=getSiteconfiginfo();
			//print_r($siteconfig);
			/*echo $siteconfig->tire2_per."\n";
			echo $siteconfig->tire2_ret;
			exit;*/
			$rv=getmusicservedSongs_tier2(); 
			$NumberOfUser="";
			foreach ($rv as $value) {
				$Genre=$value['Genre_name'];
				$songid=$value['SongId'];
				 $discount =  getsongdestributioncount_tier($songid,'tier1');	
				
				$feedback = getsongfeedbackcount_tier($songid,'tier1');
				
				$feedbackcount = $feedback->total;
				
				$avgfeedback =  $feedback->avgrating;

				$reviewper = (100 * $feedbackcount)/$discount;

				//echo $feedbackcount."--|--".$avgfeedback."--|--".$reviewper;
				
				/*if($feedbackcount <= 0){
					continue;
				}
				elseif($avgfeedback < 3){
					continue;
				}
				elseif($reviewper < 26 && $avgfeedback == 3){
					continue;*/
				if($reviewper >= $siteconfig->tire2_per && $avgfeedback >= $siteconfig->tire2_ret){
					$NumberOfUser.=getTotalNumberOfUser_tier2($Genre,$songid); 
				}else{
					continue;
				}				
				
			}
			
			$NumberOfUser1=rtrim($NumberOfUser,"<br>");
			if($NumberOfUser1!=""){
			$NumberOfUser1=@explode("<br>", $NumberOfUser1);

			if(count($NumberOfUser1)<=0){
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			}else{
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			
			return $NumberOfUser1;
		}


		protected function tier3(){
			
			$siteconfig=getSiteconfiginfo();
			//print_r($siteconfig);
			/*echo $siteconfig->tire3_per."\n";
			echo $siteconfig->tire3_ret;
			exit;*/

			$rv=getmusicservedSongs_tier3(); 
			$NumberOfUser="";
			foreach ($rv as $value) {
				$Genre=$value['Genre_name'];
				$songid=$value['SongId'];
				 $discount =  getsongdestributioncount_tier($songid,'tier2');	
				
				$feedback = getsongfeedbackcount_tier($songid,'tier2');
				
				$feedbackcount = $feedback->total;
				
				$avgfeedback =  $feedback->avgrating;

				$reviewper = (100 * $feedbackcount)/$discount;

				//echo $feedbackcount."--|--".$avgfeedback."--|--".$reviewper;
				
				/*if($feedbackcount <= 0){
					continue;
				}
				elseif($avgfeedback < 3){
					continue;
				}
				elseif($reviewper < 51 && $avgfeedback == 3){
					continue;
				}else{

				$NumberOfUser.=getTotalNumberOfUser_tier3($Genre,$songid); 
				}*/
				if($reviewper >= $siteconfig->tire3_per && $avgfeedback >= $siteconfig->tire3_ret){
					$NumberOfUser.=getTotalNumberOfUser_tier3($Genre,$songid); 
				}else{
					continue;
				}				
				
			}
			
			$NumberOfUser1=rtrim($NumberOfUser,"<br>");
			if($NumberOfUser1!=""){
			$NumberOfUser1=@explode("<br>", $NumberOfUser1);

			if(count($NumberOfUser1)<=0){
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			}else{
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			
			return $NumberOfUser1;
		}


		protected function tier4(){
			
			$siteconfig=getSiteconfiginfo();
			//print_r($siteconfig);
			/*echo $siteconfig->tire4_per."\n";
			echo $siteconfig->tire4_ret;
			exit;*/

			$rv=getmusicservedSongs_tier4(); 
			$NumberOfUser="";
			foreach ($rv as $value) {
				$Genre=$value['Genre_name'];
				$songid=$value['SongId'];
				 $discount =  getsongdestributioncount_tier($songid,'tier3');	
				
				$feedback = getsongfeedbackcount_tier($songid,'tier3');
				
				$feedbackcount = $feedback->total;
				
				$avgfeedback =  $feedback->avgrating;

				$reviewper = (100 * $feedbackcount)/$discount;

				//echo $feedbackcount."--|--".$avgfeedback."--|--".$reviewper;
				
				/*if($feedbackcount <= 0){

					continue;
				}
				elseif($avgfeedback < 4){
					continue;
				}
				elseif($reviewper < 76 && $avgfeedback == 4){
					continue;
				}else{

				$NumberOfUser.=getTotalNumberOfUser_tier4($Genre,$songid); 
				}*/	
				if($reviewper >= $siteconfig->tire4_per && $avgfeedback >= $siteconfig->tire4_ret){
					$NumberOfUser.=getTotalNumberOfUser_tier4($Genre,$songid); 
				}else{
					continue;
				}			
				
			}
			
			$NumberOfUser1=rtrim($NumberOfUser,"<br>");
			if($NumberOfUser1!=""){
			$NumberOfUser1=@explode("<br>", $NumberOfUser1);

			if(count($NumberOfUser1)<=0){
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			}else{
				$NumberOfUser1 =  array();
				$NumberOfUser1[]="No Record Found";
			}
			
			return $NumberOfUser1;
		}
		protected function registerpaypalUserpayment($args){
			$packageId = $args[0];
			$paymentid = $args[1];
			$userId= $args[2];
			$rv = registerpaypalUserpayment($packageId,$paymentid,$userId);
			return $rv;

		}
		protected function getGenreGroupNames() {
            $rv = getGenreGroupNames();
			return $rv;
        }
        protected function getregpackagedetail($args){
			$packageId = $args[0];
			$rv = getregpackagedetail($packageId);
			return $rv;

		}
		protected function packageregisterApplication($args){
			$packageid = $args[0];
			$appId = $args[1];
			$userId = $args[2];
			$rv = packageregisterApplication($packageid,$appId,$userId);
			return $rv;
		}
		protected function emailcheck(){
			
			$rv = emailcheck();
			return $rv;
		}
		protected function userverificationemail($args){
			$userid = $args[0];
			return adminverificationemail($userid);
		}

	}