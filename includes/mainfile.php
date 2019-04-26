<?

$flag = session_start();

foreach($_REQUEST as $key => $value)
{
$$key = $value;
}


function downfile()
{
$tar_filename = 'zip/4a119d17965554bf1847cc3659190e4f.tar';
			$mm_type="application/octet-stream";
			header("Cache-Control: public, must-revalidate");
			header("Pragma: hack");
			header("Content-Type: " . $mm_type);
			header("Content-Length: " .(string)(filesize($tar_filename)) );
			header('Content-Disposition: attachment; filename="mytestzipfile.tar"');
			header("Content-Transfer-Encoding: binary\n");
							   
			$fp = fopen($tar_filename, 'rb');
			$buffer = fread($fp, filesize($tar_filename));
			fclose ($fp);
			echo $buffer;
}
/*echo $dataSongs = 'songs/newsong.mp3';
echo $dataSongspath = str_replace("/","\\",$dataSongs);
exit;
*/

ini_set("display_errors","On");
ini_set("error_reporting","E_ALL");
//ini_set("ob_start","Off")

/// for automatic logout
if(  dateDiff1('n',$_SESSION['starttime'],date('Y-m-d h:i:s')) > 15)
	_logout(1);

$_SESSION['starttime'] = date('Y-m-d h:i:s');
// logout //
//echo "Step 2 Session started: $flag ID: ". SID;

/*if(!( strstr($_SERVER['PHP_SELF'],"musicproapplication.php") || strstr($_SERVER['PHP_SELF'],"musicaccessapplication.php")  ))
{
	session_start();
	header("Cache-control: private");
}*/	

//header("Cache-control: private");
require_once("functions.inc");

require_once("constants.php");

require_once("PostGateway.function");	

	/////////for the prev - next////////

	$incr = 5;

	
	

	if(isset($_REQUEST['next']))

	{

		$min = $_REQUEST['next'] + $incr;

		$max = $incr;

	}

	elseif(isset($_REQUEST['prev']))

	{

		$min = $_REQUEST['prev'] - $incr;

		$max = $incr;

	}

	else

	{

		$max =$incr;

		$min = 0;

	}

	//echo "<input type='hidden' name='min' value='".$min."'>";

	/////////prev - next OVER////////


if($_SERVER['HTTP_HOST']=='192.168.1.1:1000')
{
	$script_url = "http://192.168.1.1:1000/projects/newth";
	$sslscript_url = "http://192.168.1.1:1000/projects/newth";
}
else 
{
	$script_url = "http://localhost:8080/recorddrop1";
	$sslscript_url = "http://localhost:8080/recorddrop1";
}



function connect_db () {

   //echo DB_HOST."-".DB_USER."-".DB_PASSWORD;
	//exit;

	$conn = mysqli_connect (DB_HOST, DB_USER, DB_PASSWORD);  // Establishes connection
	if(!$conn)
		{
		echo mysqli_error();
		exit;
		}

	mysqli_set_charset($conn, "latin1");
			
			
	return $conn;

}


function getMySqli () {

//    echo DB_HOST."-".DB_USER."-".DB_PASSWORD;
//	exit;

	$conn = new mysqli(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);  // Establishes connection

	if($conn->connect_errno)
		{
		echo $conn->connect_errno . ": " . $conn->connect_error;
		exit;
		}

			
			
	return $conn;

}


$conn = connect_db();
$mySqli = getMySqli();

 $a = mysqli_select_db($conn, DB_NAME) or die(mysqli_error($conn));


$key = "klksdj03jlksd3nlka02k95n85bb73bjkaaljmcaikd129750nfks";
$cardkey = 'khetrafunsunky1trakhe5';





if ($_SESSION['logged']) { 
	//echo "Step 3 logged a = $a";
	
	_checkSession(); 

} elseif ( isset($_COOKIE['mtwebLogin']) ) { 
	echo "Step 3 mtweblogin a = $a";
	
	_checkRemembered($_COOKIE['mtwebLogin']); 

} 


require_once 'security-helpers.php';



function session_defaults() { 

$_SESSION['logged'] = false; 

$_SESSION['user_id'] = 0; 

$_SESSION['username'] = ''; 

$_SESSION['cookie'] = 0; 

$_SESSION['remember'] = false; 

$_SESSION['is_admin'] = false; 

} 





function _checkLogin($username, $password, $remember=0) {



global $key, $mySqli ,$errvar ;


     $errvar = 0;


	if($username == '' && $password == '' )

		{
		
			//require_once("header.php");

			$errvar = 1;

			//message_box("Username and Password Required ","Please enter User Name and Password.",0,1);

	//		header

		    header("location:index.php");
			return false;

		}	



	if($username == '' && $password != '' )

		{
		
		//	require_once("header.php");

			$errvar = 1;

			//message_box(" Username Required","Please enter The User Name.",0,1);

		    header("location:index.php");
			return false;

		}	



	if($username != '' && $password == '' )

		{
	//	require_once("header.php");

			$errvar = 1;

			//message_box(" Password Required","Please enter The Password.",0,1);
		    header("location:index.php");
			return false;

		}	



   			$sql = $mySqli->prepare("SELECT * FROM Users WHERE username like ?");	// . $username . "'" . $clause; 
			$sql->bind_param("s", $username);
			$sql->execute();
//$result = mysqli_query($conn, $sql); 
$result = $sql->get_result();
if ($result) {
	$q_res = $result->fetch_object();
	/*echo "Hello" . $username . $q_res->username . $clause;
	print_r($q_res);
	echo stripslashes(decrypt_md5($q_res->Password, $key));
	echo "ds".$password."ds".
	exit;
	*/

	if(strcmp(stripslashes(decrypt_md5($q_res->Password, $key)), $password) == 0) 
	{
		
		if($q_res->admin_status != '0')
			_setSession($q_res, $remember, 1);
		elseif($q_res->radio_status == '1')
		{
			$radio_res = $mySqli->query("SELECT * from RadioStationUser where UserId='$q_res->UserId'");
			if($radio_res) 
			{
				$radio_data=$radio_res->fetch_object();
				if($radio_data->status=='A')		
					_setSession($q_res, $remember, 1);
				else
				{
					//require_once("header.php");

					_logout(); 

					//message_box("Invalid Access","Your application is still pending approval or has been denied.",0,1);
				    header("location:index.php");

					return false;
				}	

				
			}
			else
			{
					_logout(); 

					return false;
			}
		}	
		/*elseif($q_res->dj_status == '1') 

		{

			$dj_res = mysqli_query($conn, $q="SELECT * from DJDetails where UserId='$q_res->UserId'", $conn);

			if($dj_res) 

			{

				$dj_data=mysqli_fetch_object($dj_res);

				if($dj_data->status=='A')		

					_setSession($q_res, $remember, 1);

				else {
				
					//require_once("header.php");

					_logout(); 

					//message_box("Invalid Access","Your application is still pending approval or has been denied.",0,1);
				    header("location:index.php");

					return false;

					}

			} 

			else 

			{

					_logout(); 

					return false;

			}

		}*/	

		else 

		{


				 $app_res = $mySqli->query("SELECT * from Application where  UserId='$q_res->UserId'");
				
				if($app_res) 

				{

					$app_data=$app_res->fetch_object();

					if($app_data->Approval_Status=='A')		
					{
						//Check songbook access
						if (IS_SONGBOOK == 1){
							$usr_pkg_res = $mySqli->query("SELECT PkgId FROM User_Pkgs WHERE UserId='$q_res->UserId' AND PkgId='" . SONGBOOK_PKGID . "'");
							if (!$usr_pkg_res || $usr_pkg_res->num_rows == 0){
								message_box("Permission Denied"
									, "Your account does not have access to Songbook.life. Please contact the administrators."
									,1);
								return false;
							}
						}
					
						_setSession($q_res, $remember, 1);
						
						

					}
					else {
					
						
						//require_once("header.php");

					//	_logout(); 

						message_box("Invalid Access","Your application is still pending approval or has been denied.",0,1);
				   // header("location:index.php");
						return false;

						 }

				} 

				else

				{

					_logout(); 

					return false;

				}

		  }

		return true; 

	} 

	else 

	{ 

		//require_once("header.php");

		_logout(); 

		//message_box("Invalid Username/Password","The username/password seems to be invalid. Please enter a valid username/password.",0,1);
				    header("location:index.php?alert=1");
		return false;

	} 

} 

else

 { 

	_logout(); 

	return false;

} 

} 



