=begin
    Contains general Methods that are used in the entire application.
    @author: Mohit Raheja
    @version: 1.0
=end

module BrowserHelper
  
  # Performs the task of placing the place holder in the text fields. 
  def placeholder(label=nil)
    "placeholder='#{label}'" if platform == 'apple'
  end

  # Finds the platform for all the devices. 
  def platform
    System::get_property('platform')
  end

  def selected(option_value,object_value)
    "selected=\"yes\"" if option_value == object_value
  end

  def checked(option_value,object_value)
    "checked=\"yes\"" if option_value == object_value
  end

  def is_bb6
    platform == 'blackberry' && (System::get_property('os_version').split('.')[0].to_i >= 6)
  end

   # finds the orientation of a device (landscape or portrait)
  def orientation
    System::get_property('screen_orientation').to_s
  end

  # find the selected customer in the work order list popup from the Customer Local DB.
  def find_select_customer(c_id)
    Customer.find(:all,:select => ['C_Address','C_Name'],:conditions => {:C_Id => c_id})
  end

  # Performs date formating in a specific format.
  def get_formatted_hours(stdTime)
    time = stdTime.split('-')
    hours = time[0].to_i
    if hours > 12
      hours = hours - 12
      hours = hours.to_s + ":" + time[1].to_s + "pm"
    else
      hours = hours.to_s + ":" + time[1].to_s + "am"
    end
  end

  # Find the photos associated with a workorder from workorder model local DB.
  def find_workorderPhotos(wo_id)
    WorkOrderPhotos.find(:all,:conditions => {:WO_Id => wo_id})
  end
  
  # Find the customer from Customer model local DB.
  def find_customer(c_id)
    Customer.find(:all,:conditions => {:C_Id => c_id})
  end

 #find the parts for a work order.
  def find_workorderParts(wo_id)
    WorkOrderParts.find(:all,:conditions => {:WO_Id => wo_id})
  end

  #Sorts the work order list according to the workorder status.
  def sorted_work_orders(date,user)
    workOrders = WorkOrder.find(:all,:conditions => {:WO_CreatedDate => date, :WO_CreatedBy => user})
    wo_new = []
    wo_open = []
    wo_closed = []
    workOrders.each do |wo|
      if wo.WO_Status == "New"
        wo_new << wo
      elsif wo.WO_Status == "Open"
        wo_open << wo
      else
        wo_closed << wo
      end
    end
    sorted_wo = wo_new.concat(wo_open)
    sorted_wo = sorted_wo.concat(wo_closed)
    #    return sorted_wo
  end

  #retrieves the previous date on left arrow click of the Calender box.
  def get_previous_date(current_date,date)
    date = date.gsub(",","")
    date = date.gsub(" ","-")
    arr = date.split("-")
    if !(current_date.mday == 1)
      newDay = arr[2].to_i - 1
      if newDay < 10
        newDay = "0" + newDay.to_s()
      end
      new_date = arr[1] + "-" + newDay.to_s() + "-" + arr[3]
    else
      new_date = arr[1] + "-" + arr[2]+ "-" + arr[3]
    end
  end

  #retrieves the next date on the right arrow click of the calender box
  def get_next_date(current_date,date)
    date = date.gsub(",","")
    date = date.gsub(" ","-")
    arr = date.split("-")
    if !((current_date.mday == 31 && (current_date.mon == 1 || current_date.mon == 3 || current_date.mon == 5 || current_date.mon ==  7 || current_date.mon == 8 || current_date.mon == 10 || current_date.mon == 12)) || (current_date.mday == 30 && (current_date.mon == 4 || current_date.mon == 6 || current_date.mon == 9 || current_date.mon ==  11)) ||  (current_date.mday == 28 && current_date.mon == 2))
      newDay = arr[2].to_i + 1
      if newDay < 10
        newDay = "0" + newDay.to_s()
      end
      newDate = arr[1] + "-" + newDay.to_s() + "-" + arr[3]
    else
      newDate = arr[1] + "-" + arr[2]+ "-" + arr[3]
    end
  end

  # formats the date retrieved in the desired format.
  def get_formatted_date(date)
    date = date.gsub(",","")
    date = date.gsub(" ","-")
    arr = date.split("-")
    new_date = arr[1] + "-" + arr[2] + "-" + arr[3]
  end
  
  #fetching the screen width
  def get_ScreenWidth
    System::get_property('screen_width')
  end
  
  #fetching the screen height
  def get_ScreenHeight
    System::get_property('screen_height')
  end
  
  #fetching the part from inventory
  def inventoryParts(part_id)
    Parts.find(:all,:conditions => {:Parts_Id => part_id})
  end
end