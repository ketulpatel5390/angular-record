<?

require_once("functions.inc");



?>

<HTML>

<HEAD>

<TITLE>index</TITLE>

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



<link type="text/css" rel="stylesheet" href="/style/style.css">

<style type="text/css">

#pscroller1{

width: 160px;

height: 500px;

padding: 5px;



}

</style></HEAD>

<BODY LEFTMARGIN=0 TOPMARGIN=0 MARGINWIDTH=0 MARGINHEIGHT=0 onLoad="MM_preloadImages('/images/rollhome_03.jpg','/images/roll_aboutsus.jpg','/images/roll_testimonials.jpg','/images/roll_pricing.jpg','/images/roll_articles.jpg','/images/roll_helpdesk.jpg')" bgcolor="#000033">

<div align="center">

  <table width="768" border="0" cellspacing="0" cellpadding="0">

    <tr>

      <th scope="col"><div align="left">

        <!-- ImageReady Slices (final.psd) -->

	 <TABLE WIDTH=768 BORDER=0 CELLPADDING=0 CELLSPACING=0>

          <TR>

            <TD ROWSPAN=3 valign="top"><IMG SRC="/images/logo.jpg" WIDTH=313 HEIGHT=93 ALT=""></TD>

	<? 

	

	if($_GET['f'] == 'login'  && ($errvar != 1))

	{

	?>

            <TD COLSPAN=11><IMG SRC="/images/logout.jpg" ALT="logout" WIDTH=455 HEIGHT=54 border="0" usemap="#Map2" href="logout.php"></TD>

	<?

	}

	else if(!$_SESSION[logged] || strstr($REQUEST_URI,'/logout.php')) 

	{



	 ?>

            <TD COLSPAN=11><img src="/images/login_02.jpg" alt="login" width=455 height=54 border="0" usemap="#Map" href="sign.htm"></TD>



  

	<?

	 }

	 else 

	  { 

	  ?>



            <TD COLSPAN=11><IMG SRC="/images/logout.jpg" ALT="logout" WIDTH=455 HEIGHT=54 border="0" usemap="#Map2" href="logout.php"></TD>



	<?

	 }	

	 ?>

          </TR>

          <TR>
				<TD ROWSPAN=2>
			<IMG SRC="/images/head_03.jpg" WIDTH=16 HEIGHT=38 ALT=""></TD>
			
			<TD><a href="http://www.trakheadz.com/index.php" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('Image30','','/images/rollhome_03.jpg',1)"><img src="/images/home.jpg" name="Image30" width="56" height="20" border="0"></a></TD>
		<TD>
			<IMG SRC="/images/head_05.jpg" WIDTH=18 HEIGHT=20 ALT=""></TD>
			
			<TD><a href="http://www.trakheadz.com/aboutus.php" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('Image31','','/images/roll_aboutsus.jpg',1)"><img src="/images/aboutus.jpg" name="Image31" width="76" height="20" border="0"></a></TD>
		<TD>
			<IMG SRC="/images/head_05.jpg" WIDTH=18 HEIGHT=20 ALT=""></TD>
		<TD><a href="http://www.trakheadz.com/articles.php" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('Image32','','/images/roll_articles.jpg',1)"><img src="/images/articles.jpg" name="Image32" width="73" height="20" border="0"></a></TD>
		<TD>
			<IMG SRC="/images/head_07.jpg" WIDTH=18 HEIGHT=20 ALT=""></TD>
		   
         	<TD><a href="http://www.trakheadz.com/pricing.php" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('Image34','','/images/roll_pricing.jpg',1)"><img src="/images/pricing.jpg" name="Image34" width="62" height="20" border="0"></a></TD>
		<TD>
			<IMG SRC="/images/head_11.jpg" WIDTH=18 HEIGHT=20 ALT=""></TD>
           
		<TD>
		<script src="http://customersupportnetwork.com/tis/ping/launch_support.php?link_code=7c95f88c90b08f37e629668afbc1e314"></script>
		<a href="#"  onClick="javascript:open_cslive_window('7c95f88c90b08f37e629668afbc1e314'); return false;" onMouseOut="MM_swapImgRestore()" onMouseOver="MM_swapImage('Image35','','/images/roll_helpdesk.jpg',1)"><img src="/images/head_12.jpg" name="Image35" width="85" height="20" border="0"></a>
		<script src="http://customersupportnetwork.com/tis/ping/visitor_tracker.php?link_code=7c95f88c90b08f37e629668afbc1e314&page=ENTER_WEB_PAGE_NAME_HERE&visitor=ENTER_VISITOR_INFO_HERE&var_1=ENTER_CUSTOM_VARIABLE_HERE&var_2=&var_3=&var_4=&var_5=&var_6=&var_7=&var_8=&var_9="></script>			

		</TD>
		   
		<TD>
			<IMG SRC="/images/head_13.jpg" WIDTH=15 HEIGHT=20 ALT=""></TD>

          </TR>

         <TR>
		<TD COLSPAN=10>
			<IMG SRC="/images/head_14.jpg" WIDTH=439 HEIGHT=18 ALT=""></TD>
	</TR>
	
	          <TR bgcolor="#333333">

            <TD COLSPAN=12><img src="/images/trakheadzmusik1.jpg" width="768" height="117" alt=""></TD>

          </TR>
		  
		   <TR>

            <TD width="186"><IMG SRC="/images/spacer.gif" WIDTH=313 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=16 HEIGHT=1 ALT=""></TD>
			
			 <TD><IMG SRC="/images/spacer.gif" WIDTH=56 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=18 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=76 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=18 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=73 HEIGHT=1 ALT=""></TD>

            <TD><IMG SRC="/images/spacer.gif" WIDTH=18 HEIGHT=1 ALT=""></TD>

           

            <TD><IMG SRC="/images/spacer.gif" WIDTH=62 HEIGHT=1 ALT=""></TD>
			
			 <TD><IMG SRC="/images/spacer.gif" WIDTH=18 HEIGHT=1 ALT=""></TD>
			 
            <TD><IMG SRC="/images/spacer.gif" WIDTH=85 HEIGHT=1 ALT=""></TD>	
			
			<TD><IMG SRC="/images/spacer.gif" WIDTH=15 HEIGHT=1 ALT=""></TD>						
			
						          </TR>
        </TABLE>

        <!-- End ImageReady Slices -->

  </div></th>

    </tr>

    <tr>

      <td valign="top" bgcolor="#666666"><table width="767" border="0" cellpadding="0" cellspacing="0">

        <tr>

          <th valign="top" bgcolor="#6ACAFD" scope="col"><div align="left">

			

			<table border="1" cellpadding="0" cellspacing="1" width="100%">

			<!--<TR>
		      <TD width="100%" height=30 align="center" valign="middle" background="/images/index_17.jpg"><A class=menulink 
                        href="http://trakheadz.com/charts1.php" 
        	             target=_top alt="construction industry news"><font class="style6"> Top 20 Charts </font> </A></TD>
    </TR>-->
			
			<TR>
      <TD width="100%" height=30 align="center" background="/images/index_17.jpg"><A class=menulink 
                        href="http://www.trakheadz.com/partners.php" target=_top 
                        alt="partners"><font class="style6">Partners</font></A></TD>
    </TR>
	 <TR>
      <TD width="100%" height=30 align="center" background="/images/index_17.jpg"><A class=menulink 
                        href="http://www.trakheadz.com/listdjorgs.php" 
                        target=_top 
                    alt="construction resources"><font class="style6">Music Access Members </font></A></TD>
    </TR>
			
      <tr valign="top" bordercolor="#E4F0F8"><td width="100%"><table widht="100%" align="center">
	 <tr> <th background="/images/index_17.jpg"><font class="style6">Headz Up News</font></th></tr>

					  <tr>

					  