function _setSession(&$values, $remember, $init = true) {

	global $conn; 

	$_SESSION['user_id'] = $values->UserId; 

	$_SESSION['username'] = htmlspecialchars($values->Username); 

	$_SESSION['cookie'] = $values->cookie; 

	$_SESSION['logged'] = true; 

	$_SESSION['is_admin'] = $values->admin_status;

	$_SESSION['is_dj'] = $values->dj_status;
	
	$_SESSION['is_radio'] = $values->radio_status;

	
	//if(!($_SESSION['is_dj'] || $_SESSION['is_radio'])) {

		$data = mysqli_fetch_array(mysqli_query($conn, $q="Select * from Application left join User_Pkgs on User_Pkgs.UserId=Application.UserID left join Account_Packages on Account_Packages.PkgId = User_Pkgs.PkgId where Application.UserId='$_SESSION[user_id]'"));

		$_SESSION['Account'] = $data['PkgDetail'];

	/*} 
	elseif($_SESSION['is_radio'])
	{
		$_SESSION['Account'] = 'Radio Station Account';
	}	
	else
	{
		$_SESSION['Account'] = 'Individual DJ Account';
	}
*/
	

	if ($remember)

	{ 

	$this->updateCookie($values->cookie, true); 

	} 

	if ($init) { 

	$session = session_id(); 

	$ip = $_SERVER['REMOTE_ADDR']; 

	//$sql = "UPDATE Users SET Session = '$session', IP = '$ip' WHERE " .  "UserId = $values->UserId";

	 $sql = "INSERT INTO Sessions VALUES(NULL,'$values->UserId','$session','$ip',now())";

	mysqli_query($conn, $sql); 

	} 

} 



function updateCookie($cookie, $save) { 

$_SESSION['cookie'] = $cookie; 

if ($save) { 

$cookie = serialize(array($_SESSION['username'], $cookie) ); 

set_cookie('mtwebLogin', $cookie, time() + 31104000, '/directory/'); 

} 

} 



function _checkRemembered($cookie) { 

list($username, $cookie) = @unserialize($cookie); 

if (!$username or !$cookie) return; 

$username = $this->db->quote($username); 

$cookie = $this->db->quote($cookie); 

$sql = "SELECT * FROM member WHERE " . 

"(username = $username) AND (cookie = $cookie)"; 

$result = $this->db->getRow($sql); 

if (is_object($result) ) { 

$this->_setSession($result, true); 

} 

} 



function _checkSession() {

	global $conn;

	$username = $_SESSION['username']; 

	$userid = $_SESSION['user_id']; 

	$cookie = $_SESSION['cookie']; 

	$session = session_id(); 

	$ip = $_SERVER['REMOTE_ADDR']; 

	$t = "Sessions";



$sql = "SELECT * FROM $t WHERE " . "(UserId = '$userid') AND " . "(Session = '$session') AND (Ip = '$ip')"; 

$result = mysqli_fetch_object(mysqli_query($conn, $sql)); 

if (is_object($result) ) { 

//DS	_setSession($result, false, false); 

} else { 

	_logout(); 

} 

}

 



function _logout($box = 0) {

	global $conn;

	$session = session_id();

	$qry = "DELETE FROM Sessions WHERE UserId = '$_SESSION[user_id]' AND Session = '$session'";

	mysqli_query($conn, $qry);

	session_defaults();

	

	if($box)
			header("location:index.php");
		//message_box("Logout","You are now logged out");

}



function loggedin() {

// returns true if logged in

// false otherwise


if ($_SESSION['logged'])

	return true;

else

	return false;

} //loggedin





function require_login() {

	global $PHP_SELF;




if (loggedin())

	return;

else

	
	//header("location:index.php");
	include("lform.html");
	
	include("footer.php");


	die;



} // require_login()



