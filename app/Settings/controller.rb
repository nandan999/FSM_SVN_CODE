require 'rho'
require 'rho/rhocontroller'
require 'rho/rhoerror'
require 'helpers/browser_helper'

class SettingsController < Rho::RhoController
  include BrowserHelper
  
  #Navigates to the home page on login click.
  def Home
    if $page != "login"
      $selectedTab = "Details"
      redirect :controller => :WorkOrder, :action => :list, :query => {"wo_click" => "false"}
    else
      redirect :controller => :LoginModule, :action => :launch_app
    end
  end
  
  #Navigates to the previous page on native back press.
  def back_page
    if $page != "login"
      $values = {}
      $selectedTab = "Details"
      WebView.navigate(url_for(:controller => :WorkOrder, :action => :list, :query => {"wo_click" => "false"}))
    end
  end
  
  #Performs the desired tasks on orientation change and preserves the required values.
  def orientation_notify
    if $page != 'login'
      date = get_formatted_date($displayDate)
      if !$phone && System::get_property('screen_orientation').to_s == "portrait"
        $woPopUpVal = WorkOrder.paginate(:page => 0, :per_page => 3, :conditions =>  {"WO_CreatedDate"=>date.to_s,:WO_CreatedBy => $user})
        if $woDefault == nil
          $woDefault = $woPopUpVal[0]
        end
      else
        $woValue = sorted_work_orders(date.to_s,$user)
        if $woDefault == nil
          $woDefault = $woValue[0]
        end
      end
      formattedDate = Date.strptime(date,"%m-%d-%Y")
      $displayDate = formattedDate.strftime('%a, %m %d, %Y').to_s
    end
    if $page == "login"
      WebView.navigate(url_for(:controller => :LoginModule, :action => :loginpage, :query =>{"orientation_change" => "true"}))
    elsif $page == "create"
      WebView.navigate(url_for(:controller => :Customer, :action => :createWO, :query => {"orientation_change" => "true"}))
    elsif $page == "list"
      WebView.navigate(url_for(:controller => :WorkOrder, :action => :list, :query => {"wo_click" => "true", "date" => "search", "orientation_change" => "true"}))
    elsif $page == "detail"
      WebView.navigate(url_for(:controller => :WorkOrder, :action => :detail, :query => {"orientation_change" => "true"}))
    elsif $page == "map"
      WebView.navigate(url_for(:controller => :WorkOrder, :action => :map))
    end
  end
  
  def index
    @msg = @params['msg']
    render
  end

  def login
    @msg = @params['msg']
    render :action => :login
  end

  def login_callback
    errCode = @params['error_code'].to_i
    if errCode == 0
      WebView.navigate Rho::RhoConfig.options_path
      SyncEngine.dosync
    else
      if errCode == Rho::RhoError::ERR_CUSTOMSYNCSERVER
        @msg = @params['error_message']
      end
        
      if !@msg || @msg.length == 0   
        @msg = Rho::RhoError.new(errCode).message
      end
      
      WebView.navigate(url_for(:action => :login, :query => {:msg => @msg}))
    end  
  end

  def do_login
    if @params['login'] and @params['password']
      begin
        SyncEngine.login(@params['login'], @params['password'], (url_for :action => :login_callback) )
        @response['headers']['Wait-Page'] = 'true'
        render :action => :wait
      rescue Rho::RhoError => e
        @msg = e.message
        render :action => :login
      end
    else
      @msg = Rho::RhoError.err_message(Rho::RhoError::ERR_UNATHORIZED) unless @msg && @msg.length > 0
      render :action => :login
    end
  end
  
  def logout
    SyncEngine.logout
    @msg = "You have been logged out."
    render :action => :login
  end
  
  def reset
    render :action => :reset
  end
  
  def do_reset
    Rhom::Rhom.database_full_reset
    SyncEngine.dosync
    @msg = "Database has been reset."
    redirect :action => :index, :query => {:msg => @msg}
  end
  
  def do_sync
    SyncEngine.dosync
    @msg =  "Sync has been triggered."
    redirect :action => :index, :query => {:msg => @msg}
  end
  
  def sync_notify
  	status = @params['status'] ? @params['status'] : ""
  	if status == "in_progress" 	
  	elsif status == "complete"
      WebView.navigate Rho::RhoConfig.start_path if @params['sync_type'] != 'bulk'
  	elsif status == "error"
	
      if @params['server_errors'] && @params['server_errors']['create-error']
        SyncEngine.on_sync_create_error( 
          @params['source_name'], @params['server_errors']['create-error'].keys, :delete )
      end

      if @params['server_errors'] && @params['server_errors']['update-error']
        SyncEngine.on_sync_update_error(
          @params['source_name'], @params['server_errors']['update-error'], :retry )
      end
      
      err_code = @params['error_code'].to_i
      rho_error = Rho::RhoError.new(err_code)
      
      @msg = @params['error_message'] if err_code == Rho::RhoError::ERR_CUSTOMSYNCSERVER
      @msg = rho_error.message unless @msg && @msg.length > 0   

      if rho_error.unknown_client?( @params['error_message'] )
        Rhom::Rhom.database_client_reset
        SyncEngine.dosync
      elsif err_code == Rho::RhoError::ERR_UNATHORIZED
        WebView.navigate((url_for :action => :login,:query => {:msg => "Server credentials are expired"}))                
      elsif err_code != Rho::RhoError::ERR_CUSTOMSYNCSERVER
        WebView.navigate((url_for :action => :err_sync, :query => { :msg => @msg } ))
      end    
	end
  end  
end
