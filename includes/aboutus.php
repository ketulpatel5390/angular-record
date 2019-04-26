<?
require_once("path.php");
require_once("mainfile.php");

	// TRACK WATCH
	$bannerback = array("contact.png","fanbase.png","FAQS.png","partners.png","singerwithspecs.png");
	$result = mysqli_query($conn, "SELECT * FROM `pickhits` ORDER BY `pickhitid` DESC LIMIT 0 , 3");
	
	if(!$result)
		echo mysqli_error($conn);
	 $i = 0;
	 while($row = mysqli_fetch_array($result))
	 {
	 	 $photo[$i] = $row['artistphoto'];	
	 	$artist[$i] = $row['artistname'];	
	 	$genre[$i] = $row['Genre'];	
	 	$url[$i] = $row['Website'];	
	 	$i++;
	 }	

	// KEEP TRACK
	
	$keepresult = mysqli_query($conn, "select * from keeptrack ORDER BY trackid DESC LIMIT 0 , 1");
	
	if(!$keepresult)
		echo mysqli_error($conn);
	$keeprow = mysqli_fetch_array($keepresult);
	
	 	$keepphoto =  $keeprow['artistphoto'];	
	 	$keeptitle =  $keeprow['title'];	
	 	 $keepdetail = $keeprow['detail'];	
	 	 $keepid = $keeprow['trackid'];	


?>

<script language="javascript">
	function submitform()
	{
			 document.frmindex.action = 'loginaction.php';
			 document.frmindex.submit();
	}
	function submitform1()
	{
		var frmobj = document.frmindex1;
		var valid = true;
		var msg = '';

		if(frmobj.signupmail.value == '')
		{
			msg += "Please enter email address \n";
			objname = frmobj.signupmail;
			valid = false;
		}
		else if(!checkEmail(frmobj.signupmail.value))
		{
			msg += "Please enter a valid email address \n";
			objname = frmobj.signupmail;
			valid = false;
		}	

			if(valid == false)
			{	
				alert(msg);
				objname.focus();
				return false;
			}
			else
			{
				 document.frmindex1.action = 'subscribe.php';
				 document.frmindex1.submit();
			}
	}	
	function checkEmail(emailStr) {


		
       if (emailStr.length == 0) {
           return true;
       }
       var emailPat=/^(.+)@(.+)$/;
       var specialChars="\\(\\)<>@,;:\\\\\\\"\\.\\[\\]";
       var validChars="\[^\\s" + specialChars + "\]";
       var quotedUser="(\"[^\"]*\")";
       var ipDomainPat=/^(\d{1,3})[.](\d{1,3})[.](\d{1,3})[.](\d{1,3})$/;
       var atom=validChars + '+';
       var word="(" + atom + "|" + quotedUser + ")";
       var userPat=new RegExp("^" + word + "(\\." + word + ")*$");
       var domainPat=new RegExp("^" + atom + "(\\." + atom + ")*$");
       var matchArray=emailStr.match(emailPat);
       if (matchArray == null) {
           return false;
       }
       var user=matchArray[1];
       var domain=matchArray[2];
       if (user.match(userPat) == null) {
           return false;
       }
       var IPArray = domain.match(ipDomainPat);
       if (IPArray != null) {
           for (var i = 1; i <= 4; i++) {
              if (IPArray[i] > 255) {
                 return false;
              }
           }
           return true;
       }
       var domainArray=domain.match(domainPat);
       if (domainArray == null) {
           return false;
       }
       var atomPat=new RegExp(atom,"g");
       var domArr=domain.match(atomPat);
       var len=domArr.length;
       if ((domArr[domArr.length-1].length < 2) ||
           (domArr[domArr.length-1].length > 3)) {
           return false;
       }
       if (len < 2) {
           return false;
       }
       return true;
    }


</script>
<style type="text/css">

