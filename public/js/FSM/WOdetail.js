/*
    Performs the entire validation of all the tabs associated with workorders.
    @author: Mohit Raheja, Nandan Thareja, Rajbeer Kaur, Sonali Banerjee.
    @version : 1.0    
 
*/	

//Sets the selected section to Details by default.
var selectedSection = "Details";

function pageY(elem) {
   return elem.offsetParent ? (elem.offsetTop + pageY(elem.offsetParent)) : elem.offsetTop;
}
   
function pageX(elem) {
   return elem.offsetParent ? (elem.offsetLeft + pageX(elem.offsetParent)) : elem.offsetLeft;
}
	
//Clears the fields of contact name and signature on clear button click on 'CLOSE' TAB.
function onClear() {
	document.getElementById('contact_name').value = "";
	$.get('/app/WorkOrder/do_clear', {});
		return false;
}
   
//Capture the signature on on check icon click on inline signature window on close workorder page
function onCapture() {
	var id = document.getElementById("selectBox");
	var value = id.options[id.selectedIndex].value;
	var wo_id = document.getElementById("wo_id").value;
	var contact= document.getElementById('contact_name').value;
	if(contact==null || contact.trim()=="")
	{
		$.get("/app/WorkOrder/alerts",{"msg":"Please enter Contact name","title":"FSM"});
		return false;
	}  
	$.get('/app/WorkOrder/do_close', {'WO_id':wo_id,'contactName':contact,'Status':value});
	return false;
}
	
//Changes Header values for various tabs
function changeHeader(val)
{
	  node = document.getElementById("headerTag");
	  var count = $("#headerTag").children().length;
	  var elem = "";
	  for(var i=0;i<count;i++)
	    {
	     elem = $('#headerTag').children().eq(i);
	      if(!(elem.attr("id") == "workOrderButtonTop" || elem.attr("id") == "pageHeader" || elem.attr("id") == "backButton"))
	        {
	          i=i-1;
	          count = count - 1;
	          elem.remove();
	        }
	    }
	  if(val == "Close")
	  	document.getElementById("pageHeader").innerHTML = "Close Work Order";
	  else if(val == "Photos_with_delete")
		document.getElementById("pageHeader").innerHTML = "Photos";
	  else if(val == "Parts" || val=="Parts_Delete")
		document.getElementById("pageHeader").innerHTML = "Parts List";
	  else if(val == "Parts_Scan")
		document.getElementById("pageHeader").innerHTML = "Parts";
	  else
	    document.getElementById("pageHeader").innerHTML = val;
	  var html = document.getElementById("headerTag").innerHTML;
	  $.get("/app/WorkOrder/get_selected_wo",{},function(disableButtons) {
	  if(val=="Photos")
      {
    	editButton = createButton("editPhotos()","editButton","right","Edit","inline",disableButtons);
    	deleteButton = createButton("donePhotos()","donePhotosButton","right","Done","none",disableButtons);
        document.getElementById("headerTag").innerHTML = html + editButton + deleteButton;
	  }
	  else if (val=="Photos_with_delete")
	  {
	  	editButton = createButton("editPhotos()","editButton","right","Edit","none",disableButtons);
      	deleteButton = createButton("donePhotos()","donePhotosButton","right","Done","inline",disableButtons);
		document.getElementById("addPhotoButton").disabled=true;
      	document.getElementById("photosAddButton").style.opacity = 0.6;
      	document.getElementById("addPhotoButton").style.zIndex = 2;
      	document.getElementById("headerTag").innerHTML = html + editButton + deleteButton;
	  }
	  else if (val=="Close")
	  {
	  	var doneButton = createButton("onCapture()","doneButton","right","Done","inline",disableButtons);
	    document.getElementById("headerTag").innerHTML = html + doneButton;
	  }
	  else if(val == "Parts")
	  {
		  var partListData = $("#PartListPage").children().length;
		  if(partListData == 0 || disableButtons == "true")
			  disableEditButton = "true";
		  else
		  	disableEditButton = "false";
		  var editButton = createButton("editPartsList()","partsEditButton","right","Edit","inline",disableEditButton);
		  var addButton = createButton("addParts()","addPartsButton","right","Add","none",disableButtons);
		  var doneButton = createButton("done_click()","doneButton","right","Done","none",disableButtons);
		  
		  var partDisplayListText = {
			'padding-top':'12px'
	      }
	        
	      $('.partDisplayList').css(partDisplayListText);
		  document.getElementById("headerTag").innerHTML = html + editButton + addButton + doneButton; 
	  }
	  else if(val == "Parts_Scan")
	  {
		  document.getElementById("addtoListButton").disabled = false;
		  var editButton = createButton("editPartsList()","partsEditButton","right","Edit","none",disableButtons);
		  var addButton = createButton("addParts()","addPartsButton","right","Add","inline",disableButtons);
		  var doneButton = createButton("done_click()","doneButton","right","Done","none",disableButtons);
		  document.getElementById("headerTag").innerHTML = html + editButton + addButton + doneButton; 
	  }
	  else if(val == "Parts_Delete")
	  {
		  var editButton = createButton("editPartsList()","partsEditButton","right","Edit","none",disableButtons);
		  var addButton = createButton("addParts()","addPartsButton","right","Add","none",disableButtons);
		  var doneButton = createButton("done_click()","doneButton","right","Done","inline",disableButtons);
		  document.getElementById("addtoListButton").disabled = true;
	      document.getElementById("addParts").style.opacity = 0.6;
	      document.getElementById("addtoListButton").style.zIndex = 2;
		  document.getElementById("headerTag").innerHTML = html + editButton + addButton + doneButton; 
	  }
  });
}

