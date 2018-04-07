maininitform='<head><link href="vendor/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">'
            +'<link href="vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet">'
            +'<center><h2><font color="blue">Content Management System for Hotel</font></h2></center><br><br></head><body>'    
             +'<form id="demo-form2" data-parsley-validate class="form-horizontal form-label-left" method="post" action="/Createadmin">'
						+'<div class="form-group">'
                        +'<label class="control-label col-md-3 col-sm-3 col-xs-12" for="first-name">Hotel Name<span class="required">*</span>'
                        +'</label>'
                        +'<div class="col-md-6 col-sm-6 col-xs-12">'
                          +'<input type="text" name="hotelname" id="hotelname" required="required" class="form-control col-md-7 col-xs-12">'
                        +'</div>'
                      +'</div>'
                      +'<div class="form-group">'
                        +'<label class="control-label col-md-3 col-sm-3 col-xs-12" for="last-name">Database url <span class="required">*</span>'
                        +'</label>'
                        +'<div class="col-md-6 col-sm-6 col-xs-12">'
                          +'<input type="text" id="dburl" name="dburl" required="required" class="form-control col-md-7 col-xs-12">'
                        +'</div>'
                      +'</div>'
                                          
                    
                      
                      +'<div class="form-group">'
                        +'<div class="col-md-6 col-sm-6 col-xs-12 col-md-offset-3">'
                          +'<button class="btn btn-primary" type="button">Cancel</button>'

              +'<button class="btn btn-primary" type="reset">Reset</button>'
                          +'<button type="submit" class="btn btn-success">Submit</button>'
                        +'</div>'
                     +' </div>'

                    +'</form>'
                    +' <script src="/vendor/jquery/dist/jquery.min.js"></script>'
                       +'<script src="/vendor/bootstrap/dist/js/bootstrap.min.js"></script>'
+'</body>'

module.exports = {

  

 mainform: function() {
  return  maininitform;
      
    }
    
};