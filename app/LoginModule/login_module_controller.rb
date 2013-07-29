require 'rho/rhocontroller'
require 'helpers/browser_helper'
=begin
    Controller that performs the task of Logging In to the Application and Performs validation of the credentials.
    @author : Sonali Banerjee, Mohit Raheja.
    @version : 1.0
    
=end 
class LoginModuleController < Rho::RhoController
  include BrowserHelper

  #Performs the task of validating the entered credentials and Logging in to the application.
  def do_login
      $user = @params['login'].to_s()
      $password=@params['password'].to_s()
      @chkd=@params['remember'].to_s()
      
      loginpages = LoginModule.find(:all,:conditions => {:U_Name=>''+$user+'',:U_Password=>''+$password+'' })
      
      if(loginpages.length==1)
        if(@chkd=="true")
          loginpages[0].U_Remember="true"
          loginpages[0].save
          @tru_cnd=LoginModule.find(:all,:conditions => "U_Name != '#{$user}'", :select =>['U_Name', 'U_Remember'])
            @tru_cnd.length.times do |i|
              @tru_cnd[i].U_Remember="false"
              @tru_cnd[i].save
            end    
         end
         $values = {}
        redirect :controller => :WorkOrder, :action => :list

      else
        Alert.show_popup({:message => 'Invalid User',:title => 'FSM',:buttons => [' OK ']})
        redirect :action=> :loginpage
      end
    end
    
    #Launches the Login page when the application is initiated. 
    def launch_app
     $page = ""
     @@user_exist=LoginModule.find(:all,:select => ['U_Name'])
     if(@@user_exist.length >0) 
      @@chkd_auth = LoginModule.find(:all,:conditions => {:U_Remember=>"true"})   
      if(@@chkd_auth.length==0)
        redirect :action => :loginpage
      else
        @@userval=@@chkd_auth[0].U_Name
        redirect :action => :loginpage, :query=> {:user => @@userval}
      end
      elsif(@@user_exist.length==0)
        redirect :action => :loginpage 
      end   
    end
      
    #Navigates the user to the login page.
    def loginpage
      @user = @params["user"]
      render :action => :loginpage
    end
    
    #Preserves the value of loginID and Password,in case of orientation change.
    def setValuesOnChange()
        loginid = @params['loginid']
        password = @params['password']
        $values["loginId"] = loginid
        $values["password"] = password
    end
     
    #Preserves the value of remember me option box,in case of orientation change.  
    def get_Values
      value = @params["value"]
      $values["remember"] = value
    end
    
    #resets the login page values.
    def clearValues
      $values = {}
    end
end
