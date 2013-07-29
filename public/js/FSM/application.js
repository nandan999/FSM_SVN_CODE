/*
   Performs the validation and Native button functionality implementation.
   @author: Mohit Raheja
   @version: 1.0
*/

//Performing the native back functionality
function backKeyPress(param)
{  
   if(param.toString() == "166")
   {
     $.get('/app/Settings/back_page',''); 
   }
}

//Performs the task of setting the focus to the text fields in the entire application.
function setFocus(id)
{
	document.getElementById(id).focus();
}

//Preserves the values of all the option boxes on orientation change or refresh,in entire application.
function setDropDownList(elementRef, valueToSetTo)
{
 var isFound = false;
 for (var i=0; i<elementRef.options.length; i++)
 {
  if ( elementRef.options[i].value == valueToSetTo )
  {
   elementRef.options[i].selected = true;
   isFound = true;
  }
 }
 if ( isFound == false )
  elementRef.options[0].selected = true;
  
$("#"+elementRef.id+"").selectmenu('refresh');
}

//scrolls down the body on text fields focus in the entire application on APPLE PLATFORM.
function focusIn(phone, platform, id)
{
  setFocus(id);
  if(phone == "false" && platform == "APPLE")
  {
    $("html, body").animate({ scrollTop: 0 }, 500);
    return false;
  }
  else if(phone == "true" && platform == "APPLE")
  {
    $('header').css('position','relative');
    $('.footerFull').css('position','relative');
  }
}
  
//Fixes the position of header and footer on focus out of the text fields on APPLE PLATFORM.
function focusOut(phone, platform)
{
  if(phone == "true" && platform == "APPLE")
  {
    $('header').css('position','fixed');
    $('.footerFull').css('position','fixed');
  }
}

//Store the value of the option box on change.
function dropdown_change(selectObj)
{
	var item = selectObj.id;
	var select_id = document.getElementById(item);
	c_val = select_id.options[select_id.selectedIndex].value;
	val_cust = item + "-" + c_val;
	$.get("/app/Customer/get_Values",{"value":val_cust});
}