function distribute_songs($userid,$reg_date,$type,$interval=30) 
{
	

include_once("mainfile.php");
$fixlimit = false;
	
list($SongLimit,$Musicgenre) = mysqli_fetch_array(mysqli_query($conn, $q="select SongsReview ,MusicServed  from Application where UserId='".$userid."'"));
	
	$intervaldays = 'INTERVAL '.$interval.' DAY';


$totalsongs = mysqli_query($conn, "SELECT a.SongId, count( b.Id ) AS cnt
FROM Songs a join Users u on a.UserId = u.UserId 
LEFT JOIN Song_Distribution b ON a.SongId = b.SongId
WHERE b.DJUserId = '".$userid."'
AND DATE_SUB( a.DistDate, '".$intervaldays."' ) < '".$reg_date."'
GROUP BY b.DJUserId
HAVING cnt < '".($SongLimit+1)."'
");
$distcount = mysqli_num_rows($totalsongs);


$genrearr = explode("|",$Musicgenre);

$arrlength = count($genrearr)-1 ;



$mod = $SongLimit%$arrlength;
$limit = $SongLimit/$arrlength;
$limit = floor($limit);

if($SongLimit<$arrlength)
	{
		$limit = 1;
		$fixlimit = true;
	}
	
for($i=0;$i<$arrlength;$i++)
{

	
	if(  ($i == ($arrlength-1))  &&  (!$fixlimit) )
		$limit + $mod;

	//echo $selectsongs = "Select a.SongId,count( b.Id ) AS cnt from Songs a left join Song_Distribution b on a.SongId=b.SongId  where a.Genre = '".$genrearr[$i]."'  and b.DJUserId='".$userid."' group by b.DJUserId having cnt < '".$limit."' ";

	if($type == 'MAA')
					 $selectsongs = mysqli_query($conn, $q="Select a.SongId from Songs a join Users u on a.UserId = u.UserId  left join Song_Distribution b on a.SongId=b.SongId join Song_Feedback c on b.SongId=c.SongId where   c.OverallRating > 3 and a.Genre = '".$genrearr[$i]."' and  DATE_SUB(a.DistDate,".$intervaldays.") < '".$reg_date."'   group by b.SongId limit 0,$limit ");
	else
					 $selectsongs = mysqli_query($conn, $q="Select a.SongId from Songs a join Users u on a.UserId = u.UserId  left join Song_Distribution b on a.SongId=b.SongId   where  a.Genre = '".$genrearr[$i]."' and  DATE_SUB(a.DistDate,".$intervaldays.") < '".$reg_date."'   group by b.SongId limit 0,$limit ");


	while($data_row = mysqli_fetch_array($selectsongs)){
	
			// if song already distributed
			$checkgenre_qry = "select * from Song_Distribution where SongId='$data_row[SongId]' and DJUserId = '$userid' ";
			$checkgenre_res = mysqli_query($conn, $checkgenre_qry);
			if(mysqli_num_rows($checkgenre_res) <= 0)
			{
			$res_song_dist1 = mysqli_query($conn, $q="insert into Song_Distribution(DJUserId, SongId, DistDate) VALUES('$userid', '$data_row[SongId]', now())");
	
				if(!$res_song_dist1)
					message_box("Errorrr!", mysqli_error());
				else
				{
					$subject21 =  "New songs have been added to your Trakheadz.com account";
					$recipient21 =  $data_genre['Email'];
						
					$message21 =  "Dear Member,<br><br> ";
					$message21 .=  "New songs have been added to your Trakheadz.com account. Log in today to hear these great new songs from some of the hottest major and independent recording artist in the music industry today.<br><br> ";
					$message21 .= "<br>
*************************
MEMBER SERVICES
*************************";						
					$headers21 =  "From: Trakheadz <noreply@trakheadz.com >\n";
					$headers21 .=  "Content-Type: text/html; charset=iso-8859-1\n"; // Mime type
				//	mail($recipient21, $subject21, $message21, $headers21);
				if($recipient21 != '')	
					smtpmail('donotreply@trakheadz.com',$recipient21,$subject21,$message21);

				}
	
		}// if song already distributed
	
	}

}

		if(($distcount < $SongLimit)  && ($interval < 150))
		{
			$interval = $interval + 30;
		    distribute_songs($user_id,$reg_date,$type,$interval);
		}


}

function getusrinfo($uid) 
{
    global $userinfo, $conn;
    $result = mysqli_query($conn, "SELECT * FROM Users WHERE UserId =  '$uid'");
    if (mysqli_num_rows($result) == 1) {
    	$userinfo = mysqli_fetch_row($result);
    }
    return $userinfo;
}

function getusrpackage($uid) 
{
    global $userinfo, $conn;
    $result = mysqli_query($conn, $q="SELECT PkgDetail FROM Account_Packages left join  User_Pkgs on
	User_Pkgs.PkgId = Account_Packages.PkgId
	where User_Pkgs.UserId =  '$uid'");
    if (mysqli_num_rows($result) == 1) {
    	$userinfo = mysqli_fetch_array($result);
    }
	return $userinfo['PkgDetail'];
}



function getproinfo($uid) 

{

    global $proinfo, $conn;

    $result = mysqli_query($conn, "SELECT * FROM Application WHERE UserId =  '$uid'");

    if (mysqli_num_rows($result) == 1) {

    	$proinfo = mysqli_fetch_array($result);

    }

    return $proinfo;

}



////////////////////////////////////

    function credit_card_authorise($uid)

	{
		$cardkey = 'khetrafunsunky1trakhe5';

		  $query = "SELECT decode(User_Pkgs.CCNo,'$cardkey') as CCNo1,User_Pkgs.CCType,User_Pkgs.ExpDate,Account_Packages.Price FROM User_Pkgs join Account_Packages on Account_Packages.PkgId = User_Pkgs.PkgId WHERE UserId = ".$uid;


		
		 

			$result = mysqli_query($conn, $query);

			$row_cc = mysqli_fetch_array($result);



			$proinfo = getproinfo($uid);

	$data1= mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Application where UserId='$uid'"));

		// Required variables for authorization gateway

		$transaction["target_app"] = "WebCharge_v5.06";

		$transaction["response_mode"] = "simple";

		$transaction["response_fmt"] = "delimited";

		$transaction["upg_auth"] = "zxcvlkjh";

		$transaction["delimited_fmt_field_delimiter"] = "=";

		$transaction["delimited_fmt_include_fields"] = "true";

		$transaction["delimited_fmt_value_delimiter"] = "|";

		

		

		// Your Gateway Authorization Credentials:

		$transaction["username"] = "TRAKHEADZINC05";
		$transaction["pw"] = "Mcmbz5X8N5c";
		//$transaction["username"] = "gatewaytest";
		//$transaction["pw"] = "GateTest2002";


		$transaction["trantype"] = "preauth";

//		$transaction["trantype"] = "preauth";

	    $transaction["reference"] = "";

		$transaction["trans_id"] = ""; 

	//	$transaction["authamount"] = $row_cc['Price'];
		 $transaction["authamount"] = ($data1[songlimit] * 10);
		
		

		  

		  

		// Credit Card information

		

		$transaction["cardtype"] = $row_cc['CCType'];

        $transaction["ccnumber"] = $row_cc['CCNo1'];

		

//		$transaction["cardtype"] = $row_cc['CCType'];

//        $transaction["ccnumber"] = $row_cc['CCNo'];



		$expdate = explode("-",$row_cc['ExpDate']); 



        $transaction["month"] = $expdate[1]; // Must be TWO DIGIT month.

        $transaction["year"] =  $expdate[0]; // Must be TWO or FOUR DIGIT year.



//        $transaction["fulltotal"] = $row_cc['Price']; // Total amount WITHOUT dollar sign.
        $transaction["fulltotal"] = ($data1[songlimit] * 10); // Total amount WITHOUT dollar sign.


        $transaction["ccname"] = $proinfo['FirstName']." ".$proinfo['LastName'];

		$transaction["baddress"] = $proinfo['Address'];

		$transaction["baddress1"] = "";

		$transaction["bcity"] = $proinfo['City'];

		$transaction["bstate"] = $proinfo['StateOrProvince'];

		$transaction["bzip"] = $proinfo['Zip'];

		$transaction["bcountry"] = $proinfo['Country']; // TWO DIGIT COUNTRY (United States = "US")

		$transaction["bphone"] = $proinfo['Phone'];

		$transaction["email"] = $proinfo['Email'];

		



		//--< POST THE TRANSACTION >-----------------------



        $response = PostTransaction($transaction);

		

		//--< PARSE THE RESPONSE >-------------------------

	
		if ($response["approval"] != "")
		{
			return "Approved";
		} 
		else
		{
			//echo $response["error"];
			return $response["error"];
		}





		    			

	}

/////////////////////////////////////////////////////////////////////////

function dateDiff1($interval,$dateTimeBegin,$dateTimeEnd) {
        //Parse about any English textual datetime
        //$dateTimeBegin, $dateTimeEnd
      
	   
	    $dateTimeBegin=strtotime($dateTimeBegin);
        if($dateTimeBegin === -1) {
          return("..begin date Invalid");
        }
        $dateTimeEnd=strtotime($dateTimeEnd);
        if($dateTimeEnd === -1) {
          return("..end date Invalid");
        }
		$dif=$dateTimeEnd - $dateTimeBegin;
        switch($interval) {
          case "s"://seconds
              return($dif);
          case "n"://minutes
              return(floor($dif/60)); //60s=1m
          case "h"://hours
              return(floor($dif/3600)); //3600s=1h
          case "d"://days
              return(floor($dif/86400)); //86400s=1d
          case "ww"://Week
              return(floor($dif/604800)); //604800s=1week=1semana
          case "m": //similar result "m" dateDiff Microsoft
              $monthBegin=(date("Y",$dateTimeBegin)*12)+
                date("n",$dateTimeBegin);
              $monthEnd=(date("Y",$dateTimeEnd)*12)+
                date("n",$dateTimeEnd);
              $monthDiff=$monthEnd-$monthBegin;
              return($monthDiff);
          case "yyyy": //similar result "yyyy" dateDiff Microsoft
              return(date("Y",$dateTimeEnd) - date("Y",$dateTimeBegin));
          default:
              return(floor($dif/86400)); //86400s=1d
        }
      }
/////////////get org id /////////////////////////////////////////
function getorgid($appid)
{
	$querystr = "Select UserId from Application where AppId=".$appid;
	$query = mysqli_query($conn, $querystr);
	$getorgid = mysqli_fetch_array($query);
	return $getorgid['UserId'];
}

function getmproarchive($userid)
{

 $fp = fopen("/home/trakhe5/public_html/archives/MusicPro/".$userid.".txt","w") or die("cant open file");
 
	$data1= mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Application where UserId='$userid'"));
	$data2 = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM User_Pkgs left join Account_Packages  on User_Pkgs.PkgId = Account_Packages.PkgId where UserId='$userid'"));
	fwrite($fp,"User Id : $userid\n");
	fwrite($fp,"Name : ".get_name($userid)."\n");
	fwrite($fp,"Address : ".$data1[Address]."\n");
	fwrite($fp,"City : ".$data1[City]."\n");
	fwrite($fp,"State : ".$data1[StateOrProvince]."\n");
	fwrite($fp,"Zip : ".$data1[Zip]."\n");
	fwrite($fp,"Country : ".$data1[Country]."\n");
	fwrite($fp,"Gender : ".$data1[Gender]."\n");
	fwrite($fp,"Fax : ".$data1[Fax]."\n");
	fwrite($fp,"Email : ".$data1[Email]."\n");
	fwrite($fp,"Profession : ".$data1[Profession]."\n");
	fwrite($fp,"Company : ".$data1[Company]."\n");
	fwrite($fp,"Website : ".$data1[Website]."\n");
	fwrite($fp,"Application Date  : ".$data1[AppDate]."\n");
	fwrite($fp,"Approval Status  : ".$data1[Approval_Status]."\n");
	fwrite($fp,"Package   : ".$data2[PkgDetail]."\n");
	fwrite($fp,"\n");
	fwrite($fp,"\n");
	
	$sel_str31 = "select * FROM Songs where UserId='$userid'";
				$ressel21=mysqli_query($conn, $sel_str31);	
				if(mysqli_num_rows($ressel21) > 0)
				{
				fwrite($fp,"SONGS UPLOADED\n");
				fwrite($fp,"---------------------------\n");
					while($dataSongs = mysqli_fetch_array($ressel21))
					{
						fwrite($fp,"1)\n");
						fwrite($fp,"SongFile  : ".$dataSongs[SongFile]."\n");
						fwrite($fp,"SongPath   : ".$dataSongs[SongPath]."\n");
						fwrite($fp,"SongTitle   : ".$dataSongs[SongTitle]."\n");
						fwrite($fp,"ArtistName   : ".$dataSongs[ArtistName]."\n");
						fwrite($fp,"Genre    : ".$dataSongs[Genre]."\n");
						fwrite($fp,"Label    : ".$dataSongs[Label]."\n");
						fwrite($fp,"\n");
					}
				}	
	
	
	fclose($fp);
}

function getmusicaccessarchive($userid)
{
	$fp = fopen("/home/trakhe5/public_html/archives/MusicAccess/".$userid.".txt","w") or die("cant open file");
 
	$data1= mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Application where UserId='$userid'"));
	$data2 = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM User_Pkgs left join Account_Packages  on User_Pkgs.PkgId = Account_Packages.PkgId where UserId='$userid'"));
	fwrite($fp,"User Id : $userid\n");
	fwrite($fp,"Name : ".get_name($userid)."\n");
	fwrite($fp,"Address : ".$data1[Address]."\n");
	fwrite($fp,"City : ".$data1[City]."\n");
	fwrite($fp,"State : ".$data1[StateOrProvince]."\n");
	fwrite($fp,"Zip : ".$data1[Zip]."\n");
	fwrite($fp,"Country : ".$data1[Country]."\n");
	fwrite($fp,"Gender : ".$data1[Gender]."\n");
	fwrite($fp,"Fax : ".$data1[Fax]."\n");
	fwrite($fp,"Email : ".$data1[Email]."\n");
	fwrite($fp,"Profession : ".$data1[Profession]."\n");
	fwrite($fp,"Company : ".$data1[Company]."\n");
	fwrite($fp,"Website : ".$data1[Website]."\n");
	fwrite($fp,"Application Date  : ".$data1[AppDate]."\n");
	fwrite($fp,"Approval Status  : ".$data1[Approval_Status]."\n");
	fwrite($fp,"Package   : ".$data2[PkgDetail]."\n");
	fwrite($fp,"\n");
	fwrite($fp,"\n");
	fclose($fp);
	
}
function getmiaarchive($userid)
{
$fp = fopen("/home/trakhe5/public_html/archives/Mia/".$userid.".txt","w") or die("cant open file");
 
	$data1= mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM Application where UserId='$userid'"));
	$data2 = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM User_Pkgs left join Account_Packages  on User_Pkgs.PkgId = Account_Packages.PkgId where UserId='$userid'"));
	fwrite($fp,"User Id : $userid\n");
	fwrite($fp,"Name : ".get_name($userid)."\n");
	fwrite($fp,"Address : ".$data1[Address]."\n");
	fwrite($fp,"City : ".$data1[City]."\n");
	fwrite($fp,"State : ".$data1[StateOrProvince]."\n");
	fwrite($fp,"Zip : ".$data1[Zip]."\n");
	fwrite($fp,"Country : ".$data1[Country]."\n");
	fwrite($fp,"Gender : ".$data1[Gender]."\n");
	fwrite($fp,"Fax : ".$data1[Fax]."\n");
	fwrite($fp,"Email : ".$data1[Email]."\n");
	fwrite($fp,"Profession : ".$data1[Profession]."\n");
	fwrite($fp,"Company : ".$data1[Company]."\n");
	fwrite($fp,"Website : ".$data1[Website]."\n");
	fwrite($fp,"Application Date  : ".$data1[AppDate]."\n");
	fwrite($fp,"Approval Status  : ".$data1[Approval_Status]."\n");
	fwrite($fp,"Package   : ".$data2[PkgDetail]."\n");
	fwrite($fp,"\n");
	fwrite($fp,"\n");
	fclose($fp);
}
function nl2br_skip_html($string)
{
// remove any carriage returns (mysql)
$string = str_replace("\r", '', $string);
// replace any newlines that aren't preceded by a > with a <br />
$string = preg_replace('/(?<!>)\n/', "<br />", $string);
return $string;
}
function paypal_payment($userid,$type)
{
			
 $proinfo = getproinfo($userid);
 
 	$data2 = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM User_Pkgs left join Account_Packages  on User_Pkgs.PkgId = Account_Packages.PkgId where UserId='$userid'"));
			
 $query = "SELECT * FROM User_Pkgs left join Account_Packages  on User_Pkgs.PkgId = Account_Packages.PkgId where UserId='$userid'";
  $result = mysqli_query($conn, $query);
  $row_cc = mysqli_fetch_array($result);
		  
		  			
				$custom_id = md5(uniqid(rand()));
				$custom_id = substr( $custom_id, 0,16);
				$return_url = "http://www.trakheadz.com/paypal_reorder.php";
				$paypal_url = "https://www.paypal.com/cgi-bin/webscr?";
			//	$paypal_url = "https://www.sandbox.paypal.com/cgi-bin/webscr?"; 
				$paypal_url .= "&receiver_email=mnakum@webmyne.com";
				$paypal_url .= "&return=".$return_url;
				$paypal_url .= "&cancel_return=".$return_url;
				
				$paypal_url .= "&notify_url=".$return_url;
				$paypal_url .= "&business=billing@trakheadz.com";
				//$paypal_url .= "&business=bhavin_1215080118_biz@webmyne.com";
				$paypal_url .= "&cmd=_xclick";
				$paypal_url .= "&item_name=Account Package Reorder";
				$paypal_url .= "&item_number=1";
				$paypal_url .= "&quantity=1";
				$paypal_url .= "&currency_code=USD";
				//$row_cc['Price']
		//		$paypal_url .= "&amount=".sprintf("%01.2f",0.01);
				$paypal_url .= "&amount=30.00";
				$paypal_url .= "&num_cart_items=1";
				$paypal_url .= "&first_name=".$proinfo['FirstName'];
				$paypal_url .= "&last_name=".$proinfo['LastName'];
				$paypal_url .= "&address_street=".$proinfo['Address'];
				$paypal_url .= "&address_city=".$proinfo['City'];
				$paypal_url .= "&address_state=".$proinfo['StateOrProvince'];
				$paypal_url .= "&address_zip=".$proinfo['Zip'];
				$paypal_url .= "&payer_email=".$proinfo['Email'];
				$paypal_url .= "&type=".$type;
				$paypal_url .= "&payer_id=21";
				$paypal_url .= "&custom=".urlencode($custom_id);
		
$querytra = "Insert into paypal_tra(user_id,custom_id,type,status) Values (".$userid.",'".urlencode($custom_id)."','".$type."','N')";
$a1 = mysqli_query($conn, $querytra);
$paypalid = mysqli_insert_id();


$usr_pkg_str = "INSERT INTO package_reorder(UserId,Reorder_Pkg_Id,Reorder_Date,Reorder_Status) VALUES('$userid','102',".mktime(0,0,0,date('m'),date('d'),date('y')).",'P')";
						$usr_pkg_res = mysqli_query($conn, $usr_pkg_str);

if($type == "P")
{
$queryrenew = mysqli_query($conn, "Insert into renew_account(user_id,dateofrenew,status,transaction_type,transaction_id) Values (".$userid.",'".date("Y-m-d")."','P','P',".$paypalid.")");

}

				
				
						
						if (!headers_sent($filename, $linenum)) 
						{
						   header("Location:".$paypal_url);
						   exit;
						
						// You would most likely trigger an error here.
						} 
						else 
						{
						
						   echo "Headers already sent in $filename on line $linenum\n" .
								 "Cannot redirect, for now please click this <a " .
								 "href=\"http://www.example.com\">link</a> instead\n";
						   exit;
						}


 }

function sendmessage($to,$from,$message,$subject,$songid)
{
			
			if($songid == '') $songid = '0';
			
			 	  $query = "INSERT INTO messages
(`from_id` , `to_id` , `song_id` , `send_date` , `status` , `subject` , `message_content` ) 
VALUES (".$from.",".$to.",".$songid.",'".time()."','A','".addslashes($subject)."','".addslashes($message)."')";
				
				
			
				$result = mysqli_query($conn, $query);
				if(!$result)
				   {
					   echo mysqli_error();
					   exit;
				   }
}
function sendmessage1($to,$from,$message,$subject,$lbb_id)
{
			
			if($songid == '') $songid = '0';
			
			 	  $query = "INSERT INTO messages
(`from_id` , `to_id` , `song_id` , `send_date` , `status` , `subject` , `message_content`,`lbb_id` ) 
VALUES (".$from.",".$to.",0,'".time()."','A','".addslashes($subject)."','".addslashes($message)."','".$lbb_id."')";
				
				
			
				$result = mysqli_query($conn, $query);
				if(!$result)
				   {
					   echo mysqli_error();
					   exit;
				   }
}

////to get small img and big img////

////prepare a text file for song -- radio station///

function get_song_textfile($songid)
{

 $sel_str31 = "select * FROM Songs where SongId='$songid'";
	$ressel21=mysqli_query($conn, $sel_str31);	
	$dataSongs = mysqli_fetch_array($ressel21);
	$file = $dataSongs['SongTitle']."-".$songid;
	
		  $file = ereg_replace('\"','_', basename(ereg_replace("'",'',$file)));
	
	if($_SERVER['HTTP_HOST']=='192.168.1.1')
	{	
		 $fp = fopen("c:/Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/song_text/".$file.".xml","w+") or die("cant open file");
		// $fp = fopen("..song_text/raat kali-24.txt","w+");// or die("cant open 	
	}
	else
	{	 
		 $fp = fopen("/home/trakhe5/public_html/song_text/".$file.".xml","w+");// or die("cant open file");
	
	}	 
 
			$datearr = explode("-",$dataSongs['Copy_Year']);
			fwrite($fp,"1)\n");
						
			fwrite($fp,"<?xml version=\"1.0\" encoding=\"UTF-8\"?>
<!DOCTYPE plist PUBLIC \"-//Apple Computer//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">
<plist version=\"1.0\">
<dict>			
	<key>song_file</key>
	<string>".$dataSongs['SongFile']."</string>
	<key>website</key>
	<string>".$dataSongs['website']."</string>
	<key>artist</key>
	<string>".$dataSongs['ArtistName']."</string>
	<key>image_file</key>
	<string>".$dataSongs['artist_image']."</string>
	<key>originating_service_name</key>
	<string>trakheadz</string>
	<key>target_station_name</key>
	<string>trakheadz</string>
	<key>album_publisher</key>
	<string>trakheadz</string>
	<key>album_release_year</key>
	<string>".date('Y')."</string>
	<key>album_copyright_owner_info</key>>
	<string>".$dataSongs['Copyright_Owner']."</string>>
	<key>use_annotation</key>
	<string>YES</string>
	<key>use_image_annotation</key>
	<string>YES</string>
	<key>album_date_created</key>
	<string>".date('Y-m-d')."</string>
	<key>sharable</key>
	<string>YES</string>
	<key>release_year</key>
	<string>".date('Y')."</string>
	<key>copyright_date</key>
	<string>".$dataSongs['Copy_Year']."</string>
	<key>AnnotationPlayerHeight</key>
	<string>240</string>
	<key>AnnotationPlayerWidth</key>
	<string>320</string>
</dict>
</plist>
			");
			fwrite($fp,"\n");
	fclose($fp);
}

/*
function get_song_textfile($songid)
{

 $sel_str31 = "select * FROM Songs where SongId='$songid'";
	$ressel21=mysqli_query($conn, $sel_str31);	
	$dataSongs = mysqli_fetch_array($ressel21);
	$file = $dataSongs['SongTitle']."-".$songid;
	
		  $file = ereg_replace('\"','_', basename(ereg_replace("'",'',$file)));
	
	if($_SERVER['HTTP_HOST']=='192.168.1.1')
	{	
		 $fp = fopen("c:/Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/song_text/".$file.".txt","w+") or die("cant open file");
		// $fp = fopen("..song_text/raat kali-24.txt","w+");// or die("cant open 	
	}
	else
	{	 
		 $fp = fopen("/home/trakhe5/public_html/song_text/".$file.".txt","w+");// or die("cant open file");
	
	}	 
 
	
				
						fwrite($fp,"1)\n");
						fwrite($fp,"SongFile  : ".$dataSongs[SongFile]."\n");
						fwrite($fp,"SongPath   : ".$dataSongs[SongPath]."\n");
						fwrite($fp,"SongTitle   : ".$dataSongs[SongTitle]."\n");
						fwrite($fp,"ArtistName   : ".$dataSongs[ArtistName]."\n");
						fwrite($fp,"Genre    : ".$dataSongs[Genre]."\n");
						fwrite($fp,"Label    : ".$dataSongs[Label]."\n");
						fwrite($fp,"\n");
	
	
	fclose($fp);
}

*/

///////////////////////////////////////////////////

//Prepare zip file and ask for download for Backbone radio Station
function download_song_data($songid)
{
	require("zipclass.php");
	
	$zipfile = new zipfile();  
	
	$sel_str31 = "select * FROM Songs where SongId='$songid'";
	$ressel21=mysqli_query($conn, $sel_str31);	
	$dataSongs = mysqli_fetch_array($ressel21);
	// add the subdirectory ... important!
	$zipfile -> add_dir("".$dataSongs['SongTitle']."/");

	
	//Add songFile
	//echo "c:\\Program Files\\Apache Group\\Apache2\\htdocs\\projects\\newtrakheadz\\".str_replace("/","\\",$dataSongs['SongPath'])."\\".$dataSongs['SongFile']."";
	 $filedata = file_get_contents("/home/trakhe5/public_html/".$dataSongs['SongPath']."/".$dataSongs['SongFile']."");
	//exit;
	$zipfile -> add_file($filedata, "".$dataSongs['SongTitle']."/".$dataSongs['SongFile']."");  
	

	//Add song Artist Image
	$filedata = file_get_contents("/home/trakhe5/public_html/images/artist_images/".$dataSongs['artist_image']."");
	$zipfile -> add_file($filedata, "".$dataSongs['SongTitle']."/".$dataSongs['artist_image']."");  

	//Add song Text File
	$file = $dataSongs['SongTitle']."-".$songid;
	get_song_textfile($songid);

	$filedata = file_get_contents("/home/trakhe5/public_html/song_text/".$file.".txt");
	$zipfile -> add_file($filedata, "".$dataSongs['SongTitle']."/".$file.".txt");  
	
	// the next three lines force an immediate download of the zip file:
	header("Content-type: application/octet-stream");  
	header("Content-disposition: attachment; filename=".$dataSongs['SongTitle'].".zip");  
	echo $zipfile -> file();  

}
///
function downplaylist($userid,$min)
{
set_time_limit(0);

	if($_SERVER['HTTP_HOST']=='192.168.1.1')
	{
		
		require_once('Archive/Tar.php');
		$rootpath ="c:/Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/";
		$rootpath1 ="Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/";
	}
	else
	{
		require_once('pear/Archive/Tar.php');
		$rootpath = "/home/trakhe5/public_html/";
		$rootpath1 = "/home/trakhe5/public_html/";
	}
	
 $resUser = mysqli_query($conn, $q="Select * from RadioStationUser where UserId='".$userid."'");
		$dataUser = mysqli_fetch_array($resUser);
		
		
		 if($dataUser['Playlist_from'] == "M")
		  {
			 $where1 = " and a.submited_by = 'M' "; 
		  }
		 elseif($dataUser['Playlist_from'] == "D ")
		 {
			 $where1 = " and a.submited_by = 'D' "; 
		 }	
// Create instance of Archive_Zip class, and pass the name of our zipfile
//$zipfile = new Archive_Zip('myzipfile.zip');
$tar_filename = "zip/".$_REQUEST['PHPSESSID'].".tar";
$zipfile = new Archive_Tar($tar_filename);
$list=array();

$res1 = mysqli_query($conn, $q="select distinct(a.SongId) from Playlist a WHERE a.Submit='1'  order by a.Rank ");

			$tempfolder = "admintemp/".$_REQUEST[PHPSESSID];
			mkdir($tempfolder,0777);
			$countsongdir = 0;
			
			
			

			
			while($recplaylist = mysqli_fetch_array($res1))
			{
			
				
				list($NoDownload) = mysqli_fetch_array(mysqli_query($conn, "select count(*) as tot from radiostation_downloads where songid = '".$recplaylist[SongId]."' and UserId = '".$userid."'"));
			if($NoDownload <= 0)
			{
				
				mkdir($tempfolder."/".$countsongdir,0777);
			
				$sel_str31 = "select * FROM Songs where SongId='".$recplaylist[SongId]."'";
				$ressel21=mysqli_query($conn, $sel_str31);	
				$dataSongs = mysqli_fetch_array($ressel21);
		 
//		    echo $recplaylist[SongId]."-";
			 	$filename = $rootpath.$dataSongs['SongPath']."/".$dataSongs['SongFile'];

				
				// song file 
				if(copy($filename,$tempfolder."/".$countsongdir."/".$dataSongs['SongFile']))
				{
					$list[]=$tempfolder."/".$countsongdir."/".$dataSongs['SongFile'];
				}

				
				// image file 
			
				if($dataSongs['artist_image'])
				{
					$imagefilename =$rootpath."images/artist_images/".$dataSongs['artist_image'];
					$fname=$dataSongs['artist_image'];
				}
				else
				{
					$imagefilename =$rootpath."images/artist_images/thlogo.jpg";
					$fname="thlogo.jpg";
				}
			
				if(copy($imagefilename,$tempfolder."/".$countsongdir."/".$fname))
				{
					$list[]=$tempfolder."/".$countsongdir."/".$fname;
				}

				
				
				
				// Text file 
					get_song_textfile($recplaylist[SongId]);
					$file = $dataSongs['SongTitle']."-".$recplaylist[SongId].".xml";
					$textfilename = $rootpath."song_text/".$file;
		
			
				if(copy($textfilename,$tempfolder."/".$countsongdir."/".$file))
				{
					$list[]=$tempfolder."/".$countsongdir."/".$file;
				}

				$Inssql = mysqli_query($conn, "Insert Into radiostation_downloads(songid,download_date,UserId) Values('".$recplaylist[SongId]."',NOW(),'".$_SESSION[user_id]."')");

				//echo $countsongdir."=";
				++$countsongdir;
		
				}// if already download song
			
			}//while


// Create a list of files and directories
//$list = array('songs/08 Jeene Ke Ishaare.mp3','songs/Betab Dil Hai.mp3','songs/Jeene Ke Ishaare.mp3','sample.html');

// Create the zip file
$zipfile->create($list);

//$filenametar = $rootpath.$tar_filename;
			/*$mm_type="application/octet-stream";
			header("Cache-Control: no-cache, no-store, max-age=0, must-revalidate");
			header("Pragma: no-cache'");
			header("Content-Type: " . $mm_type);
			header("Content-Length: " .(string)(filesize($tar_filename)) );
			header('Content-Disposition: attachment; filename="mytestzipfile.tar"');
			header("Content-Transfer-Encoding: binary\n");
							   
			$fp = fopen($tar_filename, 'rb');
			$buffer = fread($fp, filesize($tar_filename));
			fclose ($fp);
			echo $buffer;*/
			
			
			echo "<script type='text/javascript'>";
			echo "var wn=window.open('http://www.trakheadz.com/".$tar_filename."','download');";
			echo "history.go(-1);";
			echo "</script>";
		
/*		  header("Content-type: application/octet-stream");  
		  header("Content-Length: ".filesize($tar_filename)."");  
		  header("Content-disposition: attachment; filename=playlist.tar");  
		
	$handle1 = fopen($tar_filename, "r");
	$contents = fread($handle1, filesize($tar_filename));
	fclose($handle1);
	echo  $contents;
*/	
	 		
//@unlink($tar_filename);
//@rmdir($tempfolder);
//exec("rmdir /s /q ".$tempfolder);
/*
	require("pclzip.lib.php");

	if($_SERVER['HTTP_HOST']=='192.168.1.1')
	{
		$rootpath ="c:/Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/";
		$rootpath1 ="Program Files/Apache Group/Apache2/htdocs/projects/newtrakheadz/";
	}
	else
	{
		$rootpath = "/home/trakhe5/public_html/";
		$rootpath1 = "/home/trakhe5/public_html/";
	}



		$resUser = mysqli_query($conn, $q="Select * from RadioStationUser where UserId='".$userid."'");
		$dataUser = mysqli_fetch_array($resUser);
		
		 if($dataUser['Playlist_from'] == "M")
		  {
			 $where1 = " and a.submited_by = 'M' "; 
		  }
		 elseif($dataUser['Playlist_from'] == "D ")
		 {
			 $where1 = " and a.submited_by = 'D' "; 
		 }
    		


    		$res1 = mysqli_query($conn, $q="select distinct(a.SongId) from Playlist a WHERE a.Submit='1'  $where1 order by a.Rank ");
			
		
		if(mysqli_num_rows($res1) > 0)
		{	
			
			
	$zipfile = new PclZip($rootpath."zip/playlist_".$min.".zip");  
			
			while($recplaylist = mysqli_fetch_array($res1))
			{
			
				$sel_str31 = "select * FROM Songs where SongId='".$recplaylist[SongId]."'";
				$ressel21=mysqli_query($conn, $sel_str31);	
				$dataSongs = mysqli_fetch_array($ressel21);
		 
//		    echo $recplaylist[SongId]."-";
			 	$filename = $rootpath.$dataSongs['SongPath']."/".$dataSongs['SongFile'];

				if(!file_exists($filename))
					{
						echo "the file does not exist";
						exit;
					}

	
		
		 
		  //$recplaylist = mysqli_fetch_array($res1);
		 	list($NoDownload) = mysqli_fetch_array(mysqli_query($conn, "select count(*) as tot from radiostation_downloads where songid = '".$recplaylist[SongId]."' and UserId = '".$userid."'"));
			if($NoDownload <= 0)
			{
				
				
			// song file //	
 				$zipfile -> add($rootpath.$dataSongs['SongPath']."/".$dataSongs['SongFile'],$p_add_dir="playlist/".$dataSongs['SongTitle'],$p_remove_dir=$rootpath1.$dataSongs['SongPath']); 
		
			// artist file //
				if($dataSongs['artist_image'])
				{

	$zipfile -> add($rootpath."images/artist_images/".$dataSongs['artist_image'],$p_add_dir="playlist/".$dataSongs['SongTitle'],$p_remove_dir=$rootpath1."images/artist_images");  

				}
				else
				{

	$zipfile -> add($rootpath."images/artist_images/thlogo.jpg",$p_add_dir="playlist/".$dataSongs['SongTitle'],$p_remove_dir=$rootpath1."images/artist_images");  
				
				}
			// text file //
		get_song_textfile($recplaylist[SongId]);
		$file = $dataSongs['SongTitle']."-".$recplaylist[SongId];
	
	$zipfile -> add($rootpath."song_text/".$file.".txt",$p_add_dir="playlist/".$dataSongs['SongTitle'],$p_remove_dir=$rootpath1."song_text");  
			///////

				$Inssql = mysqli_query($conn, "Insert Into radiostation_downloads(songid,download_date,UserId) Values('".$recplaylist[SongId]."',NOW(),'".$_SESSION[user_id]."')");
		
		
		
			}	
			

		
		
			}//while


	//print $zipfile ->listContent();
	//exit;

	
	
	
	$filename = $rootpath."zip/playlist_".$min.".zip";

	if(!file_exists($filename))
	{
		echo "the file does not exist";
		exit;
	}

		  header("Content-type: application/octet-stream");  
		  header("Content-disposition: attachment; filename=playlist_".$min.".zip");  
		  readfile($filename);


	$handle = fopen($filename, "r");
	$contents = fread($handle, filesize($filename));
	fclose($handle);

*/


	//unlink($rootpath."zip/playlist_".$min.".zip");	
	//echo $zipfile -> file();  

	//	}	
} 

////////////////////////////////////
/*
function downplaylist($userid)
{
	require("zipclass.php");

	if($_SERVER['HTTP_HOST']=='192.168.1.1')
		$rootpath ="c:\\Program Files\\Apache Group\\Apache2\\htdocs\\projects\\newtrakheadz\\";
	else
		$rootpath = "/home/trakhe5/public_html/";
	
		$resUser = mysqli_query($conn, $q="Select * from RadioStationUser where UserId='".$userid."'");
		$dataUser = mysqli_fetch_array($resUser);
		
		 if($dataUser['Playlist_from'] == "M")
		  {
			 $where1 = "and a.submited_by = 'M'"; 
		  }
		 elseif($dataUser['Playlist_from'] == "D")
		 {
			 $where1 = "and a.submited_by = 'D'"; 
		 }
    		$res1 = mysqli_query($conn, $q="select distinct(a.SongId) from Playlist a WHERE a.Submit='1' and date_format(a.CreatedDate,'%M %y') = date_format(NOW(),'%M %y') $where1 order by a.Rank");
			
		if(mysqli_num_rows($res1) > 0)
		{	
			$zipfile = new zipfile();  
			$zipfile -> add_dir("playlist/");
			
			while($recplaylist = mysqli_fetch_array($res1))
			{

		  //$recplaylist = mysqli_fetch_array($res1);
		 	list($NoDownload) = mysqli_fetch_array(mysqli_query($conn, "select count(*) as tot from radiostation_downloads where songid = '".$recplaylist[SongId]."' and UserId = '".$userid."'"));
			if($NoDownload <= 0)
			{
				//download_song_data($recplaylist[SongId]);
				$sel_str31 = "select * FROM Songs where SongId='".$recplaylist[SongId]."'";
				$ressel21=mysqli_query($conn, $sel_str31);	
				$dataSongs = mysqli_fetch_array($ressel21);
				// add the subdirectory ... important!
				$zipfile -> add_dir("playlist/".$dataSongs['SongTitle']."/");
				//Add songFile
				$filedata = file_get_contents($rootpath."songs/theadzpromo/traksongfile222.mp3");
				
				$zipfile -> add_file($filedata, "playlist/".$dataSongs['SongTitle']."/".$dataSongs['SongFile']); 
				//Add song Artist Image
				if($dataSongs['artist_image'])
				{
					$filedata = file_get_contents($rootpath."images/artist_images/".$dataSongs['artist_image']."");
					$zipfile -> add_file($filedata, "playlist/".$dataSongs['SongTitle']."/".$dataSongs['artist_image']."");  
				}
				//Add song Text File
				$file = $dataSongs['SongTitle']."-".$recplaylist[SongId];
				get_song_textfile($recplaylist[SongId]);
	
				$filedata = file_get_contents($rootpath."song_text/".$file.".txt");
				$zipfile -> add_file($filedata, "playlist/".$dataSongs['SongTitle']."/".$file.".txt");  
				//$Inssql = mysqli_query($conn, "Insert Into radiostation_downloads(songid,download_date,UserId) Values('".$recplaylist[SongId]."','".time()."','".$_SESSION[user_id]."')");
			}	
			}
	header("Content-type: application/octet-stream");  
	header("Content-disposition: attachment; filename=".$dataSongs['SongTitle'].".zip");  
	echo $zipfile -> file();  

		}	
} 
*/


 function HeaderingExcel($filename) {
      header("Content-type: application/vnd.ms-excel");
      header("Content-Disposition: attachment; filename=$filename" );
      header("Expires: 0");
      header("Cache-Control: must-revalidate, post-check=0,pre-check=0");
      header("Pragma: public");
      								} 
//functio download playlist for radio station
function download_playlist()
{
	require_once('write_excel/Worksheet.php');
	require_once('write_excel/Workbook.php');


 					  $filexl =  "aaa.xls";
					     // HTTP headers
 						 HeaderingExcel($filexl);

					  // Creating a workbook
					  $workbook = new Workbook("-");
					  // Creating the second worksheet
					  $worksheet1 =& $workbook->add_worksheet('First One');
					
					  // Format for the headings
					  $formatot =& $workbook->add_format();
					  $formatot->set_size(10);
					  $formatot->set_align('center');
					  $formatot->set_color('white');
					  $formatot->set_pattern();
					  $formatot->set_fg_color('magenta');
					
					  $worksheet1->set_column(0,2,30);
					  $worksheet1->set_column(3,3,30);
					  $worksheet1->set_column(4,4,15);
					  $worksheet1->set_column(5,5,40);
					  
					  $worksheet1->write_string(1,0,"No",$formatot);
					  $worksheet1->write_string(1,1,"Song Title",$formatot);
					  $worksheet1->write_string(1,2,"Artist Name",$formatot);
					  $worksheet1->write_string(1,3,"Song Genre",$formatot);
  					  $worksheet1->write_string(1,4,"No. Of DJ Added Song to Playlist",$formatot);

					  
    		  			$res1 = mysqli_query($conn, $q="select distinct(a.SongId) from Playlist a WHERE a.Submit='1' and date_format(a.CreatedDate,'%M %y') = date_format(NOW(),'%M %y') $where1 order by a.Rank");
							$lenX = 2;
						while($recplaylist = mysqli_fetch_array($res1))
						{
							$song_data = get_song_details($recplaylist[SongId]);
							$worksheet1->write($lenX,0,$lenX);
							$worksheet1->write_string($lenX,1,$song_data[SongTitle]);
							$worksheet1->write_string($lenX,2,$song_data[ArtistName]);
							$worksheet1->write($lenX,3,$song_data[Genre]);
							
							$noofdj1 = mysqli_query($conn, $q="SELECT * FROM Playlist a WHERE  date_format(a.CreatedDate,'%M %y') = date_format(NOW(),'%M %y') and a.SongId = ".$recplaylist[SongId]." GROUP BY a.SongId");
	
							$noofdj = mysqli_num_rows($noofdj1);
							$worksheet1->write($lenX,4,$noofdj);
							$lenX++;
						}
						$workbook->close();

	
}


 function getartistimage($filename,$height=50,$width=80) {
     
					if($filename == '')
					{
						$filename = 'thlogo.jpg';
					}

							$str = "<img  style='border:none' src='images/artist_images/".$filename."' height='".$height."' width='".$width."'>"	;	
						
							
						
							return $str;
} 
	
	
function smtpmail($from,$to,$subject,$body,$pathprefix)
{
require_once("path.php");
require_once("class.phpmailer.php");


$mail = new PHPMailer();

/*$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = "mail.webmyne.com";  // specify main and backup server
$mail->SMTPAuth = true;     // turn on SMTP authentication
$mail->Username = "mnakum@webmyne.com";  // SMTP username
$mail->Password = "1234567890"; // SMTP password



$mail->From = "donotreply@trakheadz.com"; 
$mail->FromName = "Trakheadz.com";
$mail->AddAddress("".$to."");
$mail->AddAddress("manish_nakum@hotmail.com", "Information");
$mail->AddAddress("mnakum@webmyne.com", "Information");
$mail->AddReplyTo($from);
*/

$mail->IsSMTP();                                      // set mailer to use SMTP
$mail->Host = "mail.trakheadz.com";  // specify main and backup server
$mail->SMTPAuth = true;     // turn on SMTP authentication
$mail->Username = "donotreply@trakheadz.com";  // SMTP username
$mail->Password = "donotreply"; // SMTP password
$mail->Port = "587";


$mail->From = "donotreply@trakheadz.com"; 
$mail->FromName = "Trakheadz.com";
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
	   echo "Message could not be sent. <p>";
	   echo "Mailer Error: " . $mail->ErrorInfo;
	   exit;
	}
}
/*

    require("path.php");
    require("Mail.php");
	
$from = "Trakheadz.com <".$from.">";
$to = "Ramona Recipient <".to.">";

$from = "donotreply@trakheadz.com";
$host = "mail.trakheadz.com";
$username = "donotreply@trakheadz.com";
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

function dateDiff($dformat="-", $endDate, $beginDate)
{
$date_parts1=explode($dformat, $beginDate);
$date_parts2=explode($dformat, $endDate);
$start_date=gregoriantojd($date_parts1[1], $date_parts1[2], $date_parts1[0]);
$end_date=gregoriantojd($date_parts2[1], $date_parts2[2], $date_parts2[0]);
return $end_date - $start_date;
}


function closeaccount($userid)
{
require_once("path.php");
require_once("mainfile.php");
	
	
	$str = mysqli_query($conn, "UPDATE Application set Approval_Status='C' WHERE UserId='".$userid."'");


if(!$str)
	{
		$closemsg = "There is some problem in close this account";
	}
else
	{
		$del_message = mysqli_query($conn, "DELETE from messages where from_id = '".$userid."' or to_id = '".$userid."' ");
		
		_logout(1);
	}


}

function deleteuser($userid)
{

	if(accounttype($userid) == 'Music Pro')
	{
		$del_song = mysqli_query($conn, "select * from Songs where UserId = '".$userid."'");		
		while($data = mysqli_fetch_array($del_song))
		{
			deletesong($data['SongId'],$userid);
		}
		
		
	}
	else if(accounttype($userid) == 'Music Access')
	{
		$update_user_app = mysqli_query($conn, "Update Application set OrgId='1120' where UserId = '".$userid."'");
	}
	else if(accounttype($userid) == 'Music Industry Access')
	{
	
	$del_feedback = mysqli_query($conn, "DELETE from Song_Feedback where DJUserId = '".$userid."'");
	$del_distribution = mysqli_query($conn, "DELETE from Song_Distribution where DJUserId = '".$userid."'");
	$del_crate = mysqli_query($conn, "DELETE from DJCrate  where DJUserId = '".$userid."'");
	$del_message = mysqli_query($conn, "DELETE from messages   where from_id = '".$userid."' OR to_id = '".$userid."'");
	
	}
	else if(accounttype($userid) == 'Fanbase')
	{
	
	$del_feedback = mysqli_query($conn, "DELETE from Song_Feedback where DJUserId = '".$userid."'");
	$del_distribution = mysqli_query($conn, "DELETE from Song_Distribution where DJUserId = '".$userid."'");
	$del_crate = mysqli_query($conn, "DELETE from DJCrate  where DJUserId = '".$userid."'");
	$del_message = mysqli_query($conn, "DELETE from messages   where from_id = '".$userid."' OR to_id = '".$userid."'");	
	}

	// for delete the songs//

	$del_feedback = mysqli_query($conn, "DELETE from Song_Feedback where DJUserId = '".$userid."'");
	$del_distribution = mysqli_query($conn, "DELETE from Song_Distribution where DJUserId = '".$userid."'");
	$del_crate = mysqli_query($conn, "DELETE from DJCrate  where DJUserId = '".$userid."'");
	$del_message = mysqli_query($conn, "DELETE from messages   where from_id = '".$userid."' OR to_id = '".$userid."'");	


	// delete the songs is over//
		$delete_user_pkg = mysqli_query($conn, "Delete from User_Pkgs where UserId = '".$userid."'");
		$delete_user_app = mysqli_query($conn, "Delete from Application where UserId = '".$userid."'");
		$delete_user = mysqli_query($conn, "Delete from Users where UserId = '".$userid."'");
}

function accounttype($userid)
{

$data = mysqli_fetch_array(mysqli_query($conn, $q="Select * from Application left join User_Pkgs on User_Pkgs.UserId=Application.UserID left join Account_Packages on Account_Packages.PkgId = User_Pkgs.PkgId where Application.UserId='".$userid."'"));

		return $data['PkgType'];
}


function deletesong($songid,$userid)
{
	require_once("path.php");
	require_once("mainfile.php");

$del_feedback = mysqli_query($conn, "DELETE from Song_Feedback where SongId = '".$songid."'");
$del_distribution = mysqli_query($conn, "DELETE from Song_Distribution where SongId = '".$songid."'");
$del_song = mysqli_query($conn, "DELETE from Songs where SongId = '".$songid."'");
$del_crate = mysqli_query($conn, "DELETE from DJCrate  where SongId = '".$songid."'");
$update_song_limit = mysqli_query($conn, "Update  Application set songlimit=sonlimit-1 where UserId = '".$userid."'");
$del_message = mysqli_query($conn, "DELETE from messages   where songid = '".$songid."'");


}

function remove_not_feedbacked($userid)
{
	require_once("path.php");
	require_once("mainfile.php");

	$result=  mysqli_query($conn, "SELECT a.SongId 
FROM Song_Distribution a
LEFT JOIN Song_Feedback b ON a.DJUserId = b.DJUserId
AND a.SongId = b.SongId
WHERE b.DJUserId IS NULL and a.DJUserId = '".$userid."'
AND date_add( a.DistDate, INTERVAL 30
DAY ) < CURRENT_DATE");

	while($row=mysqli_fetch_array($result)){
			
			$delete = mysqli_query($conn, "delete from Song_Distribution where SongId='".$row['SongId']."' and DJUserId = '".$userid."'");
	
	}


}

function checksongreviewlimit($userid,$month,$year)
{
		list($count) =  mysqli_fetch_array(mysqli_query($conn, $q="SELECT count(a.SongId)  
FROM Song_Distribution a
WHERE a.DJUserId = '".$userid."'
AND month( a.DistDate ) = '".$month."'
AND year( a.DistDate ) = '".$year."'
"));

		return $count;	

}



	list($bigimage,$smallimage) = mysqli_fetch_array(mysqli_query($conn, "select big_image_name,small_image_name from random_images order by rand() limit 0,1"));

	
	list($image) = mysqli_fetch_array(mysqli_query($conn, "select image_name from background_images_colors  order by rand() limit 0,1"));



//echo "</br>At end of mainfile Logged in = " . $_SESSION['logged'] . "as user: " . $_SESSION['username'] . "ID: " . SID; 
?>