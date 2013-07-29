/*
   Performs all the validation of create workorder page.
   @author: Mohit Raheja.
   @version: 1.0 
*/

//Clear the description field and option boxes on clear button click on CREATE WORKORDER PAGE 
function clearFieldsCreateWO()
{
  $("#textArea").val('');
  $('#WO_customer')[0].selectedIndex = 0;
  $('#WO_customer').change();
  $("#WO_loc").selectmenu('refresh');
  $('#WO_type')[0].selectedIndex = 0;
  $('#WO_type').change();
  $.get("/app/Customer/clear_all",{});
}

//Changes the value of the option boxes accordingly with Customer Name change on CREATE WORKORDER PAGE. 
function C_nameChange(selectObj)
{
  var id = selectObj.id;
  var c_val = $('#WO_customer>option:selected').val();
  val = id + "-" + c_val;
  $.get("/app/Customer/get_Values",{"value":val});
  $("#WO_loc option:gt(0)").remove();
  if(c_val != "-1")
    {
      var c_name = $('#WO_customer>option:selected').text();
      $.get("/app/Customer/get_Locations",{"C_Name":c_name},function(data) {
        data =JSON.parse(data);
        var loc = ""; 
        var html = "";
        for(var i=0;i<data.length;i++)
         {
           loc = data[i].split(":");
           html = html + "<option value='"+ loc[0] +"'>"+ loc[1] + ", " + loc[2] +"</option>";
         }
        $("#WO_loc").append(html);
      });
  }
  $("#WO_loc").selectmenu('refresh');
  
}

//Checks whether any field is empty on the create workorder page and creates the workorder on CREATE WORKORDER PAGE.
function createWO()
{
  var c_name = $('#WO_customer>option:selected').val();
  var c_id = $('#WO_loc>option:selected').val();
  var wo_type = $('#WO_type>option:selected').val();
  var desc = $("#textArea").val();
  if(c_name == "-1")
    $.get("/app/WorkOrder/alerts",{"msg":"Please select Customer","title":"FSM"});
  else if(c_id == "-1")
    $.get("/app/WorkOrder/alerts",{"msg":"Please select Location","title":"FSM"});
  else if(wo_type == "-1")
    $.get("/app/WorkOrder/alerts",{"msg":"Please select Work Order Type","title":"FSM"});
  else if(desc == "")
    $.get("/app/WorkOrder/alerts",{"msg":"Please type Description","title":"FSM"});
  else
      $.get("/app/Customer/do_createWO",{"C_ID":c_id,"WO_Type":wo_type,"WO_Desc":desc});
}

//Preserves the Workorder description value on orientation change.
function desc_change(obj) {
    var keyed = obj.value;
    $.get("/app/Customer/text_values",{"value":keyed});
}