//Refreshes the Photo list Dynamically on add and delete photos on PHOTOS TAB.
function refresh_photos_section(value)
{
	if(value=="true")
		showEditDelete("inline","none");
	$("#photosMain").load(location.href + " #photosDiv");
}

//Method for creating the button in header
function createButton(func,id,position,value,display,disable)
{
	if(disable == "false")
		html = '<a href="javascript:' + func + ';" id="' + id + '" style="display:'+ display +';" class="topButtons ui-btn-'+ position +' ui-btn ui-btn-up-a ui-button-corner-all ui-shadow" data-theme="a"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">'+ value +'</span></span></a>';
	else if(disable == "true")
		html = '<a href="javascript:void(0);" id="' + id + '" style="display:'+ display +';opacity:0.8;" class="topButtons ui-btn-'+ position +' ui-btn ui-btn-up-a ui-button-corner-all ui-shadow" data-theme="a"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text">'+ value +'</span></span></a>';
	return html;
}

//Shows the delete icon on all the list items in Photod list on PHOTOS TAB.
function editPhotos()
{
  var listExist = $('#photosListDiv').css('display');
  if(listExist == "inline")
  {
    var tag = document.getElementsByClassName("minusIconPhotos");
    for(var i=0;i<tag.length;i++)
      tag[i].style.display = "inline";
    $('.photosImage').removeClass('photosImageLeft').addClass('photosImageRight');
    $('.photosDate').removeClass('photosDateTimeLeft').addClass('photosDateTimeRight');
    $('.photosTime').removeClass('photosDateTimeLeft').addClass('photosDateTimeRight');
	showEditDelete("none","inline");
  }
}

//Shows a confirmation box with photo id and date for the photo to be deleted on PHOTOS TAB.
function delete_photo(id)
{
	var date = document.getElementById("Date"+id).innerHTML;
	var time = document.getElementById("Time"+id).innerHTML;
	$.get("/app/WorkOrder/delete_photo",{photo_id:id, photo_date:date, photo_time:time});
}

//Shows the edit and delete button in header ,and also disables the buttons when required on PHOTOS TAB.
function showEditDelete(showEdit,showDelete)
{
  document.getElementById("editButton").style.display = showEdit ;
  document.getElementById("donePhotosButton").style.display = showDelete ;
  if(showDelete == "inline")
  {
  	document.getElementById("addPhotoButton").disabled=true;
  	document.getElementById("photosAddButton").style.opacity = 0.6;
  	document.getElementById("addPhotoButton").style.zIndex = 2;
    $.get("/app/WorkOrder/change_photos_page",{page : "PhotosDelete"});
  }
  else if(showEdit == "inline")
  {
  	document.getElementById("addPhotoButton").disabled = false;
  	document.getElementById("photosAddButton").style.opacity = 1;
    $.get("/app/WorkOrder/change_photos_page",{page : "PhotosEdit"});
  }
}

