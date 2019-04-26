/*##################################################################################			
					LIST OF FUNCTIONS IN General.Js

	NOTE:	All the functin names follow java naming conventions

	----------------------------------------------------------------
					Validation Functions
	----------------------------------------------------------------
	1.  checkNumber(objTextBox, strField, AllowBlank)
	2.  validEmail(strEmailAddress)
	3. isAlphaNumeric(strText)

	----------------------------------------------------------------
					General Purpose functions
	----------------------------------------------------------------
	1. isChecked(objCheckBox)			'Check whether any check box is checked
	2. checkAll(objCheckBox, blnCheck)	'Check or Uncheck all check boxes
	
	1. trim(strTemp)
	2. trimAll()						'Function trims all the Textboxes and TextAreas on the Form
	3. lTrim(strTemp)
	4. rTrim(strTemp)
	5. trimTb(objTb)					'Trims the text box object
	
	6. replaceDoubleQuotes()			'replaces double quotes (") with 2 Single quotes ('') in all the text boxes and Text Areas
	7. replaceSingleQuotes()			'replaces 2 Single quotes ('') with One double quote (") in all the text boxes and Text Areas
	
	8. UrlEncode(srtUrl)				'returns the string with all space characters by '%20'
	9. getLeftPos(objElement)			'returns the absolute Left position of element
   10. getTopPos(objElement)			'returns the absolute Top position of element
   11. CalShowComboBoxes(name, Show)	'Hides all comboboxes under the area of given element
   
   ----------------------------------------------------------------
				Hint
   ----------------------------------------------------------------
	1. Call following function in onLoad event of BODY
		- replaceSingleQuotes()
   
	2. Call following Two functions before you Validate data in Save() function
		- trimAll()
		- replaceDoubleQuotes()
##################################################################################*/

/******************************************************************************************************************
					Validation Functions
******************************************************************************************************************/
/*-----------------------------------------------------------------------------------------------------------------
 Function:			checkNumber(objTextBox, strField, AllowBlank)
 Description:		Returns false, Gives message and Sets focus to text box if entered 
					text is not a number. Otherwise returns true.
 Arguments:
	objTextBox	->	Textbox object whose text is to be checked for number
	strField	->	The field description.
	AllowBlank	->  VALUE				DESCRIPTION
					----------------------------------
					false				Returns false if nothing is entered in text box
										or invalid number is typed
					true				Returns true if nothing is entered in text box
										Returns false if invalid number is typed
-----------------------------------------------------------------------------------------------------------------*/
var PrgrsWin;
function IsNumeric(sText)
{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;
   for (i = 0; i < sText.length && IsNumber == true; i++) 
   { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
      {
         IsNumber = false;
      }
   }
   return IsNumber;
}

function checkNumber(objTextBox, strField, AllowBlank)
{
	
	//objTextBox: Text Box whose value is to be checked
	//strField :  Pass Field Name for appropriate message
	var x=objTextBox.value;

	var anum=/(^\d+$)|(^\d+\.\d+$)/;
	
	if(arguments.length == 1)
	{
		strField = "";
	}
	
	if(arguments.length == 2)
	{
		AllowBlank=false;
	}
	
	if (x=="" && AllowBlank==true) 
	{
		return (true);
	}

	if (anum.test(x))
	{
		testresult=true;
	}
	else
	{
		var strMsg;
		
		if(strField=="")
		{
			strMsg="Please input a valid number!";
		}
		else
		{
			strMsg="Please input a valid number in " + strField + "!";
		}
		
		alert(strMsg);
		objTextBox.focus();
		testresult=false;
	}

	return (testresult);
}

/*-----------------------------------------------------------------------------------------------------------------
	Description: Returns true if the given address is valid email address otherwise returns false
-----------------------------------------------------------------------------------------------------------------*/
function validEmail(strEmail)
{	//var strExpression = /^[a-z][a-z_0-9\.]+@[a-z_0-9\.]+$/i;
	
	//return strExpression.test(strEmail);
	if (strEmail.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) != -1)
		return true;
	else
		return false;

}

/*-----------------------------------------------------------------------------------------------------------------
	Description: Returns true if the given string is Alphanumeric.
		     String must be started with Alphabet and optionally follwed by
		     numbers or Underscore
-----------------------------------------------------------------------------------------------------------------*/
function isAlphaNumeric(strText) 
{ 
   var strExpression = /^[a-z][a-z_0-9]{0,}$/i; 
   return strExpression.test(strText); 
}

/******************************************************************************************************************
			General purpose functions
******************************************************************************************************************/
/*-----------------------------------------------------------------------------------------------------------------
	Function:		isChecked(objCheckBox)
	Description:	returns true if check box OR any of check box 
			from the array of check box is checked.
			Otherwise returns false
-----------------------------------------------------------------------------------------------------------------*/
function isChecked(objCheckBox)
{
	var iIndex;
	
	//If checkbox object does not exist
	if(typeof(objCheckBox) != 'object')
	{
		return false;
	}
	
	//If there is only one checkbox
	if(typeof(objCheckBox[0]) != 'object')
	{
		return objCheckBox.checked;
	}
	else
	{
		var iChecked=0;
		
		for(iIndex=0; iIndex<objCheckBox.length; iIndex++)
		{
			if(objCheckBox[iIndex].checked == true)
			{
				return true;
			}
		}
		
		return false;		
	}
}

