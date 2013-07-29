require 'rho/rhoapplication'
require 'date'

class AppApplication < Rho::RhoApplication
  def initialize
    # Tab items are loaded left->right, @tabs[0] is leftmost tab in the tab-bar
    # Super must be called *after* settings @tabs!
    @tabs = nil
    #To remove default toolbar uncomment next line:
    @@toolbar = nil

    # Customizing functionalities of the default menu.
    @default_menu = {
      "Home" => "/app/Settings/Home",
      "Refresh" => :refresh,
      "Options" => :options,
      "Close" => :close
    }
    super

    # Calculating Screen Resolution of multiple devices
    width = System::get_property('screen_width').to_i
    height = System::get_property('screen_height').to_i
    if (width > 1100 || height > 1100) && System::get_property('platform') == 'ANDROID'
      $device = "nexus"
    end
    ppi = System::get_property('ppi_x').to_i
    diagonal = Math.sqrt(width**2 + height**2)/ppi

    #Initializing a variable for Pagination Task.
    $parts_group = 0
    #Initializing a variable for preserving text box values.
    $values = {}
    #Differentiating between Phone and Tablet device
    $phone = diagonal < 7 ? true : false
    #Initializing no of elements to be displayed in Apple Platform for Photos and Parts-Landscape Mode.
    if System::get_property('platform') == 'APPLE'
      $partsPerPage = 6
      $photosPerPage = 6
      #Initializing no of elements to be displayed in Android Platform for Photos and Parts-Landscape Mode.
    elsif System::get_property('platform') == 'ANDROID'
      $partsPerPage = 4
      $photosPerPage = 4
    end
    SyncEngine.set_notification(-1, "/app/Settings/sync_notify", '')
    System.set_screen_rotation_notification("/app/Settings/orientation_notify", '')

    # Retrieving all the records Present in Customer model Local DB.
    customers = Customer.find(:all)
    # Checking if the data retrieved is empty.
    if customers.empty?
      #Fetching data from Customer.txt.
      fileName = File.join(Rho::RhoApplication::get_base_app_path(), '/public/Customers.txt')
      # Performing Read Operation on the file.
      rows = File.read(fileName)
      # Converting the data retrieved into JSON format for operation.
      jsonContent = Rho::JSON.parse(rows)
      jsonContent.each {
        |json|
        #Storing the data retrieved into Customer model local DB.
        Customer.create(
        'C_Id' => json['C_Id'],
        'C_Name' => json['C_Name'],
        'C_ServiceHours' => json['C_ServiceHours'],
        'C_Contact' => json['C_Contact'],
        'C_Address' => json['C_Address']
        )
      }
    end

    # Retrieving all the records Present in Parts model Local DB.
    parts = Parts.find(:all)
    # Checking if the data retrieved is empty.
    if parts.empty?
      # Fetching data from Parts.txt.
      fileName = File.join(Rho::RhoApplication::get_base_app_path(), '/public/Parts.txt')
      # Performing Read Operation on the file.
      rows = File.read(fileName)
      # Converting the data retrieved into JSON format for operation.
      jsonContent = Rho::JSON.parse(rows)
      jsonContent.each {
        |json|
        #Storing the data retrieved into Parts model local DB.
        Parts.create(
        'Parts_Id' => json['Parts_Id'].to_i,
        'Parts_Name' => json['Parts_Name'],
        'Parts_Number' => json['Parts_Number'].to_i,
        'Parts_SerialNumber' => json['Parts_SerialNumber'].to_i
        )
      }
    end

    # Retrieving all the records Present in LoginModule model Local DB.
    credentials = LoginModule.find(:all)
    # Checking if the data retrieved is empty.
    if credentials.empty?
      # Fetching data from Login.txt.
      fileName = File.join(Rho::RhoApplication::get_base_app_path(), '/public/Login.txt')
      # Performing Read Operation on the file.
      rows = File.read(fileName)
      # Converting the data retrieved into JSON format for operation.
      jsonContent = Rho::JSON.parse(rows)
      jsonContent.each {
        |json|
        #Storing the data retrieved into LoginModule model local DB.
        LoginModule.create(
        'U_Name' => json['U_Name'],
        'U_Password' => json['U_Password'],
        'U_Remember' => json['U_Remember']
        )
      }

    end
  end
end