#pscroller1{
	width: 187px;
	height: 190px;
	padding: 5px;
}
.newsheader
{
font-family:Arial, Helvetica, sans-serif;
color:#FFFF00;
font-weight:bold;
font-size:10px;
}
.newstext
{
font-family:Arial, Helvetica, sans-serif;
color:#FFFFFF;
font-weight:normal;
font-size:10px;
}
#news {

	position: absolute;
	visibility: visible;
	top: 20px;
	left: 650px;
	height: 40px;
	width: 150px;
	z-index: 10;
	clip: rect(0px, 100px, 60px, 0px);
	border-width: 0px;
	padding-top: 40px;

}
.style35 {font-size: 15px}
</style>
<? include("userheader.php"); ?>
 <!--end of layout id-->
 <tr>        
		<td valign="top" align="left" class="inside_header01_bottom" height="422">        
        <div align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td valign="top" align="left" height="100">
                <div align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="99%">
                    <tr>
                      <td valign="middle" align="center"></td>
                      <td valign="middle" align="center" height="22"></td>
                    </tr>
                    <tr>
                      <td valign="middle" align="center"></td>
                      <td valign="middle" align="center">
                        <div align="right">
                          <table border="0" cellpadding="0" cellspacing="0" width="511">
                            <tr>
                              <td valign="middle" align="left" class="menu-top-bkg" height="43">        
                    <div align="center">  
                      <center>  
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">  
                        <tr>  
                          <td valign="middle" align="center" width="167" class="tophead"><a href="index.php" class="toplink"><span class="toplink ">SHARE MUSIC<br>   
                                <span class="style35">MUSIC PRO</span></span></a></td>   
                          <td valign="middle" align="center" width="167" class="tophead"> <a href="fanbaseinfo.php" class="toplink">GET MUSIC<br>  
                              <span class="style35">FANBASE</span></a></td>  
                          <td valign="middle" align="center" width="167" class="tophead"><a href="miainfo.php" class="toplink">DO BUSINESS<br>  
                              <span class="style35">MUSIC INDUSTRY</span></a></td>   
                        </tr>   
                      </table>   
                      </center>   
                    </div>   
                              </td>
                            </tr>
                            <tr>
                              <td valign="top" align="left"></td>
                            </tr>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td valign="middle" align="center"></td>
                      <td valign="middle" align="center"></td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td valign="top" align="left" height="322">       
                    <div align="right">  
                      <table border="0" cellpadding="0" cellspacing="0" width="45%">  
                        <tr>  
                          <td valign="top" align="left" height="50"></td>  
                        </tr> 
						<?
			  	$query1 = "select * from pages where page_id=5";
	$result1 = mysqli_query($conn, $query1);
	$row1 = mysqli_fetch_array($result1);
			  ?>           
                        <tr>  
                          <td valign="top" align="left" class="topright_text" style="line-height: 165%"><? echo stripslashes($row1['description']);?></td>    
                        </tr>    
                      </table>    
                    </div></td> 
            </tr> 
          </table> 
        </div> 
        </td>          
	</tr>
    <tr>          
		<td valign="top" align="left" class="body_bkg">          
            <div align="center">        
              <table border="0" cellpadding="0" cellspacing="0" width="100%">        
                <tr>        
                  <td valign="top" align="center" width="295" height="35"></td>        
                  <td valign="top" align="left" height="35"></td>        
                </tr>        
                <tr>        
                  <td valign="top" align="center" width="295">        
                    <div align="center">        
                      <table border="0" cellpadding="0" cellspacing="0" width="261">        
                        <tr>        
                          <td width="100%" valign="top" align="left"><img border="0" src="images/left_tab1_top.jpg" alt=""></td>        
                        </tr>        
                        <tr>        
                          <td width="100%" valign="top" align="left" class="left_bkg">        
                            <div align="center">        
                              <table border="0" cellpadding="0" cellspacing="0" width="96%">        
                                <tr>        
                                  <td width="100%" valign="middle" align="center" class="body_head">NewsLetter</td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="left">        
                                   <form name="frmindex1" method="post" action="subscribe.php">	 
                                        <?
				if($_REQUEST['subscribed'] == '0')
					{
						$scribe =  "Email Address Already Subscribed";
						$stylesub="color:#FF0000;";
					}
				elseif($_REQUEST['subscribed'] == '1')
					{
						$scribe =  "Email SuccessFully Subscribed";
						$stylesub="color:#FF0000;";
					}
				else
						$scribe = " Enter your E-mail ";
				?>      
                                    <div align="center">        
                                      <table border="0" cellpadding="0" cellspacing="0" width="100%">        
                                        <tr>        
                                          <td valign="top" align="center" height="10"></td>        
                                        </tr>        
                                        <tr>        
                                          <td valign="top" align="center"><input type="text"  name="signupmail" size="20" value="<?=$scribe;?>" onClick="this.value='';" class="inputbox2"></td>        
                                        </tr>        
                                        <tr>        
                                          <td valign="top" align="center" height="10"></td>        
                                        </tr>        
                                        <tr>        
                                          <td valign="top" align="center"><input type="submit" name="B1" class="sub" value=""></td>        
                                        </tr>        
                                      </table>        
                                    </div>        
                                              <input type="hidden" name="task" value="newsignup">
                                    </form>        
                               </td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="left" height="10"></td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="center"><img border="0" src="images/dot_bor.jpg" alt=""></td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="left" height="5"></td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="left" class="body_text" style="line-height: 135%"><div id="mi2news">
	
	