/*-----------------------------------------------------------------------------------------------------------------
	Function:		checkAll(objCheckBox, blnCheck)
	Description:	Checks the check box OR all the checkboxes in array of checkboxes
			if blnCheck is true.
			
			Unchecks the check box OR all the checkboxes in array of checkboxes
			if blnCheck is false.
-----------------------------------------------------------------------------------------------------------------*/
function checkAll(objCheckBox, blnCheck)
{
	var iIndex;
	
	//If checkbox object does not exist
	if(typeof(objCheckBox) != 'object')
	{
		return false;
	}
	
	//If there is only one checkbox
	if(typeof(objCheckBox[0]) != 'object')
	{
		objCheckBox.checked = blnCheck;
	}
	else
	{
		var iChecked=0;
		
		for(iIndex=0; iIndex<objCheckBox.length; iIndex++)
		{
			objCheckBox[iIndex].checked = blnCheck;
		}
	}
}

/******************************************************************************************************************
						Trim Functions
******************************************************************************************************************/
function trim(strTemp)
{
	strTemp = lTrim(strTemp);
	strTemp = rTrim(strTemp);
	return strTemp;
}

function trimAll()
{
	var i;

	//Check for all input elements
	for(i=0; i<document.all.tags("INPUT").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTB  = document.all.tags("INPUT")(i);
		//If it is text box, then replace double quotes with 2 single quotes
		if(objTB.type == "text")
		{
			objTB.value = trim(objTB.value);
		}
	}

	//Check for all input elements
	for(i=0; i<document.all.tags("TEXTAREA").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTA  = document.all.tags("TEXTAREA")(i);
		
		objTA.value = trim(objTA.value);
	}
}

function lTrim(strTemp)
{
  var iIndex;
  var charTemp;

	for(iIndex=0; iIndex< strTemp.length;iIndex++)
	{
		charTemp = strTemp.substring(iIndex, iIndex+1);
		if(charTemp != ' ') break;
	}

	strTemp = strTemp.substring(iIndex, strTemp.length);
	return strTemp;
}

function rTrim(strTemp)
{
  var iIndex;
  var charTemp;

	for(iIndex=strTemp.length; iIndex>0;iIndex--)
	{
		charTemp = strTemp.substring(iIndex-1, iIndex);
		if(charTemp != ' ') break;
	}

	strTemp = strTemp.substring(0,iIndex);
	return strTemp;
}

function trimTb(objTb)
{
	objTb.value = Trim(objTb.value);
}


/******************************************************************************************************************
						Replace quote functions
******************************************************************************************************************/
/*-----------------------------------------------------------------------------------------------------------------
	function:		replaceDoubleQuotes()
	Description:	Replace  double quotes (") with 2 single quotes ('')
		Call this replaceDoubleQuotes() function before you submit the form.
		This function replaces Double quotes with 2 single quotes
		in all the text boxes and text areas 
-----------------------------------------------------------------------------------------------------------------*/

function replaceDoubleQuotes()
{
	var i;

	//Check for all input elements
	for(i=0; i<document.all.tags("INPUT").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTB  = document.all.tags("INPUT")(i);
		//If it is text box, then replace double quotes with 2 single quotes
		if(objTB.type == "text")
		{
			replaceDouble(objTB)
		}
	}

	//Check for all input elements
	for(i=0; i<document.all.tags("TEXTAREA").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTA  = document.all.tags("TEXTAREA")(i);
		replaceDouble(objTA)
	}
}					


