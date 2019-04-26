<?
function showMusicIndustryForm($data)
{
	global $conn, $f;
?>

<div align="center">
	<p style="margin-top: 0; margin-bottom: 0"><font face="Verdana" size="2" color="slategray">Update Your Personal Information. </font></p>
	<p style="margin-top: 0; margin-bottom: 0"><font face="Verdana" size="2" color="slategray"><b>Please note that required fields are marked with an *</b></font></p>
</div>
<hr color="#BF440F">
<p style="margin-top: 0; margin-bottom: 0" align="justify">&nbsp;</p>
							
<form name="form2" method="post"  onsubmit="javascript:return frmvalidate();">
<input type="hidden" name="PkgType" value="<?=$data[PkgType]?>" />    

   <script language="javascript">
function changestate()
{
	if(document.form2.region_opt[0].checked)
	{
		document.form2.selstate.disabled = false;
		document.form2.state.disabled = true;
		document.form2.country.disabled = true;
	}
	if(document.form2.region_opt[1].checked)
	{
		document.form2.selstate.disabled = true;
		document.form2.state.disabled = false;
		document.form2.country.disabled = false;
	}

}
</script>    
 
<table width=548  cellpadding=2 cellspacing=0 align="center" class="tablecss" border="1" bordercolor="#BF440F">

<? 

	$music_rec_arr =  explode("|",$data['MusicServed']); 
?>
<? 
for($i=0 ; $i<count($music_rec_arr) ;$i++)
{
	if($music_rec_arr[$i] == "Alternative")
	  $a1 = 'SELECTED';
	
	if($music_rec_arr[$i] == "Blues")
	 $a2 = 'SELECTED';
	
	if($music_rec_arr[$i] == "Classical")
	 $a3 = 'SELECTED';
	
	if($music_rec_arr[$i] == "Country")
	 $a4 = 'SELECTED';
	
	if($music_rec_arr[$i] == "Easy Listening")
	 $a5 = 'SELECTED';

	if($music_rec_arr[$i] == "Electronica-Club Dance")
	 $a6 = 'SELECTED';

	if($music_rec_arr[$i] == "Folk")
	 $a7 = 'SELECTED';

	if($music_rec_arr[$i] == "Hip Hop/Rap")
	 $a8 = 'SELECTED';

	if($music_rec_arr[$i] == "Inspirational")
	 $a9 = 'SELECTED';
	
	if($music_rec_arr[$i] == "International -Island - Caribbean")
	 $a10 = 'SELECTED'; 
	 
	if($music_rec_arr[$i] == "Jazz")
	 $a11 = 'SELECTED';
 
 	if($music_rec_arr[$i] == "Latin")
	 $a12 = 'SELECTED';
	 
	if($music_rec_arr[$i] == "New Age")
	 $a13 = 'SELECTED';
	 
	if($music_rec_arr[$i] == "Pop")
	 $a14 = 'SELECTED'; 
	  
	 
	if($music_rec_arr[$i] == "R & B-Urban")
	 $a15 = 'SELECTED'; 
	 
	if($music_rec_arr[$i] == "Reggae")
	 $a16 = 'SELECTED';  
	 
	 
	if($music_rec_arr[$i] == "Rock")
	 $a17 = 'SELECTED';  
  
 

}
?>
        
	<?
	/*
	if($data['allow_mia_dj'] == 'B' ) $bothchecked = " checked ";
	else if($data['allow_mia_dj'] == 'D' || $data['allow_mia_dj'] == '') $djchecked = " checked ";
	else if($data['allow_mia_dj'] == 'M') $miachecked = " checked ";
	*/
	?>
<!--
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Create Mebmer: </font></span></td><td width="256">
<font face="Verdana" color="slategray">
		<input type="radio" <?=$bothchecked?> name="radmember"  value="B"> Both
		<input type="radio" <?=$djchecked?> name="radmember"  value="D"> DJ
		<input type="radio" <?=$miachecked?> name="radmember" value="M"> MIA
</font>
</td></tr>
-->

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Organization Name:</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='company' size="20" value="<?= $data[Company]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Organization Type:*</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<select name='profession'>
<option value=''>--Select Organization Type--</option>

<option <? if($data['Profession']=='DJ') echo 'SELECTED'; ?>>DJ </option>
<option  <? if($data['Profession']=='Radio') echo 'SELECTED'; ?> >Radio</option>
<option  <? if($data['Profession']=='TV') echo 'SELECTED'; ?>>TV</option>
<option  <? if($data['Profession']=='Music Production') echo 'SELECTED'; ?>>Music Production</option>
<option  <? if($data['Profession']=='Record Label') echo 'SELECTED'; ?>>Record Label</option>
<option  <? if($data['Profession']=='Music Publishin') echo 'SELECTED'; ?>>Music Publishing</option>
<option  <? if($data['Profession']=='Club') echo 'SELECTED'; ?>>Club</option>
<option  <? if($data['Profession']=='Weblog') echo 'SELECTED'; ?>>Weblog</option>
<option  <? if($data['Profession']=='Music Manger') echo 'SELECTED'; ?>>Music Manger</option>
<option  <? if($data['Profession']=='Agent') echo 'SELECTED'; ?>>Agent</option>
<option  <? if($data['Profession']=='A&R') echo 'SELECTED'; ?>>A&R</option>
<option  <? if($data['Profession']=='Trade Magazine') echo 'SELECTED'; ?>>Trade Magazine</option>
<option  <? if($data['Profession']=='Talent Scout') echo 'SELECTED'; ?>>Talent Scout</option>
<option  <? if($data['Profession']=='Other') echo 'SELECTED'; ?>>Other</option>

</select>
</font>
</td>
</tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Type of Music Serviced: </font></span></td>
  <td width="256">

<select name='music_served[]' multiple="multiple">
<option <? echo $a1; ?> >Alternative</option>
<option <? echo $a2; ?> >Blues</option>
<option <? echo $a3; ?> >Classical</option>
<option <? echo $a4; ?> >Country</option>
<option  <? echo $a5; ?> >Easy Listening</option>
<option <? echo $a6; ?> >Electronica-Club Dance</option>
<option <? echo $a7; ?> >Folk</option>
<option <? echo $a8; ?> >Hip Hop/Rap</option>
<option <? echo $a9; ?> >Inspirational</option>
<option <? echo $a10; ?> >International -Island - Caribbean</option>
<option <? echo $a11; ?> >Jazz</option>
<option <? echo $a12; ?> >Latin</option>
<option <? echo $a13; ?> >New Age</option>
<option <? echo $a14; ?> >Pop</option>
<option <? echo $a15; ?> >R & B-Urban</option>
<option <? echo $a16; ?> >Reggae</option>
<option <? echo $a17; ?> >Rock</option>
</select>
<br>

</td></tr>

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Address: </font></span></td><td width="256">
<font face="Verdana" color="slategray">
<textarea name='address' size="20"><?= $data[Address]; ?></textarea>
</font>
</td></tr>

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">City: * </font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='city' size="20" value="<?= $data[City]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<? if($data[PkgId] == '108' || $data[PkgId] == '109') { ?>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">State/Province:*</font></span></td>
  <td width="256"><font face="Verdana" size="2" color="slategray">
</font>
<label>
<input name="region_opt" type="radio" value="USA"  <? if($data[region_id]!=21) echo "checked='checked'"; ?>  checked="checked" onclick="javascript:changestate();"/>
USA Region<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<select name="selstate" <? if($data[region_id]==21) echo "disabled "; ?> >
<option value="">Select State</option>
<?
$selquery = "select * from states order by State";
$resquery = mysqli_query($conn, $selquery);
if(mysqli_num_rows($resquery) > 0)

{
	while($datastate = mysqli_fetch_array($resquery))
	{
		echo "<option value=".$datastate[State_Abbr]." ";
		if($datastate[State_Abbr] == $data[StateOrProvince])
				echo "  selected='selected' ";
		echo " >".$datastate[State]."</option>";	
	}
}
?>
</select>
<br />
<input name="region_opt" type="radio"  value="International"  <? if($data[region_id]==21) echo "checked='checked'"; ?>   onclick="javascript:changestate();" />
International Region <br />

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<font face="Verdana" color="slategray">
<input type="text" name='state' size="20" <? if($data[region_id]!=21) echo "disabled "; ?>  value="<?  if($data[region_id]==21) echo $data[StateOrProvince]; ?>"  />
</font></label></td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Country:*</font></span></td>
<td width="256">
<font face="Verdana" color="slategray">
<select name="country" <?  if($data[region_id]!=21) echo " disabled='disabled' "; ?> >
<option value="">-- Select a Country --</option>
<?
$c_res = mysqli_query($conn, "Select * from Country where country_code <> 'US' order by country_name");
while($c_data = mysqli_fetch_array($c_res)) {
		if($data[region_id]==21 && ($data[Country] == $c_data[country_code]))
				$sel = 'SELECTED';
			else
				$sel = '';
		echo "<option value='" . $c_data['country_code'] . "'  $sel >" . $c_data['country_name'] . "</option>";
}
?></select></font>
</td></tr>
<? } else { ?>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">State/Province:</font></span></td>
  <td width="256"><font face="Verdana" size="2" color="slategray">
</font>
<input type="text" name='state' size="20" value="<?= $data[StateOrProvince]; ?>" />
</td>
</tr>

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Country:*</font></span></td>
<td width="256">
<font face="Verdana" color="slategray">
<select name="country">
<option value="">-- Select a Country --</option>
<?
$c_res = mysqli_query($conn, "Select * from Country");
while($c_data = mysqli_fetch_array($c_res)) {
		if($data[Country] == $c_data[country_code])
				$sel = 'SELECTED';
			else
				$sel = '';
		echo "<option value='" . $c_data['country_code'] . "'  $sel >" . $c_data['country_name'] . "</option>";
}
?></select></font>
</td></tr>
<? } ?>

<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Postal Code: </font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='zip' size="20" value="<?= $data[Zip]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Contact Name:</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='contactname' size="20" value="<?= $data[ContactName]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<!--<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Phone: </font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='phone' size="20" value="<?= $data[Phone]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>-->
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Email: *</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='email' size="20" value="<?= $data[Email]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<!--<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Fax:</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='fax' size="20" value="<?= $data[Fax]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>-->


<?  if($f == 'mia' || $f == 'fanbase') { ?>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Number of Songs to be reviewed every month:</font></span></td>

  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='songreview' size="5" value='<?= $data[SongsReview]; ?>'></font><font face="Verdana" size="1" color="slategray">(Minimum 10 songs are accepted.)
</font>
</td></tr>
<? } ?>


<? if($f == 'mia') { ?>

<!--<tr><td width=251 valign=top>
<font face="Verdana" size="2" color="slategray">Correspondence Address:*</font></td>
  <td width="256">
<font face="Verdana" color="slategray">
 <textarea name="corraddres" size="20"><?= $data[corraddres]; ?></textarea>
</font>
</td></tr>-->
<? } ?>



<tr><td><p><b>Change Password</b><br><font size="1">(If left blank, password will not change)</font></p></td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Old Password:</font></span></td>
<td width="256">
<font face="Verdana" color="slategray">
<input type=password name='oldpassword' size="20"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Password:</font></span></td>
<td width="256">
<font face="Verdana" color="slategray">
<input type=password name='password' size="20"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Confirm Password:</font></span></td>
<td width="256">
<font face="Verdana" color="slategray">
<input type=password name='conf_password' size="20"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Lost Password Recovery Question:*</font></span></td>

  <td width="256">
<font face="Verdana" color="slategray">
<select name='lost_pass_ques'>
<option <? if($data[PwdQ]=='Favorite Game') echo 'selected'; ?>>Favorite Game<option <? if($data[PwdQ]=='Pet Name') echo 'selected'; ?>>Pet Name<option <? if($data[PwdQ]=='Birthday') echo 'selected'; ?>>Birthday<option <? if($data[PwdQ]=='Color') echo 'selected'; ?>>Color<option <? if($data[PwdQ]=='Other') echo 'selected'; ?>>Other</select></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="113" valign="top"><span class="style33"><font face="Verdana" class="style33">Lost Password Recovery Answer:*</font></span></td>
  <td width="256">
<font face="Verdana" color="slategray">
<input type=text name='lost_pass_ans' size="20" value="<?= $data[PwdA]; ?>"></font><font face="Verdana" size="2" color="slategray">
</font>
</td></tr>
<tr><td width="251">
  <font face="Verdana" size="2" color="slategray">&nbsp;</font><font face="Verdana" color="slategray"><input type=hidden name=form value=2></font></td>
  <td align=right width="256">
  <input type="hidden" name="pkg_type" value="<?= $data[PkgType]; ?>">
  <input type="hidden" name="f" value="<?= $f; ?>">
  <font face="Verdana" color="slategray"><input type='submit' value='Update' name='task'> &nbsp;&nbsp;&nbsp;<input type='reset' value='Reset'>
&nbsp;&nbsp;&nbsp;<input type='button' onclick="javascript:closeaccount();" name="clolsebutton" value='Close Account'>  </font>
  
  </td></tr>
</table>
</form>


<?
}
?>
