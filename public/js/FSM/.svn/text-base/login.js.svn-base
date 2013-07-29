/*
 Performs all the validations on the login Page.
 @author : Sonali Banerjee, Mohit Raheja, Nandan Thareja
 @version: 1.0
 */

//Performs Username,Password values ,and the remember me status validations and submits the login form.
function loginfunc() {
	var user = document.forms["formLogin"]["login"].value;
	var password = document.forms["formLogin"]["password"].value;
	var chkd = document.forms["formLogin"]["remember"].value;
	if (user.length == 0)
		$.get("/app/WorkOrder/alerts", { "msg": "Please enter Username", "title": "FSM" });
	else if (password.length == 0)
		$.get("/app/WorkOrder/alerts", { "msg": "Please enter Password", "title": "FSM" });
	else
		document.getElementById('formLogin').submit();
	end
}

//Resets the login page fields to default values on 'RESET' button click .
function resetfunc() {
	document.forms["formLogin"]["login"].value = "";
	document.forms["formLogin"]["password"].value = "";
	$("#remember").val("false").slider("refresh");
	$.get("/app/LoginModule/clearValues", { });
	return false;
}

//Preserves the values of login page fields on orientation change.
function setValuesOnChange() {
	var loginId = document.getElementById("login").value;
	var Password = document.getElementById("password").value;
	$.get("/app/LoginModule/setValuesOnChange", { loginid: loginId, password: Password });
}

//Preserves the value of remember me option box on orientation change.
function value_change(obj) {
	var item = obj.id;
	var select_id = document.getElementById(item);
	c_val = select_id.options[select_id.selectedIndex].value;
	$.get("/app/LoginModule/get_Values", {"value": c_val});
}
