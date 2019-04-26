<?
function create_guid(){
  return bin2hex(openssl_random_pseudo_bytes(16));
}

function message_box($title,$msg,$back=0,$noexit=0, $pwd_reenter=0) {

  echo "<table align='center'><tr><td><br><br></td></tr>";

  echo "<tr><th align='center'>$title</th></tr>";

  echo "<tr><td>$msg";

  if($back == 1) {

        echo " Click <a href='javascript:history.go(-1);' >
		<span class='here'>HERE</span></a> to go back.";

  	if($pwd_reenter == '1') 

		echo "Please re-enter password if you had entered it";

  }	

  echo "</td></tr>";

  echo "</table>";

  if($noexit == 0) {

  	//require_once("footer.php");

  	die();

  }



}



function ValidateMail($Email) { 

    global $HTTP_HOST; 

    $result = array(); 

    if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $Email)) { 

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



function get_country_name($code) {

		global $conn;

		$res = mysqli_query($conn, $q="select country_name from Country where country_code like '$code'");

    $rows = mysqli_fetch_array($res);

    if($rows['country_name'])

    	return $rows['country_name'];

}









function WriteDateSelect($BeginYear = 0,$EndYear = 0,$IsPosted = true,$Prefix = '',$showday = 0) {

	global $Year, $Month, $Day;

  if (! $BeginYear)

    $BeginYear = date('Y');

		

  if (! $EndYear)

    $EndYear = $BeginYear;

	

  /*$Year = $IsPosted ? (int) $_POST[$Prefix . 'Year'] : (int) $_GET[$Prefix . 'Year'];

  $Month = $IsPosted ? (int) $_POST[$Prefix . 'Month'] : (int) $_GET[$Prefix . 'Month'];

  $Day = $IsPosted ? (int) $_POST[$Prefix . 'Day'] : (int) $_GET[$Prefix . 'Day'];

  */	

  echo '<select id=selyear name="', $Prefix, 'Year">';

	

  for ($i = $BeginYear; $i <= $EndYear; $i++)

  {

    echo '<option ';

    if ($i == $Year)

      echo 'selected="yes"';

    echo '>', $i, '</option>';

  }

	

  echo '</select>-<select id=selmonth name="', $Prefix, 'Month">';	



  for ($i = 1; $i <= 12; $i++)

  {

  	if($i < 10)

  		$mval = '0' . $i;

	else

		$mval = $i;

    echo '<option ';

    if ($i == $Month)

      echo 'selected="yes"';

    echo ' value="' . $mval . '">', $i, '</option>';

  }



  echo '</select>';

if($showday == 1)
{
  echo '-<select name="', $Prefix, 'Day">';	



  for ($i = 1; $i <= 31; $i++)

  {

  	if($i < 10)

  		$dval = '0' . $i;

	else

		$dval = $i;

    echo '<option ';

    if ($i == $Day)

      echo 'selected="yes"';

    echo ' value="' . $dval . '">', $i, '</option>';

  }

  echo '</select>';

}



  return;

}



function GetDateSelectString($IsPosted = true,$Prefix = '') {

  if ($IsPosted)

    return $_POST[$Prefix . 'Year'] . '-' . $_POST[$Prefix . 'Month'] . '-' . $_POST[$Prefix . 'Day'];



  return $_GET[$Prefix . 'Year'] . '-' . $_GET[$Prefix . 'Month'] . '-' . $_GET[$Prefix . 'Day'];

}



function is_url($url) { 

    if (!preg_match('#^http\\:\\/\\/[a-z0-9\-]+\.([a-z0-9\-]+\.)?[a-z]+#i', $url) ) 

        return false; 

    else  

        return true; 

     

}
function is_url1($url) { 

    return ereg("^(http|ftp)://(www\.)?.+\.(com|net|org)$", $url); 
}




function get_pkg_detail($pkgid) {

	global $conn;

	$res = mysqli_query($conn, "SELECT PkgDetail from Account_Packages WHERE PkgId='$pkgid'");

	if(mysqli_num_rows($res) > 0) {

		$data = mysqli_fetch_array($res);

		return $data[PkgDetail];

	} else

		return '';

}



function get_user_pkg_detail($uid) {

        global $conn;

        $res = mysqli_query($conn, $q="Select PkgDetail from Account_Packages left join User_Pkgs on User_Pkgs.PkgId = Account_Packages.PkgId where User_Pkgs.UserId='$uid'");

        if(mysqli_num_rows($res) > 0) {

		$data = mysqli_fetch_array($res);

                return $data[PkgDetail];

        } else

                return '';

}



function get_name($uid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, $q="SELECT FirstName, MiddleName, LastName FROM Application WHERE UserId='$uid'"));

	$strname = $data[FirstName] . ' ';

	$strname .= $data[MiddleName] ? $data[MiddleName] . ' ' : '';

	$strname .= $data[LastName];

	return $strname;

}

