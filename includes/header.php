<?

require_once("functions.inc");



?>

<HTML>
<HEAD>

<TITLE>index</TITLE>
<link href="../Act/runtime/styles/xp/aw.css" rel="stylesheet" type="text/css" ></link>
	<script src="../Act/runtime/lib/aw.js"></script>
<script language="javascript" type="text/javascript" src="../CalendarPopup.js">

<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-8859-1">

<script language="JavaScript" type="text/JavaScript">

<!--

function MM_swapImgRestore() { //v3.0

  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;

}



function MM_preloadImages() { //v3.0

  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();

    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)

    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}

}



function MM_findObj(n, d) { //v4.01

  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {

    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}

  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];

  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);

  if(!x && d.getElementById) x=d.getElementById(n); return x;

}



function MM_swapImage() { //v3.0

  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)

   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}

}

//-->

</script>



<link type="text/css" rel="stylesheet" href="../style/style.css">

<style type="text/css">

#pscroller1{

width: 160px;

height: 500px;

padding: 5px;



}

</style></HEAD>

<BODY LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0 MARGINHEIGHT=0  bgcolor="#999999">

<div align="center">

  <table width="768" border="0" cellspacing="0" cellpadding="0">

    <tr>

      <th scope="col"><div align="left">

        <!-- ImageReady Slices (final.psd) -->

	 <TABLE WIDTH=768 BORDER=0 CELLPADDING=0 CELLSPACING=0>

          <TR>

            <TD valign="top" align="center"><IMG SRC="../images/<?=IS_SONGBOOK == 1 ? 'songbook.life%20336x123.png' : 'logo.jpg'?>" WIDTH=313 HEIGHT=93 ALT=""></TD>
			</TR>
			 <TR>
	<? 

	

	if($_GET['f'] == 'login'  && ($errvar != 1))

	{

	?>

            <TD align="right" class="footerlink"><a href="logout.php"><strong><font class="style6">LogOut</font></strong></a><br><br>
</TD>

	<?

	}
	 else if($_SESSION[logged]) 
	 {

	?>

            <TD align="right" class="footerlink"><a href="logout.php"><strong><font class="style6">LogOut</font></strong></a><br><br>
</TD>

	<?

	}
	else 
	{

	?>

            <TD align="right" class="footerlink">&nbsp;<br></TD>

	<?

	}
?>
	

	 

          </TR>


        
	
	          
		  
		   
        </TABLE>

        <!-- End ImageReady Slices -->

  </div></th>

    </tr>

    <tr>

      <td valign="top" bgcolor="#666666">
	  <table width="767" border="0" cellpadding="0" cellspacing="0">

        <tr>

         
			 

			 

			 

          <th width="580" valign="top" bordercolor="#999999" bgcolor="#DEE3F8" scope="col">

<!-- End header -->







