<script type="text/javascript">



/***********************************************

* Pausing updown message scroller- © Dynamic Drive DHTML code library (www.dynamicdrive.com)

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

	messages[<?= $m1; ?>] = new Array(2);

	messages[<?= $m1; ?>][0] = "<?= urldecode(stripslashes($data[Title])); ?>";

	messages[<?= $m1; ?>][1] = "<?= $data[Article]; ?>";

	content[<?= $m1; ?>] = "<font class=newsheader><?= urldecode(stripslashes($data[Title])); ?></font><br><font class=newstext ><?= $data[Article]; ?><br/></font>"

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
{
window.addEventListener("load", function(){scrollerinstance.initialize()}, false)
}
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

setTimeout(function(){scrollerinstance.animateup()}, 250)

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
	
	</div></td>        
                                </tr>        
                                <tr>        
                                  <td width="100%" valign="top" align="left"></td>        
                                </tr>        
                              </table>        
                            </div>        
                          </td>        
                        </tr>        
                        <tr>        
                          <td width="100%" valign="top" align="left"><img border="0" src="images/left_tab2_bot.jpg" alt=""></td>        
                        </tr>        
                        <tr>        
                          <td width="100%" valign="top" align="left"></td>        
                        </tr>        
                      </table>        
                    </div>        
                  </td>        
                  <td valign="top" align="left">        
                    <div align="left">        
                      <table border="0" cellpadding="0" cellspacing="0" width="614">          
                        <tr>          
                          <td valign="top" align="left"><img border="0" src="images/white_top_bkg.jpg" alt=""></td>          
                        </tr>          
                        <tr>          
                          <td valign="top" align="left" class="white_bottom_bkg"> 
						  <?
			  	$query = "select * from pages where page_id=1";
	$result = mysqli_query($conn, $query);
	$row = mysqli_fetch_array($result);
			  ?>            
                            <div align="center">        
                              <table border="0" cellpadding="0" cellspacing="0" width="94%">        
                                <tr>        
                                  <td valign="top" align="left"></td>        
                                </tr>        
                                <tr>        
                                  <td valign="top" align="left" class="body_text2"><? echo $row['name'];?></td>        
                                </tr>        
                                <tr>        
                                  <td valign="top" align="left">&nbsp;</td>      
                                </tr>      
                                <tr>       
                                  <td valign="top" align="left" class="body_text12" style="line-height: 145%" height="200"><? echo stripcslashes($row['description']);?>
                                  </td>         
                                </tr>         
                                <tr>          
                                  <td valign="top" align="left"></td>         
                                </tr>         
                              </table>         
                            </div>         
                          </td>        
                        </tr>        
                      </table>         
                    </div>         
                  </td>         
                </tr>         
              </table>         
            </div>         
        </td>          
	</tr>

<? include("userfooter.php"); ?>

</body>
</html>
