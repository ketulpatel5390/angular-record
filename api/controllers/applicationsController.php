<?php 
	require_once 'api.class.php';
	require_once 'functions.php'; 
	
	class ApplicationsController extends API {
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

		protected function application(){
			return getApplication();
		}

		/*protected function applications($args){
			$skip = $args[0];
			$take = $args[1];
			return getApplications($skip, $take);
		}

		protected function applicationsCount(){
			return getApplicationsCount();
		}*/
		protected function applicationpackage(){
			return getapplicationpackage();
		}
		protected function songuploadsCountByUser(){
			return getsonguploadsCountByUser();
		}
		protected function songuploadsRemainingCountByUser(){
			return getsonguploadsRemainingCountByUser();
		}
		protected function updateGeneralinfo(){
			$appGeneralinfo = json_decode($this->file);
			
			return getupdateGeneralinfo($appGeneralinfo);
		}
		protected function updateGetmusic(){
			$appGeneralinfo = json_decode($this->file);
			//print_r($appGeneralinfo);
			return getupdateGetmusic($appGeneralinfo);
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
			return addadminuser($adminuser->username, $adminuser->password,$adminuser->adminstatus);
		}
		protected function getadmindetails($args){
			$UserId = $args[0];
			return getadmindetails($UserId);
		}
		protected function editadminuser($args){
			$adminuser = json_decode($this->file);
			return editadminuser($adminuser->userId,$adminuser->username,$adminuser->adminstatus, $adminuser->password);
		}
		protected function deleteadminuser($args){
			$UserId = $args[0];
			return getdeleteadminuser($UserId);
		}
		protected function Searchapplications($args){
			$search = $args[0];
			return getSearchapplications($search);
		}
		
		
		
		
	}