<?php 
	require_once 'api.class.php';
	//header('Content-Type: application/json');
	
	//require '../includes/mainfile.php';
	
	//session_start();
	//require_login();
	
	class MyAPI extends API {
		public function __construct($request, $origin) {
			parent::__construct($request);
			
		}
		
		/**
		 * Example of an Endpoint
		 */
		protected function example() {
			if ($_SESSION['logged']) $name = 'Ian'; else $name = 'Pitt';
			if ($this->method == 'GET') {
				return "Your name is  " .$_SESSION['logged'] . $name . $this->getDebugValues() . $_REQUEST['q']  /*. $this->User->name*/;
			} else {
				return "Only accepts GET requests";
			}
		}
		
		protected function example2($par1) {
			if ($_SESSION['logged']) $name = 'Ian'; else $name = 'Pitt';
			if ($this->method == 'GET') {
				$myPars = implode('|', $par1);
				return "Your name is " . $name . $this->getDebugValues() . $_REQUEST['q']  
				  . "\nverb:{$this->verb}, {$myPars}";
			} else {
				return "Only accepts GET requests";
			}
		}

		protected function connection(){
			return getConnectionStatus(); 
		}

		protected function testHash(){
			$username = $this->verb;
			$ds = new DataService();
			$rv = $ds->getUser($username);
			return $rv;
		}
		
	}