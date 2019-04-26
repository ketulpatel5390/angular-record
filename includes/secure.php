<?
//$redirect = $_SERVER['HTTP_REFERER'];  // this is the URL to go to after being logged in.
// setting this to true means you have a table set up in the database
// users table MUST have fields called 'username' and 'password'
 $action = $_POST['task'];
$un = $_POST['uname'];
$pw = $_POST['upwd'];
switch ($action){
	case "Login":
		_checkLogin($un, $pw);
		break;
	case "logout":
		_logout();
		break;
}
require_login();
//////////////////////////////////////////////////////////////
?>