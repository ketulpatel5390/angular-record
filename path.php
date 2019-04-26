<?
 $_root_path = realpath( dirname(__FILE__).'' );
$separator = ":";
if( strtoupper(substr(PHP_OS, 0, 3)) === 'WIN' )
	$separator = ";";
	
	$include_path = '.';
$include_path .= $separator. $_root_path;
$include_path .= $separator. $_root_path.'/includes';
$include_path .= $separator. ini_get('include_path');

// save paths in ini file
ini_set('include_path', $include_path);
?>