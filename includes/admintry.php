<?php
require_once("../path.php");
require_once("mainfile.php");
require_once("secure.php");
require_once("admin_functions.php");

	

smtpmail('manish_nakum@hotmail.com','chirag@webmyne.com',"admin subject","this is admin side test");

exit;
include("footer.php");

ini_set("max_execution_time","3000");

$from = "Sandra Sender <mnakum@webmyne.com>";
$to = "Ramona Recipient <manish_nakum@hotmail.com>";
$subject = "Hi!";
$body = "Hi,\n\nHow are you?";

$host = "smarthost.yahoo.com";
$username = "nishant_smiles@yahoo.co.in";
$password = "friends";

$headers = array ('From' => $from,
  'To' => $to,
  'Subject' => $subject);
$smtp = Mail::factory('smtp',
  array ('host' => $host,
    'auth' => true,
    'username' => $username,
    'password' => $password));

$mail = $smtp->send($to, $headers, $body);

if (PEAR::isError($mail)) {
  echo("<p>" . $mail->getMessage() . "</p>");
 } else {
  echo("<p>Message successfully sent!</p>");
 }


/*require_once("path.php");
require_once("mainfile.php");


$from = "Sandra Sender <manish_nakum@yahoo.co.in>";
//$from = "Sandra Sender <mnakum@webmyne.com>";

$to = "manish_nakum@hotmail.com";
$subject = "Hi!";
$body = "Hi,\n\nHow are you?";


smtpmail($from,$to,$subject,$body);
exit;

$host = "mail.webmyne.com";
$username = "alok@webmyne.com";
$password = "alok123";


$headers = array ('From' => $from,
  'To' => $to,
  'Subject' => $subject);

$smtp = Mail::factory('smtp',
  array ('host' => $host,
    'auth' => true,
    'username' => $username,
    'password' => $password));


$mail = $smtp->send($to, $headers, $body);


if (PEAR::isError($mail)) {
  echo("<p>" . $mail->getMessage() . "</p>");
 } else {
  echo("<p>Message successfully sent!</p>");
 }
*/
?> 
