<?php
	ini_set('display_errors', 'on');
	
	
	session_start();

	class ApiResults {
		function __construct($status, $data = null, $error = null)
		{
			$this->status = $status;
			$this->data = $data;
			$this->error = $error;
		}

		public $status;
		public $data;
		public $error;
	}

	require_once 'functions.php'; 
	// Requests from the same server don't have a HTTP_ORIGIN header
	if (!array_key_exists('HTTP_ORIGIN', $_SERVER)) {
	    $_SERVER['HTTP_ORIGIN'] = $_SERVER['SERVER_NAME'];
	}	
	//Send headers
	//echo $_SERVER['SERVER_NAME'];
	 $origin = $_SERVER['HTTP_ORIGIN'];
	
	//header("Access-Control-Allow-Origin: $origin");
	header("Access-Control-Allow-Credentials: true");
	header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS");
	$requestHeaders = $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'];
	if ($requestHeaders) header("Access-Control-Allow-Headers: $requestHeaders");
	header("Content-Type: application/json");
	header("Cache-Control: no-cache");

	if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS'){
		header("HTTP/1.1 200 Ok");
		exit;
	}
	
	try {
		$routes = [
			"admin" => (object)[
				'controller'=>null,
				'guard'=> 'checkAdminAuthorization'
			],
			"applications" => (object)[
				'controller'=>null,
				'guard'=> 'checkAuthorization'
			],
			"register" => null,
			"songs" => (object)[
				'controller'=>null,
				'guard'=> 'checkAuthorization'
			]
		];
		 $route = $_REQUEST['r'];
		//insertLog('API', substr($route, 0, 250), Categories::Diagnostic, getUserId(false));
		$args = explode('/', rtrim($route, '/'));
		     $controller = array_shift($args);
		    
		if (array_key_exists($controller, $routes)){
			if (!is_object($routes[$controller])){
				
				  $controller = $routes[$controller] ? $controller : $controller.'Controller';

			}
			else{
				 $routeDef = $routes[$controller];
				
				if ($routeDef->guard) 
					$allowAccess = call_user_func($routeDef->guard);
				else
					$allowAccess = true;

				
				if (!$allowAccess){
					header("HTTP/1.1 403 Forbidden");
					exit;
				}		
				  	
				   $controller = $routeDef->controller ? $controller : $controller.'Controller';
				  
			}
			 $route = implode('/', $args);
			
			
			require_once 'controllers/' . $controller . '.php';
		}
		else
			throw new Exception("$route is not a known route");

	     $API = new $controller($route, $_SERVER['HTTP_ORIGIN']);

	    echo $API->processAPI();
	   
	} catch (Exception $e) {
		 $httpStatusCode = $e->getCode();

		if ($httpStatusCode < 400 || $httpStatusCode > 500) 
		{
			$httpStatusCode = 500;
			$httpStatusMessage = "Internal Server Error";
		}
		else{
			$httpStatusMessage = $e->getMessage();
		}
	    //header("HTTP/1.1 $httpStatusCode $httpStatusMessage");
	    header("HTTP/1.1 $httpStatusMessage");
		$jsonError = json_encode([
			'error' => $e->getMessage(),
			'trace' => $e->getTrace()
		]);
		echo $jsonError;

		//insertLog('API', substr($httpStatusMessage, 0, 250), Categories::Error, getUserId(false), $jsonError);
	}