require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'json'
require 'date'

=begin
   Controller that Performs the task of Create Work Order and Preserving the drop down menu and text area.
   @author : Rajbeer Kaur,Mohit Raheja.
   @version : 1.0
=end

class CustomerController < Rho::RhoController
  include BrowserHelper
  
  # Opens the create Workorder Page with the customer names loaded in the first drop down menu.
  def createWO
    $page = "create"
    @customers = Customer.find(:all,:select => ["C_Name"])       #Retrieve the Customer Name from Customer Local DB.
    render :action => :createWO                                 #Navigating to create workorder page.
  end
  
  # Retrieves the customer location on the basis of selected customer name.
  def get_Locations
    c_name = @params['C_Name']
    locations = Customer.find(:all,:select => ["C_Address","C_Id"],:conditions => {:C_Name => c_name})
    location = []
    city = []
    locations.each do |loc|
      city = loc.C_Address.split(',')
      location << loc.C_Id.to_s() + ":" + city[1].strip + ":" + city[2].strip
    end
    render :string => location.to_json, :use_layout_on_ajax => true
  end
  
  #Create new workorder and gives a acknowledgement.
  def do_createWO
      wo = WorkOrder.find(:all).last
      if(wo.class.to_s == "NilClass")
        wo_id = "1111"
      else
        wo_id = wo.WO_Id.to_i + 1
      end
      c_id = @params["C_ID"]
      wo_type = @params["WO_Type"]
      wo_desc = @params["WO_Desc"]
      wo_status = "New"
      create_date = Date.today.strftime('%m-%d-%Y').to_s
      create_time = Time.now.strftime("%H-%M-%S").to_s
      created_by = $user
      wo = WorkOrder.create({:WO_Id => wo_id,:C_Id => c_id,:WO_Type => wo_type,:WO_Desc => wo_desc,:WO_Status => wo_status,:WO_CreatedDate => create_date,:WO_CreatedTime => create_time,:WO_CreatedBy => created_by,:WO_ContactName => "",:WO_ContactSignaturePath => ""})
      $selectedTab = "Details"
      $values = {}
      Alert.show_popup({:message => 'New Work Order is created',:title => 'FSM ( '+ wo_id.to_s() + ' )',:buttons => [' OK '],:callback => url_for(:controller => :WorkOrder,:action => :toWorkOrderList, :query => {"value" => "false"}) } )

  end
  
  #Method preserves the values of the dropdown menu on the create workorder page,on orientation change.
  def get_Values
    id = @params["value"]
    arr = id.split('-') 
    $values[arr[0]] = arr[1]
  end
  
  #Preserving the value of the text area for the description field on the create workorder Page.
  def text_values
    $values["textArea"] = @params["value"]
  end
  
  #Clearing the value of all the fields on the create workorder page.
  def clear_all
    $values = {}
  end

end
