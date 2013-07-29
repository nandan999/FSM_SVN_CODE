require 'rho/rhocontroller'
require 'helpers/browser_helper'
require 'date'
require 'pyramidCompLibrary/geoComponents'
require 'pyramidCompLibrary/hardwareComponents'
require 'pyramidCompLibrary/signatureComponents'
require 'base64'
require 'json'

=begin
  Performs the task of managing all the functions that are needed to fulfill the requirements of a specific workorder and other workorders.
  @author: Mohit Raheja, Nandan Thareja, Rajbeer Kaur.
  @version : 1.0
=end

class WorkOrderController < Rho::RhoController
  include BrowserHelper
  include GeoComponents
  include HardwareComponents
  include SignatureComponents
  #Sets the signature window at the calculated Position on CLOSE TAB.
  def call_set_rect
    if orientation == "portrait"
      @@width=get_ScreenWidth.to_i/2
      @@height=get_ScreenHeight.to_i/2
      @@left=@@width/2
      @@top=@@height/2
    else
      @@width=get_ScreenWidth.to_i/2
      @@height=get_ScreenHeight.to_i/2
      @@left=@@width/2
      @@top=@@height/4
    end
    set_rect(0xFFFF0000,2,0xffffffff,"jpg",@@left,@@top,@@width,@@height)
  end

  #Removes the signature window.
  def call_remove_rect
    remove_rect
  end

  #Clear the values of contact name on close workorder page on CLOSE TAB
  def do_clear
    $values['contact_name'] = ''
  end

  #Clears the signature value on clear button click on CLOSE TAB.
  def sign_clear
    signature_clear()
  end

  #Capture the inline  signature on check button click on CLOSE TAB.
  def do_capture
    inlinesign("WorkOrder","capture_callback")
  end

  #inline signature capture callback method on CLOSE TAB.
  def capture_callback
    if @params['status']== 'ok'
      @signature=WorkOrder.new({'signature_uri'=>@params['signature_uri']})
      @sign= Rho::RhoApplication::get_blob_path(@signature.signature_uri)
      image_uri = @params['signature_uri']
      image_base64 = Base64.encode64(open(Rho::RhoApplication::get_blob_path(image_uri.strip)) { |io| io.read })
      @filter_image = image_base64.gsub(/\r/,"").gsub(/\n/,"")
      @sizes=@filter_image.length
      if(platform == "APPLE")
        if !$phone && @sizes <= 8124
          Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
        elsif $phone && @sizes <= 2356
          Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
        else
          @find=WorkOrder.find(:first,:conditions =>{:WO_Id=>$woDefault.WO_Id, :WO_CreatedBy => $user})
          $woDefault = @find
          @find.update_attributes({"WO_ContactSignaturePath"=>@sign})
        end
      elsif platform != "APPLE"
        if !$phone && ((@sizes <= 1788 && orientation == "landscape") || (@sizes <= 2360 && orientation == "portrait"))
          Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
        elsif $phone && $device == "nexus" && ((@sizes <= 2300 && orientation == "landscape") || (@sizes <= 2900 && orientation == "portrait"))
          Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
        elsif $phone && ((@sizes <= 1264 && orientation == "landscape") || (@sizes <= 1672 && orientation == "portrait"))
          Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
        else
          @find=WorkOrder.find(:first,:conditions =>{:WO_Id=>$woDefault.WO_Id, :WO_CreatedBy => $user})
          $woDefault = @find
          @find.update_attributes({"WO_ContactSignaturePath"=>@sign})
        end
      end
      if !$phone
        WebView.navigate(url_for(:action =>:list, :query => {"wo_click" => "true","orientation_change" => "true"}))
      else
        WebView.navigate(url_for(:action =>:detail, :query => {"orientation_change" => "true"}))
      end
    end
  end

  #Closes the workorder on done button click on CLOSE TAB.
  def do_close
    @@status = @params["Status"]
    @@id = @params['WO_id']
    @@name = @params['contactName']
    if $woDefault.WO_ContactSignaturePath != ""
      @find=WorkOrder.find(:all,:conditions =>{:WO_Id=>@@id,:WO_CreatedBy => $user})
      @find[0].update_attributes({"WO_Status"=>@@status,"WO_ContactName"=>@@name})
      $values = {}
      Alert.show_popup({:message => 'Work Order is completed',:title => 'FSM',:buttons => [' OK '],:callback => url_for(:action => :toWorkOrderList, :query => {"value" => "false"}) } )
    else
      Alert.show_popup({ :message => 'Please enter Signature',:title => 'FSM',:buttons => ["OK"]})
    end
  end

  #Navigates to account page
  def to_account
    value = @params['value']
    $page = "list"
    render :action => :list, :query => {"wo_click" => value}
  end

  #Navigates to workorder list.
  def toWorkOrderList
    value = @params['value']
    WebView.navigate(url_for(:action => :list, :query => {"wo_click" => value}))
  end

  #Performs the task of pagination for the Workorder list popup in Portrait mode and displaying a list in Landscape mode .
  def list
    $page = "list"
    if @params["wo_click"] != "true"
      $selectedTab = "Details"
      $records = nil
      $photos_group = 0
      if !$phone && orientation == "portrait"
        $woPopUpVal = WorkOrder.paginate(:page => 0, :per_page => 3, :conditions =>  {"WO_CreatedDate"=>Date.today.strftime('%m-%d-%Y').to_s, :WO_CreatedBy => $user})
        if $woPopUpVal == []
          $woDefault = nil
        else
          $woDefault = $woPopUpVal[0]
        end
      else
        $woValue = sorted_work_orders(Date.today.strftime('%m-%d-%Y').to_s,$user)
        if $woValue == []
          $woDefault = nil
        else
          $woDefault = $woValue[0]
        end
      end
    end
    @date = @params["date"]
  end

  #Changes the status of a particular work order on on touch event of the workorder in workorder list.
  def status_Change(wo_No,currentDate)
    @woValue = WorkOrder.find(:first, :conditions =>  {"WO_Id"=>wo_No, :WO_CreatedBy => $user})
    $woDefault = @woValue
    @date = "search"
    if $woDefault.WO_Status == "New"
      @woValue.update_attributes({"WO_Status" => "Open"})
    end
    if !$phone && orientation == "portrait"
      $woPopUpVal = WorkOrder.paginate(:page => $records, :per_page => 3, :conditions =>  {"WO_CreatedDate"=>currentDate.to_s, :WO_CreatedBy => $user})
    else
      $woValue = sorted_work_orders(currentDate.to_s,$user)
    end
  end
  
  #open Work Order on changing the tab
  def open_WorkOrder
    wo_No = $woDefault.WO_Id
    currentDate=get_formatted_date($displayDate)
    status_Change(wo_No,currentDate)
    WebView.navigate(url_for(:controller => :WorkOrder, :action => :list, :query => {"wo_click" => "true", "date" => "search"}))
  end

  #Performs the task of fetching the details of a workorder and display them on DETAIL TAB.
  def fetchDetails
    $values = {}
    $photos_group = 0
    wo_No = @params["status"]
    currentDate=get_formatted_date($displayDate)
    status_Change(wo_No,currentDate)
    $selectedTab = "Details"
    $photosPage = "PhotosEdit"
    $partsPage = "PartsEdit"
    if $phone
      render :action => :detail
    else
      render :action => :list
    end
  end

  #Fetch the details of workorders based on various dates.
  def fetch_DateDetails
    $values = {}
    $records = nil
    $selectedTab = "Details"
    $photos_group = 0
    $photosPage = "PhotosEdit"
    $partsPage = "PartsEdit"
    date = @params["status"]
    value = @params["value"]
    page = @params["page"]
    currentDate=Date.strptime(get_formatted_date(date),"%m-%d-%Y")
    if value == "left"
      @newDate = get_previous_date(currentDate,date)
    else
      @newDate = get_next_date(currentDate,date)
    end
    if page == "main"
      $woValue = sorted_work_orders(@newDate,$user)
      if $woValue == []
        $woDefault = nil
        @fetchDate = @newDate
      else
        $woDefault = $woValue[0]
        @fetchDate = $woDefault.WO_CreatedDate
      end
    else
      $woPopUpVal = WorkOrder.paginate(:page => $records, :per_page => 3, :conditions =>  {"WO_CreatedDate"=>@newDate, :WO_CreatedBy => $user})
      if $woPopUpVal == []
        $woDefault = nil
        @fetchDate = @newDate
      else
        $woDefault = $woPopUpVal[0]
        @fetchDate = $woDefault.WO_CreatedDate
      end
    end
    @formattedDate = Date.strptime(@fetchDate,"%m-%d-%Y")
    $displayDate = @formattedDate.strftime('%a, %m %d, %Y').to_s
    @date = "search"

    if page == "main"
      render :action => :list #, :query => {"wo_click" => "true", "date" => "search", "displayDate" => @displayDate}
    else
      @display_popup = "true"
      render :action => :list #, :query => {"wo_click" => "true", "date" => "search", "displayDate" => @displayDate, "display_popup" => "true"}
    end
  end

  #retrieves and loads the details of the workorders in the popup list in portrait mode on DETAILS TAB.
  def nextDetails
    $values = {}
    value = @params["value"]
    date = @params["status"]
    newDate = get_formatted_date(date)
    if value == "next"
      if $woPopUpVal != []
        $records = $records + 1
      end
    else
      $records = $records - 1
    end
    if $records != -1
      $woPopUpVal = WorkOrder.paginate(:page => $records, :per_page => 3, :conditions =>  {"WO_CreatedDate"=>newDate, :WO_CreatedBy => $user})
    else
      $records = nil
    end
    if $woPopUpVal == []
      $woDefault = nil
    else
      $woDefault = $woPopUpVal[0]
    end
    @displayDate = date
    @date = "search"
    @display_popup = "true"
    render :action => :list
  end

  #shows a confirmation popup on logout button touch and navigates on the login page on receiving a positive input on LOGOUT TAB.
  def to_logout
    Alert.show_popup({:message => 'Are you sure you want to logout?',:title => 'Confirm',:buttons => ['Yes','No'],:callback => url_for(:action => :logout) } )
  end

  #Logs out a already logged in user and sets the value of the username field accordingly to the remember me status on LOGOUT TAB.
  def logout
    response = @params['button_id']
    if response == "Yes"
      $user=""
      $values = {}
      @@chkd_auth=LoginModule.find(:all, :conditions =>{:U_Remember=>"true"})
      if(@@chkd_auth.length==0)
        WebView.navigate(url_for(:controller => :LoginModule, :action => :loginpage))
      elsif(@@chkd_auth.length>0)
        @user=@@chkd_auth[0].U_Name
        WebView.navigate(url_for(:controller => :LoginModule, :action => :loginpage, :query=> {:user => @user}))
      end
    end
  end

  #shows a confirmation popup,if a photo is to be deleted on delete icon click on  PHOTOS TAB
  def delete_photo
    photo_date = @params['photo_date']
    photo_time = @params['photo_time']
    photo_id = @params['photo_id']
    Alert.show_popup({:message => 'Are you sure you want to delete this Photo ( ' + photo_date + ' ' + photo_time + ' )?',:title => 'Confirm',:buttons => ['Yes','No'],:callback => url_for(:action => :confirm_delete_photos , :query => {"photo_id" => photo_id}) } )
  end

  #deletes a photo from the workorder model local DB in case of positive input in the confirmation popup on PHOTOS TAB.
  def confirm_delete_photos
    response = @params['button_id']
    photo_id = @params['photo_id']
    if(response == "Yes")
      $photos_group = 0
      WorkOrderPhotos.delete_all(:conditions => {:Photos_Id => photo_id})
      @photos = WorkOrderPhotos.find(:all,:conditions => {:WO_Id => $woDefault.WO_Id})
      if(@photos==[])
        value = "true"
      else
        value="false"
      end
      WebView.execute_js('refresh_photos_section("' + value + '");')
    end
  end

 #performs the task of pagination for displaying the photos list in landscape mode on PHOTOS TAB.
  def get_photos
    if $photos_group == nil
      $photos_group = 0
    end
    value = @params['value']
    if value == "next"
      $photos_group  = $photos_group + 1
    elsif value == "previous"
      $photos_group  = $photos_group - 1
    end
    @photosShow = WorkOrderPhotos.paginate(:page => $photos_group, :per_page => $photosPerPage,:select => ["Photos_Id"], :conditions =>  {:WO_Id => $woDefault.WO_Id})
    photosId = []
    @photosShow.each do |photo|
      photosId << photo.Photos_Id
    end
    render :string => photosId.to_json, :use_layout_on_ajax => true
  end

  #Performs the task of capturing a photo on PHOTOS TAB.
  def add_photos
    camera_click("WorkOrder","camera_callback")
  end

  #Stores the captured photo in workorder model local DB for a specified workorder on PHOTOS TAB.
  def camera_callback
    if @params['status'] == 'ok'
      image_uri = @params['image_uri']
      create_date = Date.today.strftime('%m-%d-%Y').to_s
      create_time = Time.now.strftime("%H-%M-%S").to_s
      photos = WorkOrderPhotos.find(:all).last
      if(photos.class.to_s == "NilClass")
        photo_id = "1"
      else
        photo_id = photos.Photos_Id.to_i + 1
      end
      $photos_group = 0
      WorkOrderPhotos.create({:WO_Id => $woDefault.WO_Id ,:Photos_Id => photo_id,:Photos_Path => image_uri,:Photos_Date => create_date,:Photos_Time => create_time})
      WebView.execute_js('$("#photosMain").load(location.href + " #photosDiv");')
    end
  end

 #performs the task of changing the tab value on tab change.
  def change_tab
    $selectedTab = @params["tab"]
  end

 #Method for preserving the current view of PHOTOS TAB on orientation change.
  def change_photos_page
    $photosPage = @params["page"]
  end

  #sets the current view of PHOTOS TAB on orientation change.
  def get_photos_page
    render :string => $photosPage.to_s(), :use_layout_on_ajax => true
  end

  #Performs the task of showing popup with specific title and message in the entire application .
  def alerts
    $values = {}
    msg = @params['msg'].to_s
    title = @params['title'].to_s
    Alert.show_popup(:message => msg,:title => title,:buttons => ['OK'])
    if msg == "Please enter Username"
      WebView.execute_js("setFocus('login');")
    elsif msg == "Please enter Password"
      WebView.execute_js("setFocus('password');")
    elsif msg == "Please type Description"
      WebView.execute_js("setFocus('textArea');")
    end
  end

  #Display map with multiple location for Multiple workorders
  def map_view
    selectedDate = @params['date']
    newDate = get_formatted_date(selectedDate)
    wo = sorted_work_orders(newDate,$user)
    stops = []
    if wo == []
      Alert.show_popup({ :message => "No Work Orders Found",:title => 'FSM',:buttons => ["OK"]})
      render :action => :list
    else
      wo.each do |work_order|
        c_address = Customer.find(:first,:select => ["C_Address"],:conditions => {:C_Id => work_order.C_Id})
        stops << c_address.C_Address.to_s
      end
      initialStop = stops[0].inspect
      page = "Map View"
      loc = "{}"
      $mapValues = {'initialStop' => initialStop, 'currentLocation' => loc, 'pageValue' => page, 'stops' => stops}
      render :action => :map
    end
  end

  #Display map with Location of a Workorder from the current location
  def direction
    header = @params['Header']
    count = @params["count"].to_i

    if header == "Account"
      c_id = $customer[count].C_Id
    elsif header == "My Work Order_popup"
      c_id = $woPopUpVal[count].C_Id
    else
      c_id = $woValue[count].C_Id
    end
    c_address = Customer.find(:first,:select => ["C_Address"],:conditions => {:C_Id => c_id})
    stops = []
    stops << c_address.C_Address.to_s
    initialStop = stops[0].inspect
    # current_longitude = geolongitude()
    # current_latitude = geolatitude()
    current_longitude ="-117.185"
    current_latitude ="34.065"
    loc = "{'x':'#{current_longitude}','y':'#{current_latitude}'}"
    if  header == "Account"
      page = "Direction_AC"
    else
      page = "Direction_WO"
    end
    $mapValues = {'initialStop' => initialStop, 'currentLocation' => loc, 'pageValue' => page, 'stops' => stops}
    render :action => :map
  end

  #Navigates the user to details page for workorder description.
  def detail
    render :action => :detail
  end

  #performs the task of retrieving the selected workorder details on work order click.
  def get_selected_wo
    val = "true"
    if $woDefault!= nil
      if $woDefault.WO_Status == "New" || $woDefault.WO_Status == "Open"
        val = "false"
      end
    end
    render :string => val, :use_layout_on_ajax => true
  end

 #Performs the task of reading a barcode,on scan button click on PARTS TAB
  def takeBarcode
    @@checkValue = @params['codeCheck'].to_s()
    @@partcodeboxVal = @params['partcodeboxVal'].to_s()
    @@serialcodeboxVal = @params['serialcodeboxVal'].to_s()
    read_barcode("WorkOrder", "take_barcode_callback")
  end

 #Performs the task of checking the focus of a particular text field ,checking if the scanning is done properly,and saving a barcode value on PARTS TAB.
  def take_barcode_callback
    @partcode = ""
    @serialcode = ""
    code = ""
    status=@params['status']
    if status == 'ok'
      if @@checkValue == "partcode"
        @partcode = @params['barcode']
        code = @partcode
      elsif @@checkValue == "serialcode"
        @serialcode = @params['barcode']
        code = @serialcode
      end
      if @params['scanner_source'] == 'camera'
        imagevalue = @params['image_uri']
        if @@checkValue == "partcode"
          @partcode = showbarcode(imagevalue)
          code = @partcode
        elsif @@checkValue == "serialcode"
          @serialcode = showbarcode(imagevalue)
          code = @serialcode
        end
      end
      if (@@checkValue == "partcode" && @partcode == "") || (@@checkValue == "serialcode" && @serialcode == "")
        Alert.show_popup({ :message => 'Please rescan barcode',:title => 'FSM',:buttons => ["OK"]})
      end
    end
    if code == @partcode
      WebView.navigate(url_for(:action => :to_list, :query =>{:pageValue => "Parts",:codeValuePart => @partcode}))
    elsif code == @serialcode
      WebView.navigate(url_for(:action => :to_list, :query =>{:pageValue => "Parts",:codeValueSerial => @serialcode}))
    end
  end

 #Carries the barcode value for setting it in the text fields and preserves the barcode value on orientation change on PARTS TAB
  def to_list
    $values = {}
    @pageValue = @params['pageValue']
    @partcodeValue = @params['codeValuePart']
    @seriacodeValue = @params['codeValueSerial']
    contactName = @params['contact_name']
    @checkValue = @@checkValue
    @partcodeboxVal = @@partcodeboxVal
    @serialcodeboxVal = @@serialcodeboxVal
    if @@partcodeboxVal != "" && @@serialcodeboxVal == ""
      $values['PartbarcodeValue'] = @partcodeboxVal
      $values['PartSerialValue'] = @seriacodeValue
      $values['contact_name'] = contactName
    elsif @@partcodeboxVal == "" && @@serialcodeboxVal != ""
      $values['PartbarcodeValue'] = @partcodeValue
      $values['PartSerialValue'] = @serialcodeboxVal
      $values['contact_name'] = contactName
    else
      $values['PartbarcodeValue'] = @partcodeValue
      $values['PartSerialValue'] = @seriacodeValue
      $values['contact_name'] = contactName
    end

    if $phone
      render :action => :detail
    else
      render :action => :list
    end
  end

 #Checks the availability of part in the inventory and if available,adds it to the selected Workorder,and navigates to Parts List on PARTS TAB.
  def add_parts
    partNumber = @params['part_number']
    serialNumber = @params['serial_number']

    if partNumber != "" && serialNumber == ""
      parts_check = Parts.find(:first,:conditions=>{:Parts_Number=>partNumber})
    elsif partNumber == "" && serialNumber != ""
      parts_check = Parts.find(:first,:conditions => {:Parts_SerialNumber => serialNumber})
    else
      parts_check = Parts.find(:first,:conditions => {:Parts_Number => partNumber,:Parts_SerialNumber => serialNumber})
    end

    if parts_check == nil
      Alert.show_popup({ :message => 'Part not found',:title => 'FSM',:buttons => ["OK"]})
    elsif parts_check != []
      p_id = parts_check.Parts_Id
      checkPart = WorkOrderParts.find(:all,:conditions => {:WO_Id =>  $woDefault.WO_Id,:Parts_Id => p_id})
      if checkPart == []
        WorkOrderParts.create({:WO_Id =>  $woDefault.WO_Id,:Parts_Id => p_id})
        $partsPage = "PartsEdit"
      else
        Alert.show_popup({ :message => 'Part already added',:title => 'FSM',:buttons => ["OK"]})
      end
    end
    $values = {}
    if $phone
      WebView.navigate(url_for(:action => :detail))
    else
      WebView.navigate(url_for(:action => :list, :query => {"wo_click" => "true"}))
    end
  end

  #Updates the parts List and Performs the task of pagination in Landscape mode on PARTS TAB.
  def update_parts
    value = @params['value']
    if value == "next"
      $parts_group  = $parts_group + 1
    elsif value == "previous"
      if $parts_group != 0
        $parts_group  = $parts_group - 1
      end
    end
    @partsShow = WorkOrderParts.paginate(:page => $parts_group, :per_page => $partsPerPage ,:select => ["Parts_Id"], :conditions =>  {:WO_Id => $woDefault.WO_Id})
    part_id = []
    @partsShow.each do |part|
      part_id << part.Parts_Id
    end
    render :string => part_id.to_json ,:use_layout_on_ajax => true
  end

  #Shows a Confirmation popup,if a particular part is to be deleted on delete icon click on PARTS TAB.
  def deletePart
    partIndex = @params['partvalue']
    Alert.show_popup({:message => 'Are you sure you want to delete this part?',:title => 'Confirm',:buttons => ['Yes','No'],:callback => url_for(:action => :confirm_deletePart , :query => {"partIndex" => partIndex}) } )
  end

  #Deletes a Part on a Positive confirmation made and updates the part list on PARTS TAB.
  def confirm_deletePart
    response = @params['button_id']
    if response == 'Yes'
      partValue = @params['partIndex']
      part_id = Parts.find(:all,:select => ['Parts_Id'],:conditions => {:Parts_Number => partValue})
      part_id = part_id[0].Parts_Id
      deleteDone = WorkOrderParts.delete_all(:conditions => {:WO_Id =>  $woDefault.WO_Id, :Parts_Id => part_id})
      workOrderParts = WorkOrderParts.find(:all,:conditions => {:WO_Id => $woDefault.WO_Id})
      if workOrderParts.empty?
        WebView.execute_js('refresh_part_list("true");')
      else
        WebView.execute_js('refresh_part_list("false");')
      end
    end
  end

 #Method for preserving the current view of PARTS TAB on orientation change on PARTS TAB.
  def change_parts_page
    $partsPage = @params["page"]
  end

  #sets the current view of PARTS TAB on orientation change
  def get_parts_page
    render :string => $partsPage.to_s(), :use_layout_on_ajax => true
  end

 #Preserving the values of the part no and serial no text fields on orientation change on PARTS TAB.
  def setValuesOnChange
    retain_val = @params["value"]
    arr = retain_val.split('-')
    $values[arr[0]] = arr[1]
  end

  #Clears the barcode values on clear button click on parts list page on PARTS TAB
  def clear_values
    $values['PartbarcodeValue'] = ''
    $values['PartSerialValue'] = ''
  end

  #--------------------------------------------------------------------------------------------------------------------#

end