<?

			$res = mysqli_query($conn, "SELECT * FROM News ORDER BY ArticleDate desc limit 5");

//			$data = mysqli_fetch_array($res);

			

?>

                        <th valign="top" scope="col" > <div id='name1'>

<script type="text/javascript">



/***********************************************

* Pausing updown message scroller- � Dynamic Drive DHTML code library (www.dynamicdrive.com)

* This notice MUST stay intact for legal use

* Visit Dynamic Drive at http://www.dynamicdrive.com/ for full source code

***********************************************/



//configure the below five variables to change the style of the scroller

var scrollerdelay='5000' //delay between msg scrolls. 3000=3 seconds.

var scrollerwidth='160px'

var scrollerheight='310px'

var scrollerbgcolor=''

//set below to '' if you don't wish to use a background image

var scrollerbackground=''

var scrolling = false 







var messages=new Array()

var content=new Array()

<?
$res = mysqli_query($conn, "SELECT * FROM News ORDER BY ArticleDate desc limit 5") ;

for($m1=0; $data = mysqli_fetch_array($res); $m1++) {
?>

	messages[<?= $m1; ?>] = new Array(2)

	messages[<?= $m1; ?>][0] = "<?= $data[Title]; ?>"

	messages[<?= $m1; ?>][1] = "<?= $data[Article]; ?>"

	content[<?= $m1; ?>] = "<font class=newsheader><?= $data[Title]; ?>" + "</font><br><br><font class=newstext >" + "<?= $data[Article]; ?></font>"

<?

}

?>

var ie=document.all

var dom=document.getElementById





