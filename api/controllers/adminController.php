<?php 
	require_once 'api.class.php';
	require_once 'functions.php'; 
	
	class AdminController extends API {
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

        protected function applicationStatus($args){
            list($appId, $status) = $args;
            return updateApplicationStatus($appId, $status); 
        }
        
		protected function approval($args){
			$appId = $args[0];
			return approveApplication($appId);
		}

		protected function auditLog($args){
			$skip = $args[0];
			$take = $args[1];
			
			return getAuditLog($skip,$take);
		}

		protected function log($args){
			$skip = $args[0];
			$take = $args[1];
			return getLog($skip,$take);
		}

		protected function rejection($args){
            $appId = $args[0];
			return rejectApplication($appId);
		}
		protected function deleteApplication($args){
            $appId = $args[0];
			return deleteApplication($appId);
		}



		
		protected function SongApprove($args){
			$filterby = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return SongApprove($filterby,$skip, $take);
		}
		protected function SongApproveCount($args){
			$filterby = $args[0];
			return SongApproveCount($filterby);
		}
		
		protected function getApprovesong($args){
            $songId = $args[0];
            $UserId = $args[1];
			return getApprovesong($songId,$UserId);
		}
		protected function getRejectsong($args){
            $songId = $args[0];
            $UserId = $args[1];
			return getRejectsong($songId,$UserId);
		}

		protected function getAlbumwiseSongApprove($args){
			$albumid = $args[0];
			$skip = $args[1];
			$take = $args[2];
			return getAlbumwiseSongApprove($albumid,$skip, $take);
		}
		protected function getAlbumwiseSongApproveCount($args){
			$albumid = $args[0];
			return getAlbumwiseSongApproveCount($albumid);
		}
		protected function Siteconfiginfo(){
			return getSiteconfiginfo();
		}
		protected function updateSiteconfiginfo($args) {
			$Siteconfig = json_decode($this->file);
			$rv = updateSiteconfiginfo($Siteconfig);
			return $rv;
		}
		protected function passwordResets($args){
			$username = $args[0];
			$email = $args[1];
			$rv = resetPasswords($username,$email);
			return $rv;
		}
		protected function getadminrights($args){
			$userId = $args[0];
			$rv = getadminrights($userId);
			return $rv;
		}
		protected function editadminrights($args) {
			$editadminrights = json_decode($this->file);
			$rv = editadminrights($editadminrights);
			return $rv;
		}

		protected function applications($args){
			$searchobj = json_decode($this->file);
			$skip = $args[0];
			$take = $args[1];
			$searchby=$_REQUEST['searchby'];
			$sortkey=$_REQUEST['sortkey'];
			$sortreverse=$_REQUEST['sortreverse'];
			
			return getApplications($skip,$take,$searchby,$sortkey,$sortreverse);
		}

		protected function applicationsCount($args){
			$searchobj = json_decode($this->file);
			$searchby=$_REQUEST['searchby'];
			$sortkey=$_REQUEST['sortkey'];
			$sortreverse=$_REQUEST['sortreverse'];
			return getApplicationsCount($searchby,$sortkey,$sortreverse);
		}
		protected function adminuserCount(){
			return getAdminuserCount();
		}
		protected function adminuser($args){
			$skip = $args[0];
			$take = $args[1];
			return getAdminuser($skip, $take);
		} 
		protected function addadminuser($args){
			$adminuser = json_decode($this->file);
			return addadminuser($adminuser->username, $adminuser->password,$adminuser->adminstatus,$adminuser->email);
		}
		protected function getadmindetails($args){
			$UserId = $args[0];
			return getadmindetails($UserId);
		}
		protected function editadminuser($args){
			$adminuser = json_decode($this->file);
			return editadminuser($adminuser->userId,$adminuser->username,$adminuser->adminstatus, $adminuser->email, $adminuser->password);
		}
		protected function deleteadminuser($args){
			$UserId = $args[0];
			return getdeleteadminuser($UserId);
		}
		protected function Searchapplications($args){
			$search = $args[0];
			return getSearchapplications($search);
		}
	


	    protected function getsongdetails($args){
			$songId = $args[0];
			$rv = getsongdetails($songId);
			return $rv;
			
		}
		protected function adminsongreviewedcount($args){
			$songId = $args[0];
			$rv = adminsongreviewedcount($songId);
			return $rv;
		}
		protected function adminsongaveragecountcount($args){
			$songId = $args[0];
			$rv = adminsongaveragecountcount($songId);
			return $rv;
		}
			
		protected function adminsonglisteningroomcount($args){
			$songId = $args[0];
			$rv = adminsonglisteningroomcount($songId);
			return $rv;
		}	

		protected function adminsongcrateaddedcount($args){
			$songId = $args[0];
			$rv = adminsongcrateaddedcount($songId);
			return $rv;
		}
		protected function adminsongfavouriteaddedcount($args){
			$songId = $args[0];
			$rv = adminsongfavouriteaddedcount($songId);
			return $rv;
		}	

		protected function admingetSongFeedbackinfo($args){
			$songId = $args[0];
			return admingetSongFeedbackinfo($songId);
		}
		protected function deletesongsbyadmin($args){
			$songId = $args[0];
			$rv = deletesongsbyadmin($songId);
			return $rv;

		}
		protected function admingetpackagedetails(){
			return admingetpackagedetails();
		}
		protected function getadminpackagedetail($args){
			$packageid = $args[0];
			return getpackagedetail($packageid);
		}
		protected function editpackageinfo($args){
			$packagedetail = json_decode($this->file);
			return editpackageinfo($packagedetail);
		}
		protected function adminverificationemail($args){
			$userid = $args[0];
			return adminverificationemail($userid);
		}
		protected function getAuditlogCount(){
			return getAuditlogCount();
		}
		protected function getlogCount(){
			return getlogCount();
		}
			
	}