function get_radioname($uid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, "SELECT Company FROM RadioStationUser WHERE UserId='$uid'"));

	$strname = $data[Company];

	return $strname;

}



function get_djname($uid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, "SELECT FullName FROM DJDetails WHERE UserId='$uid'"));

	$strname = $data[FullName];

	return $strname;

}



function get_gender($uid) {

        global $conn;

        $data = mysqli_fetch_array(mysqli_query($conn, "SELECT Gender FROM Application WHERE UserId='$uid'"));

        if($data[Gender] == 'M')

                return 'Male';

        else

                return 'Female';

}



function get_djgender($uid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, "SELECT Gender FROM DJDetails WHERE UserId='$uid'"));

	if($data[Gender] == 'M')

		return 'Male';

	else

		return 'Female';	

}



function get_address($uid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, $q="SELECT Address, City, StateOrProvince, Zip, Country FROM Application where UserId='$uid'"));

	$add = $data[Address];

	$add .= $data[City] ? '<br>' . $data[City] : '';

	$add .= $data[StateOrProvince] ? ' ' . $data[StateOrProvince] : '';

	$add .= $data[Zip] ? '<br>' . $data[Zip] : '';

	$add .= $data[Country] ? '<br>' . $data[Country] : '';

	return $add;

}



function get_djaddress($uid) {

        global $conn;

        $data = mysqli_fetch_array(mysqli_query($conn, $q="SELECT Address, City, State, Zip, Country FROM DJDetails where UserId='$uid'"));

        $add = $data[Address];

        $add .= $data[City] ? '<br>' . $data[City] : '';

        $add .= $data[StateOrProvince] ? ' ' . $data[StateOrProvince] : '';

        $add .= $data[Zip] ? '<br>' . $data[Zip] : '';

        $add .= $data[Country] ? '<br>' . $data[Country] : '';

        return $add;

}



function get_song_status($sid) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, "SELECT status FROM Songs WHERE SongId='$sid'"));

	return $data[status];

}



function get_org_name($id) {

	global $conn;

	$data = mysqli_fetch_array(mysqli_query($conn, "SELECT Company FROM Application WHERE UserId='$id'"));

	return $data[Company];

}



function get_song_details($sid) {

	global $conn;

	$res = mysqli_query($conn, "SELECT ArtistName, SongTitle, Genre, SubGenre, Label,artist_image FROM Songs WHERE SongId='$sid'");

	if($res) {

		$data = mysqli_fetch_array($res);

	}

	return $data;

}



function get_user_email($uid) {

        global $conn;

        $data = mysqli_fetch_array(mysqli_query($conn, "SELECT Email FROM Application WHERE UserId='$uid'"));

        $stremail = $data[Email];

        return $stremail;

}



function mydate($format, $publictime)

{

       $sec = substr($publictime, 12, 2);

       $min = substr($publictime, 10, 2);

       $hour = substr($publictime, 8, 2);

       $day = substr($publictime, 6, 2);

       $month = substr($publictime, 4, 2);

       $year = substr($publictime, 0, 4);

       return date($format, mktime($hour, $min, $sec, $month, $day, $year));

}



function get_user_name($uid) {

        global $conn;

        $data = mysqli_fetch_array(mysqli_query($conn, "SELECT Username FROM Users WHERE UserId='$uid'"));
        
        $strUsername = $data[Username];

        return $strUsername;

}

function dl_file($file){



   //First, see if the file exists

   if (!is_file($file)) { die("<b>404 File not found!</b>"); }

	   

   //Gather relevent info about file

   $len = filesize($file);

   echo $filename = basename($file);

   $file_extension = strtolower(substr(strrchr($filename,"."),1));



  

 $fp = fopen($file, 'r');

   //Begin writing headers

   header("Pragma: public");

   header("Expires: 0");

   header("Cache-Control: must-revalidate, post-check=0, pre-check=0");

   header("Cache-Control: public"); 

   header("Content-Description: File Transfer");

   

   //Use the switch-generated Content-Type

   header("Content-Type: application/force-download");



   //Force the download

   $header="Content-Disposition: attachment; filename=".$filename.";";

   header($header );

   header("Content-Transfer-Encoding: binary");

   header("Content-Length: ".$len);

	 fpassthru($fp);

	 fclose($fp);}



?>