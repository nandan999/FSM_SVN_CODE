/* 
   jQuery for FSM.css
   @author: Mohit Raheja,Rajbeer Kaur,Yogesh Raj,Nandan Thareja,Sonali Banerjee.
   @version: 1.0 
 
*/

$(document).ready(function() {
	//variable for height of left section in landscape mode. 
	var leftSectionHeight = $('.leftSection').height();
	//get height of body.
	var documentHeight = $(document).height();
	//setting height of page in protrait mode and landscape mode.
	if(documentHeight<leftSectionHeight)
	{
		$('.leftSection').css('height',leftSectionHeight+250+'px');
	}
	else
	{
		$('.leftSection').css('height',documentHeight+'px');
	}

	$('.ui-bar-a').css('border','0px');
 
 	$('#workOrderList .ui-link').css('color','#fff');
 	//variable for body background 
	var bodyBGMain = {
		'background':'#1f5b04 url("/public/images/FSM/bodyBg.png") no-repeat',
		'background-size': 'cover'
	}
	//sets body background
	$('#mainBody').css(bodyBGMain);
	
	var bodyBG = {
		'background':'#1f5b04 url("/public/images/FSM/bodyBg.png") no-repeat',
		'background-size':'100% 100%'
	}
	
    $('.ui-body-c').css(bodyBG);
    
    $('.ui-slider-switch').css('width','100px');
    //variable for textbox view.
    var txtBox = {
    	'width':'98%',
		'border-radius':'10px',
		'margin-left':'0px',
		'border':'1px solid #a9adb8',
		'height':'2em',
		'padding':'1%'
    }
   //Sets view of text box.
    $('#login').css(txtBox);
    $('#password').css(txtBox);
    //variable for option box view. 
    var selectBox = {
    	'width':'101%',
		'text-align':'left'
    }
    //sets option box view.
    $('.ui-select').css(selectBox);
    $('#selectBox .ui-btn').css('text-align','left');
    //variable for login lbl view.
    var loginLbl = {
    	'color':'#000',
		'text-shadow':'none',
		'padding':'0px 5px 0px 5px'
    }
    //sets login label view.
    $('.loginLbl').css(loginLbl);
    //Variable for heading view.
    var headerHeading = {
    	'margin':'1.2em 0px 0px 0px',
		'font':'23px arial'
    }
    //Sets heading view.
    $('header h1').css(headerHeading);
    //Variable for heading view in android platform
	var headerHeadingAndroid = {
    	'margin':'1.2em 0px 0px 0px',
		'font':'23px arial'
    }
	//Sets heading view in android platform.
    $('header h2').css(headerHeadingAndroid); 
    //Variable for view of workorder list item.
    var workOrderListLi = {
		'border-radius':'10px',
		'margin':'5px',
		'font-size':'30px'
    }
    //variable for default workorder view in workorder list.
    var workOrderListLiDefault = {
    	'border':'2px solid red',
    }
    //variable for workorder view when the workorder status is NEW.
    var workOrderListLiNew = {
    	'background':'-webkit-gradient(linear, left top, left bottom, from(#fdc20b),to(#b88c01))',
		'color':'#000',
		'text-shadow':'none'
    }
   //variable for workorder view when the workorder status is CLOSED.
    var workOrderListLiClosed = {
    	'background':'-webkit-gradient(linear, left top, left bottom, from(#979797),to(#423f3f))',
		'color':'#fff',
		'text-shadow':'none'
    }
    //variable for workorder view when the workorder status is OPEN.
    var workOrderListLiOpened = {
    	'background':'-webkit-gradient(linear, left top, left bottom, from(#396a00),to(#1a3000))',
		'color':'#fff',
		'text-shadow':'none'
    }
    //Sets view of the workorder list according to the requirements.
    $('#workOrderList li').css(workOrderListLi);
    $('#workOrderList li.workOrderListLiNew').css(workOrderListLiNew);
    $('#workOrderList li.workOrderListLiClosed').css(workOrderListLiClosed);
    $('#workOrderList li.workOrderListLiOpened').css(workOrderListLiOpened);
    //Variable for view of a unordered list.
    var rightRoundPanel = {
    	'background':'#fff',
		'margin':'0px',
		'border-radius':'10px',
		'border':'1px solid #ccc'
    }
   //sets the view of the unordered list.
    $('.rightRoundPanel').css(rightRoundPanel);
   //variable for view of a list item in a unordered list.
    var rightRoundPanelLi = {
    	'border':'none',
		'background':'none',
		'color':'#3d474c',
		'text-shadow':'none',
		'border-bottom':'1px solid #cacaca'
    }
    //sets the view of the list item in a unordered list
    $('.rightRoundPanel li').css(rightRoundPanelLi);
    $('.rightRoundPanel li:last').css('border','none');
    //variable for view of footer navigation bar.
    var footerNav = {
    	'background':'-webkit-gradient(linear, left top, left bottom, from(#3d3f44),color-stop(49%, #3d3f44),color-stop(50%, #2b2d30),to(#2b2d30))'
    }
    //variable for navigation bar button hover.
    var footerNavHover = {
    	'background':'-webkit-gradient(linear, left top, left bottom, from(#55585f),color-stop(49%, #55585f),color-stop(50%, #383a40),to(#383a40))',
    }
    //Sets footer features.
    $('footer ul li a').css(footerNav);
    $('footer ul li a.ui-btn-active').css(footerNavHover);
    //variable for view of header in partial or landscape mode.
    var headerTestPartial = {
    	'height':'80px',
		'background':'-webkit-gradient(linear, left top, left bottom, from(#015f9e),to(#012944))',
		'position':'fixed',
		'width':'50%',
		'z-index':'9999'
    }
    //sets header properties
    $('.headerPartial').css(headerTestPartial);
    //variable for view of header in full or Portrait mode.
    var headerTestFull = {
    	'position':'fixed',
		'top':'0px',
    	'height':'80px',
		'background':'-webkit-gradient(linear, left top, left bottom, from(#015f9e),to(#012944))',
		'width':'100%',
		'z-index':'9999'
    }
    //sets header properties
    $('.headerFull').css(headerTestFull);
    //Variable for header view of map page.
	var headerMap = {
    	'height':'70px',
		'background':'-webkit-gradient(linear, left top, left bottom, from(#015f9e),to(#012944))',
    }
	//sets the header view.
    $('.headerMap').css(headerMap);
    //variable for footer view in partial or landscape mode.
    var footerTestPartial = {
	    'position':'fixed',
	    'bottom':'0px',
	    'width':'50%',
		'height':'70px',
		'background':'#333 -webkit-gradient(linear, 0% 0%, 0% 100%, from(#555), to(#333))'
	}
    //sets footer properties.    
	$('.footerPartial').css(footerTestPartial);
	
	$('.leftSection .footerPartial li').css('width','150px');
	//Variable for footer view in full or Portrait mode.
	var footerTestFull = {
	    'position':'fixed',
	    'bottom':'0px',
	    'width':'100%'
	}
	//sets footer properties.    
	$('.footerFull').css(footerTestFull);
	//variable for calender box view in partial or landscape mode.
	var calenderBoxTestPartial = {
		'position':'fixed',
	    'top':'81px',
	    'width':'50%',
		'z-index':'9999',
		'height':'50px'
	}
	//sets calender box properties.
	$('#calenderBoxPartial').css(calenderBoxTestPartial);
	//variable for calender box view in full or portrait mode.
	var calenderBoxTestFull = {
		'position':'fixed',
		'top':'81px',
	    'width':'100%',
		'z-index':'9999',
		'height':'50px'
	}
	//sets calender box properties.
	$('#calenderBoxFull').css(calenderBoxTestFull);
	//variable to centralize the content of calender box .
	var contentCntrTest = {
		'margin-top':'130px',
		'padding-bottom':'70px'
	}
	//Centralize the content of calender box.
	$('#contentCntrFull').css(contentCntrTest);
	$('#contentCntrPartial').css(contentCntrTest);
	//variable to centralize the content of workorder details. 
	var detailCntrTest = {
		'margin-top':'85px'
	}
	//centralize the content of details description in protrait and landscape mode.
	$('.detailCntrFull').css(detailCntrTest);
	$('.detailCntrPartial').css(detailCntrTest);

	var checkbox = {
    	'position' : 'absolute',
		'left' : '0px',
		'top'  : '45%'
    }
    $('.ui-checkbox').css(checkbox);
	
});