//Hides the delete button when done button in the header is clicked on PHOTOS TAB
function donePhotos()
{
  showEditDelete("inline","none");
  var tag = document.getElementsByClassName("minusIconPhotos");
  for(var i=0;i<tag.length;i++)
    tag[i].style.display = "none";
  $('.photosImage').removeClass('photosImageRight').addClass('photosImageLeft');
  $('.photosDate').removeClass('photosDateTimeRight').addClass('photosDateTimeLeft');
  $('.photosTime').removeClass('photosDateTimeRight').addClass('photosDateTimeLeft');
}

//Navigates to add_photos method for adding photos on Add photos click on PHOTOS TAB. 
function addPhoto()
{
  $.get("/app/WorkOrder/add_photos",{});
}

//Performs zooming a photo when the photo in photo list is clicked on PHOTOS TAB.
function zoomPhoto(imageSrc)
{
   var mainDiv = document.createElement("div")
   mainDiv.setAttribute('id', 'photoPopUpCover')
   mainDiv.style.width = parseInt($(window).width())+'px';
   mainDiv.style.height = parseInt($(window).height())+'px';
   mainDiv.style.position = "fixed";
   mainDiv.style.top="0px";
   var div = document.createElement("div");
   div.setAttribute('id', 'photoCover'); 
   var Img=document.createElement("img");
   Img.setAttribute('src', imageSrc);
   
   if(window.innerHeight > window.innerWidth){
          div.style.width = .5*(parseInt($(window).width()))+'px';
          div.style.height = .375*(parseInt($(window).height()))+'px';
          var left = .25*(parseInt($(window).width()));
          var top = .3125*(parseInt($(window).height()));
          Img.setAttribute('width', .5*(parseInt($(window).width()))-20+'px');
          Img.setAttribute('height', .375*(parseInt($(window).height()))-40+'px');
   }
   else
   {
          div.style.width = .375*(parseInt($(window).width()))+'px';
          div.style.height = .5*(parseInt($(window).height()))+'px';
          var left = .3125*(parseInt($(window).width()));
          var top = .25*(parseInt($(window).height()));
          Img.setAttribute('width', .375*(parseInt($(window).width()))-20+'px');
          Img.setAttribute('height', .5*(parseInt($(window).height()))-40+'px');
   }
   
   div.style.border = '1px solid black';
   div.style.textAlign = "center"
   
   div.style.position = "absolute";
   div.style.top = top+'px';
   div.style.left = left+'px';
   
   var closeBtn = document.createElement("img");
   closeBtn.setAttribute('src','/public/images/FSM/close.png');
   closeBtn.setAttribute('width', '32px');
   closeBtn.setAttribute('height', '32px');
    closeBtn.onclick = function(){
      mainDiv.style.display = "none";
      delete mainDiv;
      document.body.removeChild(mainDiv);
    }
    div.appendChild(Img);
   div.appendChild(closeBtn);
   mainDiv.appendChild(div);
   mainDiv.style.display = "block";
   document.body.appendChild(mainDiv);
    var headers = document.getElementsByTagName("header");
    for(var i=0;i<headers.length;i++){
      headers[i].style.zIndex=2;
      if(document.getElementById("calenderBoxPartial") != null)
       document.getElementById("calenderBoxPartial").style.zIndex=2;
    }
}

//Performs navigating to next and previous page on pagination in photos list in Landscape mode on PHOTOS TAB   
function nextPreviousPhotos(val)
{
	$.get('/app/WorkOrder/get_photos',{value : val},function(data) {
		data =JSON.parse(data);
		var photosList = document.getElementsByClassName("photosList");
        for(var i=0;i<photosList.length;i++)
        	photosList[i].style.display='none';
        for(var i=0;i<data.length;i++)
         	document.getElementById("list" + data[i]).style.display = "block";
      }); 
}

//shows the workorder list popup in portrait mode on workorder button click in the header on DETAILS TAB
function showWorkOrderPopUp()
{
  $('#workOrderPopUpCover').css('display','block');
  $('#displayWorkOrderPopUpCover').css('display','block');
}
    
//Hidesthe workorder popup
function workOrderPopUpCover()
{
  $('#workOrderPopUpCover').css('display','none');
}

//Hides the background of workorder popup
function displayWorkOrderPopUpCover()
{
  $('#displayWorkOrderPopUpCover').css('display','none');
}

//Clear the barcode values on clear button click on PARTS TAB.
function clearBarcode()
{
  document.getElementById("PartbarcodeValue").value= "";
  document.getElementById("PartSerialValue").value = "";
  var contactName = document.getElementById("contact_name").value;
  $.get('/app/WorkOrder/clear_values',{});
  document.getElementById("PartbarcodeValue").focus();
}

