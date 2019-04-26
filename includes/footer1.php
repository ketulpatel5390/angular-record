
<!-- Begin Footer -->
              <br>
              <span class="style3"><br>
              <br>
            </span></th>
          <th width="10" rowspan="2" valign="top" bordercolor="#999999" bgcolor="#DCEAF5" scope="col">&nbsp;</th>
        </tr>
        <tr>
          <th height="58" valign="top" bgcolor="#6ACAFD" scope="col"><br>
              <IMG SRC="/images/index_20.jpg" WIDTH=186 HEIGHT=25 ALT=""></th>
        </tr>
      </table></td>
    </tr>
   	 <tr>
      <td align="center" background="/images/index_21.jpg"><div align="center" class="style6"><a href="http://www.trakheadz.com/faq.php"><font class="style6">FAQ</font></a>&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;<a href="http://www.trakheadz.com/useragreement.php" ><font class="style6">User Agreement</font></a>&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;<a href="http://www.trakheadz.com/contact.php"><font class="style6">Contact</font></a>&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;<script src="http://customersupportnetwork.com/tis/ping/launch_support.php?link_code=7c95f88c90b08f37e629668afbc1e314"></script><a href="#"  onClick="javascript:open_cslive_window('7c95f88c90b08f37e629668afbc1e314'); return false;"><font class="style6">Help Desk</font></a>
		<script src="http://customersupportnetwork.com/tis/ping/visitor_tracker.php?link_code=7c95f88c90b08f37e629668afbc1e314&page=ENTER_WEB_PAGE_NAME_HERE&visitor=ENTER_VISITOR_INFO_HERE&var_1=ENTER_CUSTOM_VARIABLE_HERE&var_2=&var_3=&var_4=&var_5=&var_6=&var_7=&var_8=&var_9="></script></div></td>
    </tr>
  </table>
  <? 

  if(!$_SESSION[logged])
  	$link = "login.php";
  else
  	$link = "logout.php";

   ?>
  <map name="Map">
     <area shape="rect" coords="381,3,430,20" href="<? if(strstr($_SERVER['REQUEST_URI'],'/admin')) echo "http://www.trakheadz.com/admin/login.php"; else	echo "http://www.trakheadz.com/login.php";	 ?>" alt="login">
  </map>
  <map name="Map2">
    <area shape="rect" coords="368,3,420,20" href="<?  if(strstr($_SERVER['REQUEST_URI'],'/admin')) echo "http://www.trakheadz.com/admin/logout.php";	else echo "http://www.trakheadz.com/logout.php"; ?>" alt="logout">
  </map>
</div>
</BODY>
</HTML>

