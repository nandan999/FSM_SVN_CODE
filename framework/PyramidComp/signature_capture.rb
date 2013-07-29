
module SignatureComponents
$pyramidcomp= Rho::RhoConfig
  
  
  def fullSignature(controller_name,callback_name,pen_color=$pyramidcomp.R_pencolor,pen_width=$pyramidcomp.R_penwidth,bg_color=$pyramidcomp.R_bgcolor)
#    Alert.show_popup("Pen Color is : " + pen_color)
#    Alert.show_popup("Pen Width is : " + pen_width)
#    Alert.show_popup("Bg Color is : " + bg_color)
     params={:penColor=>pen_color.to_i(16), :penWidth=> pen_width, :bgColor=> bg_color.to_i(16)}
     Rho::SignatureCapture.take(url_for(:controller => controller_name, :action => callback_name), params)
  end

  
  def inlineSignature(controller_name,callback_name,pen_color=$pyramidcomp.R_pencolor,pen_width=$pyramidcomp.R_penwidth,bg_color=$pyramidcomp.R_bgcolor)
    @@Col=pen_color.to_i(16)
    @@Wid=pen_width
    @@bgCol=bg_color.to_i(16)
    render :action=> :inline
  end
  
  def set_rect(left,top,width,height)
    Alert.show_popup("Alert Set_rect")
    Rho::SignatureCapture.visible(true, :penColor => @@Col, :penWidth=>@@Wid, :border => true, :bgColor => @@bgCol, :left => left, :top => top, :width => width, :height => height )
  end

  def InlineSign
    Rho::SignatureCapture.capture(url_for( :action => :call_Back))
  end
  
  def remove_rect
    Rho::SignatureCapture.visible(false)
  end
  
  def clear
    Rho::SignatureCapture.clear()
  end
  
end