//Checks whether the Part no text field is focused or not on PARTS TAB.
function PartsfocusCheck(phone,platform,id)
{
   check = "partcode";
   focusIn(phone, platform, id);
}

//Checks whether the serial no text field is focused or not on PARTS TAB.
function SerialfocusCheck(phone,platform,id)
{
  check = "serialcode";
  focusIn(phone, platform, id);
}

//performs the scanning of a barcode on scan button click on PARTS TAB.
function scanBarcode()
{
    
   if(check == "partcode" || check == "serialcode"){
        var partcodeTextbox = document.getElementById("PartbarcodeValue").value;
        var serialcodeTextbox = document.getElementById("PartSerialValue").value;
        $.get('/app/WorkOrder/takeBarcode',{codeCheck : check,partcodeboxVal : partcodeTextbox , serialcodeboxVal : serialcodeTextbox});
    }
   
}
   
//check if the fields are empty,and adds the recognized part in the parts list on PARTS TAB
function addParts()
{
         var partNumber = document.getElementById("PartbarcodeValue").value;
         var serialNumber = document.getElementById("PartSerialValue").value;
          if(partNumber == "" && serialNumber == ""){
        	  $.get("/app/WorkOrder/alerts",{"msg":"Please provide Part or Serial #","title":"FSM"});
        	  document.getElementById("PartbarcodeValue").focus();
          }
          else if(partNumber != "" && serialNumber ==""){
            $.get('/app/WorkOrder/add_parts',{part_number:partNumber,serial_number:serialNumber});
          }
          else if(partNumber == "" && serialNumber!=""){
            $.get('/app/WorkOrder/add_parts',{part_number:partNumber,serial_number:serialNumber});
          }
          else{
            $.get('/app/WorkOrder/add_parts',{part_number:partNumber,serial_number:serialNumber});
          }
}
  
//Updates the parts list Dynamically when a new part is added on PARTS TAB    
function updatePartsList(val){
     $.get('/app/WorkOrder/update_parts',{value:val},function(data) {
      data = JSON.parse(data)
	   var partsListData = document.getElementsByClassName("partList");
	   for(var i=0;i<partsListData.length;i++)
	     partsListData[i].style.display='none';
	   for(var i=0;i<data.length;i++)
	     document.getElementById("partData" + data[i]).style.display = "block";
            }); 
}
      
//Shows the edit and done button in header ,and also disables the buttons when required on PARTS TAB.        
function showButton(showEdit,showDelete)
{
     
    document.getElementById("partsEditButton").style.display = showEdit ;
    document.getElementById("doneButton").style.display = showDelete ;
    if(showDelete == "inline")
    {
	   document.getElementById("addtoListButton").disabled = true;
	   document.getElementById("addParts").style.opacity = 0.6;
	   document.getElementById("addtoListButton").style.zIndex = 2;
	   $.get("/app/WorkOrder/change_parts_page",{page : "PartsDelete"});
	 }
	 else if(showEdit == "inline")
	 {
	   document.getElementById("addtoListButton").disabled = false;
	   document.getElementById("addParts").style.opacity = 1;
	   $.get("/app/WorkOrder/change_parts_page",{page : "PartsEdit"});
	 }
}
        
//Refreshes the parts list when the part is deleted on delete icon click on PARTS TAB
function refresh_part_list(val)
{
		$("#partsSubMain").load(location.href + " #PartListPage");
	if(val=="true")
	{
		document.getElementById("addtoListButton").disabled = false;
		document.getElementById("addParts").style.opacity = 1;
		document.getElementById("partsEditButton").style.display="inline"; 
		document.getElementById("doneButton").style.display = "none";
		$.get("/app/WorkOrder/change_parts_page",{page : "PartsEdit"});
		document.getElementById("partsEditButton").setAttribute("href","javascript:void(0);");
		}
}
    
//Shows the delete icon on all the list items in Parts list on PARTS TAB.
function editPartsList(){
        showButton("none","inline")
	    var tag = document.getElementsByClassName("minusIconParts");
        for(var i=0;i<tag.length;i++)
           tag[i].style.display = "inline";
}
 
