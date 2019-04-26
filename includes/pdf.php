<?php
	//ini_set("display_errors","On"); //---- SET DEBUG MODE ON
	define("FPDF_FONTPATH", "../font/");					//-- Defining 'font' directory path.
	require_once("../include/fpdf.php");					//-- Calling 'fpdf' class for pdf file functionality.

	class PDF extends FPDF
	{
		function setBody($sql)
		{
			require_once("../include/connect.php");
			$RS = mysqli_query($conn, $sql);
			$myflag = true;
			while ($row = mysqli_fetch_object($RS))
			{
				// print header
				if ($myflag == true)
				{	
					$this->SetFont('Arial','B',8);		
					while (list($key,$value) = each($row))
					{
						$tempKey = $key;
						$tempKey = strtoupper($tempKey);
						$tempKey = str_replace('_',' ',$tempKey);
						$this->Cell( 1.3, 0.375, $tempKey, 1, 0, 'L');
					}					
					$this->Ln();					
					$myflag = false;
				}
				reset($row);
				// print body				
				while (list($key,$value) = each($row))
				{
					$this->SetFont('Arial','',8);
					$this->Cell( 1.3, 0.175, substr($value,0,19), 1, 0, 'L');					
				}
				$this->Ln(0.175);
			}
			mysqli_close($link); 
		}	
		
		
		function setHeader($myheader)
		{
			parent::Header($myheader);
		}
		
		function setFooter($myfooter)
		{
			parent::Footer($myfooter);
		}
		
	}

?>