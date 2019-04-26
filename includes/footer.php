
<!-- Begin Footer -->
              <br>
              <span class="style3"><br>
              <br>
            </span></th>
          
        </tr>
        <!--<tr>
          <th height="58" valign="top" bgcolor="#6ACAFD" scope="col"><br>
              
			  <div align="center" class="style6"><a href="http://www.trakheadz.com/press.php"><font class="style6">FAQ</font></a>&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;<a href="http://www.trakheadz.com/useragreement.php" ><font class="style6">User Agreement</font></a>&nbsp;&nbsp;&nbsp;:&nbsp;&nbsp;&nbsp;<a href="http://www.trakheadz.com/contact.php"><font class="style6">Contact</font></a></div>
			  </th>
        </tr>-->
      </table></td>
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