//2. To replace the double quotes by " '' "
function replaceDouble(txtObj)
{

//Pass the text box object as argument to this function

 var strTmp1 = new String();
	
 strTmp1 = txtObj.value;
 //'RegExp
 txtObj.value = strTmp1.replace(/"/g,"''");
 return true;
}

/*-----------------------------------------------------------------------------------------------------------------
	function:		replaceSingleQuotes()
	Description:	Replace 2 single quotes ('') with double quotes (") 
		in all the text boxes. Call this replaceSingleQuotes() function in onLoad
		event of BODY.
-----------------------------------------------------------------------------------------------------------------*/
function replaceSingleQuotes()
{
	var i;
	//Check for all input elements
	for(i=0; i<document.all.tags("INPUT").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTB  = document.all.tags("INPUT")(i);
		//If it is text box, then replace double quotes with 2 single quotes
		if(objTB.type == "text")
		{
			replaceSingle(objTB)
		}
	}

	//Check for all input elements
	for(i=0; i<document.all.tags("TEXTAREA").length;i++)
	{
		//Get object of INPUT ELEMENT
		objTA  = document.all.tags("TEXTAREA")(i);
		replaceSingle(objTA)
	}
}					


//2. To replace the two single quotes by one double quote (")
function replaceSingle(txtObj)
{

//Pass the text box object as argument to this function

 var strTmp1 = new String();
	
 strTmp1 = txtObj.value;
 //'RegExp
 txtObj.value = strTmp1.replace(/''/g,"\"");
 return true;
}

/*-----------------------------------------------------------------------------------------------------------------
	Function:		UrlEncode(srtUrl)
	Description:	Returns the string with all space characteres replaced by '%20'
-----------------------------------------------------------------------------------------------------------------*/
function UrlEncode(strUrl)
{
	var re;
	
//	re = / /i;
//	strUrl = strUrl.replace(re,"%20");

	re = /&/i;
	strUrl = strUrl.replace(re,"%26");
	
	return strUrl;
}

/******************************************************************************************************************
						POSITIONING functions
******************************************************************************************************************/
function getLeftPos(objElement)
{
	var i;
	var objParent;
	var iLeft=0;
					
	if(typeof(objElement) != 'object')
	{
		alert("Invalid Object.");
		return 0;
	}
	
	//Find the element's offsetLeft relative to the BODY tag.
	
	iLeft = objElement.offsetLeft;
	objParent = objElement.offsetParent;

	while (objParent.tagName.toUpperCase() != "BODY")
	{
		iLeft += objParent.offsetLeft;
		objParent = objParent.offsetParent;
	}
	
	return iLeft;	
}

function getTopPos(objElement)
{
	var i;
	var objParent;
	var iTop=0;
					
	if(typeof(objElement) != 'object')
	{
		alert("Invalid Object.");
		return 0;
	}
	
	//Find the element's offsetLeft relative to the BODY tag.

	iTop = objElement.offsetTop;
	objParent = objElement.offsetParent;

	while (objParent.tagName.toUpperCase() != "BODY")
	{
		iTop += objParent.offsetTop;
		objParent = objParent.offsetParent;
	}

	return iTop;	
}

function CalShowComboBoxes(name, Show)
{	
	var i;
	if(name!=null)
	{
		//If want to hide the comoboxes
		if(Show == false)
		{
			var objParent;
			var objSel, selLeft, selTop, selRight;
			var nameLeft, nameTop, nameHeight, nameWidth;
				
			//Get Left, Top, Height and Width of an object
			nameLeft   = name.offsetLeft;
			nameTop	   = name.offsetTop;
			nameHeight = name.offsetHeight;
			nameWidth  = name.offsetWidth;

			for(i=0; i<document.all.tags("SELECT").length;i++)
			{
				objSel  = document.all.tags("SELECT")(i);
				if (! objSel || ! objSel.offsetParent) 
					continue;

				//Find the element's offsetTop and offsetLeft relative to the BODY tag.
				selLeft   = objSel.offsetLeft;
				selTop    = objSel.offsetTop;
				objParent = objSel.offsetParent;
				while (objParent.tagName.toUpperCase() != "BODY")
				{
					selLeft  += objParent.offsetLeft;
					selTop   += objParent.offsetTop;
					objParent = objParent.offsetParent;
				}
				selRight=selLeft+objSel.offsetWidth;
					
				//If Combobox's Top is covered by the element
				if( selTop<(nameTop + nameHeight) )
				{
					//If Combobox's left is covered by Dropdown menu
					//OR Combobox's right is covered by Dropdown menu
					if( (selLeft>nameLeft  && selLeft<(nameLeft+nameWidth))
					    ||
					    (selRight>nameLeft && selRight<(nameLeft+nameWidth))
					  )
					{
						objSel.style.visibility="hidden";
					}  
				}
			}

			for(i=0; i<document.all.tags("OBJECT").length;i++)
			{
				objSel  = document.all.tags("OBJECT")(i);
				if (! objSel || ! objSel.offsetParent) 
					continue;

				//Find the element's offsetTop and offsetLeft relative to the BODY tag.
				selLeft   = objSel.offsetLeft;
				selTop    = objSel.offsetTop;
				objParent = objSel.offsetParent;
				while (objParent.tagName.toUpperCase() != "BODY")
				{
					selLeft  += objParent.offsetLeft;
					selTop   += objParent.offsetTop;
					objParent = objParent.offsetParent;
				}
				selRight=selLeft+objSel.offsetWidth;
					
				//If Combobox's Top is covered by Dropdown menu
				if( selTop<(nameTop + nameHeight) )
				{
					//If Combobox's left is covered by Dropdown menu
					//OR Combobox's right is covered by Dropdown menu
					if( (selLeft>nameLeft  && selLeft<(nameLeft+nameWidth))
					    ||
					    (selRight>nameLeft && selRight<(nameLeft+nameWidth))
					  )
					{
						objSel.style.visibility="hidden";
					}  
				}
			}
		}
		else
		{
			for(i=0; i<document.all.tags("SELECT").length;i++)
			{
				document.all.tags("SELECT")(i).style.visibility="visible";
			}

			for(i=0; i<document.all.tags("OBJECT").length;i++)
			{
				document.all.tags("OBJECT")(i).style.visibility="visible";
			}
		}
	}
}
