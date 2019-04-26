<?
//***********************************************************************************//
//** Please leave this message alone, no one will be able to see it, except coders.**//
// This script is copyrighted by PHP scripts, a Marsal Design Company.***************//
// To get your own verison of this system, please do download it from our site*******//
// located at http://www.free-php-scripts.net****************************************//
// Script is free, no advertisement, no nothing....**********************************//
//***********************************************************************************//

//define ('DB_USER', 'trakhe5');   // Database User Name
//define ('DB_PASSWORD', 'sufunky1');    // Database User Password
//define ('DB_HOST', 'localhost');   // Host Name (mostly localhost)
//define ('DB_NAME', 'trakhe5_trakheadz');   // Host Name (mostly localhost)
define ('IS_SONGBOOK', 0);
define ('SONGBOOK_PKGID', 110);
define ('UNDER_CONSTRUCTION', 0);
if (IS_SONGBOOK == 1) {
  define ('SITE_TITLE', 'Songbook.life');
  define('DO_NOT_REPLY_EMAIL', 'support@recorddrop.com');
  define ('EMAIL_DOMAIN', 'songbook.life');
}
else {
  define ('SITE_TITLE', 'Record Drop');
  define('DO_NOT_REPLY_EMAIL', 'support@recorddrop.com');
  define ('EMAIL_DOMAIN', 'recorddrop.com');
}
define ('KEY', 'klksdj03jlksd3nlka02k95n85bb73bjkaaljmcaikd129750nfks');
define ('ROW_VERSION', 1);

if($_SERVER['HTTP_HOST']=='192.168.1.1:8080')
{
define ('DB_USER', 'webmyne');   // Database User Name
define ('DB_PASSWORD', 'webmyne');    // Database User Password
define ('DB_HOST', 'localhost');   // Host Name (mostly localhost)
define ('DB_NAME', 'newth');   // Host Name (mostly localhost)	
}
elseif ($_SERVER['HTTP_HOST'] == 'localhost')
{
define ('DB_USER', 'trakhe5');   // Database User Name
define ('DB_PASSWORD', 'mactraker');    // Database User Password
define ('DB_HOST', 'localhost');   // Host Name (mostly localhost)
define ('DB_NAME', 'trakhe5');    // Host Name (mostly localhost)
}
else
{
define ('DB_USER', 'trakhe5_recorddrop');   // Database User Name
define ('DB_PASSWORD','qngTYJfs%JNf');    // Database User Password
define ('DB_HOST', 'localhost');   // Host Name (mostly localhost)
define ('DB_NAME', 'trakhe5_recorddropuat');    // Host Name (mostly localhost)
}


abstract class Categories 
{
  const Diagnostic = 1;
  const Information = 2;
  const Warning = 3;
  const Error = 4;
  const Critical = 5;
}

ini_set("display_errors","Off");
?>