function pausescroller(content, divId, divClass, delay){

this.content=content //message array content

this.tickerid=divId //ID of ticker div to display information

this.delay=delay //Delay between msg change, in miliseconds.

this.mouseoverBol=0 //Boolean to indicate whether mouse is currently over scroller (and pause it if it is)

this.hiddendivpointer=1 //index of message array for hidden div



document.write('<div align="left" id="'+divId+'" class="'+divClass+'" style="position: relative; overflow: hidden"><div align=left class="innerDiv" style="position: absolute; width: 100%" id="'+divId+'1">'+content[0]+'</div><div class="innerDiv" style="position: absolute; width: 100%; visibility: hidden" id="'+divId+'2">'+content[1]+'</div></div>')

var scrollerinstance=this

if (window.addEventListener) //run onload in DOM2 browsers

window.addEventListener("load", function(){scrollerinstance.initialize()}, false)

else if (window.attachEvent) //run onload in IE5.5+

window.attachEvent("onload", function(){scrollerinstance.initialize()})

else if (document.getElementById) //if legacy DOM browsers, just start scroller after 0.5 sec

setTimeout(function(){scrollerinstance.initialize()}, 500)

}





pausescroller.prototype.initialize=function(){

this.tickerdiv=document.getElementById(this.tickerid)

this.visiblediv=document.getElementById(this.tickerid+"1")

this.hiddendiv=document.getElementById(this.tickerid+"2")

this.visibledivtop=parseInt(pausescroller.getCSSpadding(this.tickerdiv))

//set width of inner DIVs to outer DIV's width minus padding (padding assumed to be top padding x 2)

this.visiblediv.style.width=this.hiddendiv.style.width=this.tickerdiv.offsetWidth-(this.visibledivtop*2)+"px"

this.getinline(this.visiblediv, this.hiddendiv)

this.hiddendiv.style.visibility="visible"

var scrollerinstance=this

document.getElementById(this.tickerid).onmouseover=function(){scrollerinstance.mouseoverBol=1}

document.getElementById(this.tickerid).onmouseout=function(){scrollerinstance.mouseoverBol=0}

if (window.attachEvent) //Clean up loose references in IE

window.attachEvent("onunload", function(){scrollerinstance.tickerdiv.onmouseover=scrollerinstance.tickerdiv.onmouseout=null})

setTimeout(function(){scrollerinstance.animateup()}, this.delay)

}





// -------------------------------------------------------------------

// animateup()- Move the two inner divs of the scroller up and in sync

// -------------------------------------------------------------------



pausescroller.prototype.animateup=function(){

var scrollerinstance=this

if (parseInt(this.hiddendiv.style.top)>(this.visibledivtop+5)){

this.visiblediv.style.top=parseInt(this.visiblediv.style.top)-5+"px"

this.hiddendiv.style.top=parseInt(this.hiddendiv.style.top)-5+"px"

setTimeout(function(){scrollerinstance.animateup()}, 50)

}

else{

this.getinline(this.hiddendiv, this.visiblediv)

this.swapdivs()

setTimeout(function(){scrollerinstance.setmessage()}, this.delay)

}

}



// -------------------------------------------------------------------

// swapdivs()- Swap between which is the visible and which is the hidden div

// -------------------------------------------------------------------



pausescroller.prototype.swapdivs=function(){

var tempcontainer=this.visiblediv

this.visiblediv=this.hiddendiv

this.hiddendiv=tempcontainer

}



pausescroller.prototype.getinline=function(div1, div2){

div1.style.top=this.visibledivtop+"px"

div2.style.top=Math.max(div1.parentNode.offsetHeight, div1.offsetHeight)+"px"

}



// -------------------------------------------------------------------

// setmessage()- Populate the hidden div with the next message before it's visible

// -------------------------------------------------------------------



pausescroller.prototype.setmessage=function(){

var scrollerinstance=this

if (this.mouseoverBol==1) //if mouse is currently over scoller, do nothing (pause it)

setTimeout(function(){scrollerinstance.setmessage()}, 100)

else{

var i=this.hiddendivpointer

var ceiling=this.content.length

this.hiddendivpointer=(i+1>ceiling-1)? 0 : i+1

this.hiddendiv.innerHTML=this.content[this.hiddendivpointer]

this.animateup()

}

}



pausescroller.getCSSpadding=function(tickerobj){ //get CSS padding value, if any

if (tickerobj.currentStyle)

return tickerobj.currentStyle["paddingTop"]

else if (window.getComputedStyle) //if DOM2

return window.getComputedStyle(tickerobj, "").getPropertyValue("padding-top")

else

return 0

}



new pausescroller(content, "pscroller1", "", 3000)



</script>

<!-----

<div align="left"><FONT color=black><span class="style3"><?= $data[Title]; ?></span><br>

                                  <br>

                                  <span class="style5"><?= $data[Article]; ?> </span><br>

                            </FONT> <br>

                            <span class="style9"> </span></div>

--->

			</div></th>

			</tr>

			</table>

			</td>

                      </tr>

					   </table>

			

			</div></th>

			 

			 

			 

          <th width="580" rowspan="2" valign="top" bordercolor="#999999" bgcolor="#DEE3F8" scope="col">

<!-- End header -->







