//Hides the delete button when done button in the header is clicked on PARTS TAB
function done_click(){
     showButton("inline","none");  
     var tag = document.getElementsByClassName("minusIconParts");
     for(var i=0;i<tag.length;i++)
     	tag[i].style.display = "none";
}
    
//Shows the scan page on 'Add Parts' button click and by default sets the focus to Part no field.
function addPartsList(){
	 $.get("/app/WorkOrder/change_parts_page",{page : "PartsScan"});
	 document.getElementById("pageHeader").innerHTML = "Parts";
	 document.getElementById("partsMain").style.display = "none";
	 document.getElementById("addPart").style.display = "block";
	 document.getElementById("PartbarcodeValue").focus();
	 document.getElementById("partsEditButton").style.display="none"; 
	 document.getElementById("doneButton").style.display = "none"; 
	 document.getElementById("addPartsButton").style.display = "inline";
	 document.getElementById("PartbarcodeValue").value= "";
	 document.getElementById("PartSerialValue").value = "";
}
     
//Performs the deletion of a part when delete icon is clicked on PARTS TAB.    
function onDeleteClick(obj){
      id= obj.id;
      rowIndex = id.substr(5);
      var partValue = document.getElementById("partId"+rowIndex).innerHTML;  
      $.get('/app/WorkOrder/deletePart',{partvalue:partValue});
}

//Navigates to the Parts List page when cancel button is clicked on the scan page on PARTS TAB.
function cancelBarcode()
{
	$.get("/app/WorkOrder/change_parts_page",{page : "PartsEdit"});
	document.getElementById("partsMain").style.display = "block";
    document.getElementById("addPart").style.display = "none";
    document.getElementById("partsEditButton").style.display="inline"; 
    document.getElementById("addPartsButton").style.display = "none";
    document.getElementById("pageHeader").innerHTML = "Parts List";
	var partListData = $("#PartListPage").children().length;
	if(partListData == 0)
		document.getElementById("partsEditButton").setAttribute("href","javascript:void(0);");
}

//Sets the Barcode values in the text fields of partno and serial no on PARTS TAB.
function setBarcodeValues()
{
  var partcodeValue = document.getElementById("partcodeValue").value;
  var serialcodeValue = document.getElementById("serialcodeValue").value;
  if(document.getElementById("checkValue").value == "partcode"){
       
        if(document.getElementById("serialcodeboxVal").value == ""){
          document.getElementById("PartbarcodeValue").value= partcodeValue; 
        }
        else if(document.getElementById("serialcodeboxVal").value != ""){
          document.getElementById("PartbarcodeValue").value= partcodeValue;
          document.getElementById("PartSerialValue").value= document.getElementById("serialcodeboxVal").value;
        }
    
    }
  else if(document.getElementById("checkValue").value == "serialcode")
    {   
      if(document.getElementById("partcodeboxVal").value == ""){
            document.getElementById("PartSerialValue").value= serialcodeValue; 
       }
      else if(document.getElementById("partcodeboxVal").value != ""){
        document.getElementById("PartbarcodeValue").value = document.getElementById("partcodeboxVal").value ;
        document.getElementById("PartSerialValue").value= serialcodeValue;
      }
      
    }
  document.getElementById("pageValue").value="";
  document.getElementById("checkValue").value="";  
}

//Preserves the values and validates the values for numeric and alphabetic input on and orientation change and KeyIn on PARTS AND CLOSE TAB.
function setValuesOnChange(obj){
    var obj_id = obj.id;
    var obj_value = document.getElementById(obj_id).value;
     if (obj_id != "contact_name")
     {
    	var valueValid = obj_value.match(/[!@#$%^&*()+="-\';,./{}|:<>a-zA-Z?]/g);
		if(valueValid != null){
         document.getElementById(obj_id).value = "";
         document.getElementById(obj_id).focus();
         $.get("/app/WorkOrder/alerts",{"msg":"Enter Numeric Value Only!","title":"FSM"});
         return false;
		}
     }
     else
     {
    	var valueValid = obj_value.match(/[!@#$%^&*()+="-\';,./{}|:<>0-9?]/g);
 		if(valueValid != null){
         document.getElementById(obj_id).value = "";
         document.getElementById(obj_id).focus();
        $.get("/app/WorkOrder/alerts",{"msg":"Enter alphabets Only!","title":"FSM"});
        return false;
 		}
     }
  	$.get('/app/WorkOrder/setValuesOnChange',{"value": obj_id + "-" + obj_value});
}
  
    
  