id=""
name=""
contact=""
email=""
bookdate=""
rooms=""
chkin=""
chkout=""
nights=""
category=""
plan=""
extrabed=""
cwex=""
cwoex=""
roompr=""
totroompr=""
plancharges=""
extrabed=""
childwexcost="" 
childwoexcost=""  
tothotelcost=""   
staygstrate=""
foodgstrate=""
staygst="" 
foodgst=""
totalgst="" 
finalpr="" 
amtpaid="" 
pmtinfo="" 
status="" 
corechange=false;

old_json=null


function suggestemail(key){
	if(key!=null && key.length>2 && key!=""){
		$.ajax({
	    type:"post",
	    url:"/modifybooking/getsuggestion",
	    dataType: 'json',
        data: JSON.stringify({"keyword": key}),
        contentType: 'application/json',
        success: function(data){
          if(data.length>0){
            var options = '';
           
          for (var i = 0; i < data.length; i++) {
            var counter = data[i];
          options += '<option value="'+counter+'" >'+counter+'</option>';
            }
            document.getElementById('maildata').innerHTML = options; 
          } 
        }
    });
	}
	else{
		document.getElementById('maildata').innerHTML='';

	}

}
function fetchresults(){
	mail=$('input[name="email"]').val();
	$.ajax({
	    type:"post",
	    url:"/modifybooking/listofbookings",
	    dataType: 'json',
        data: JSON.stringify({"keyword": mail}),
        contentType: 'application/json',
        success: function(data){
        	if(data!=null || data.length!=0){
        	$('#subcontent').html('');
          $('#subcontent').append('<table id="listbookings"  ></table>');
          $('#listbookings').append('<tr><th>Customer Name</th><th>Booking Date</th><th>Check in Date</th><th>Category</th><th>Nights</th><th>Rooms</th><th>Status</th><th>Select</th></tr>')
        	$('#listbookings').append('<tr><td class="nopad" colspan="8"><hr></tr>');
        	
        	for(i=0;i<data.length;i++){
        		
        		$('#listbookings').append('<tr><td>'+data[i].cname+'</td><td>'+data[i].bookdate+'</td><td>'+data[i].chkin+'</td><td>'+data[i].catagory+'</td><td>'+data[i].nights+'</td><td>'+data[i].rooms+'</td><td>'+data[i].status+'</td><td><input type="radio" name="bookid" value="'+data[i]._id+'"></td></tr>');
        	}
        	$('#subcontent').append('<br><br><center><button id="editbutton" onclick="fetchfulldata()">Edit Booking</button></center>');

        	
        }

        }
    });

}
function changecore(){
	corechange=true;

}
function custandpaymentedit(){

	$('#coreupdatebutton').prop('disabled', true);
	$('#otherupdatebutton').prop('disabled', true);
	$('#checkupdatebutton').prop('disabled',true);	
	$('#cancelbutton').prop('disabled',true);

	oid=old_json._id
	new_Json={
	"cname":$('input[name=custname]').val(),
	"contact":$('input[name=phno]').val(),
	"email":$('input[name=email]').val(),
	"amtpaid":$('input[name=amountpaid]').val(),
	"pmtinfo": document.getElementsByName("paymentinfo")[0].value
	
	}
	$.ajax({

						type: "post",
						url: "/modifybooking/otherupdate",
						dataType: 'json',

						data: JSON.stringify({
							"oid":oid,
							"updated":new_Json
						}),
						contentType: 'application/json',
						success: function (data) {
							if(data.success){
								alert("Booking Data Modified");
								location.reload();
							}
							else{
								alert("Booking Data Not Modified");
							}

						$('#coreupdatebutton').prop('disabled', false);
						$('#otherupdatebutton').prop('disabled', false);
						$('#checkupdatebutton').prop('disabled',false);	
						$('#cancelbutton').prop('disabled',false);

						}
					});

}
function fetchfulldata(){
	$('#editbutton').attr("disabled", "disabled");
	
	bid=$('input[name=bookid]:checked').val();
	
	
	$('#subcontent').html('');
	$('#subcontent').append('<fieldset id="otherfield"><legend><h2>Customer & Payment Details</h2></legend></fieldset>');
	$('#otherfield').append('<table id="otheredit"></table>');
	$('#otheredit').append('<tr><td>Name</td><td><input type="text" name="custname"></td></tr>');
	$('#otheredit').append('<tr><td>Contact No.</td><td><input type="text"  name="phno"></td></tr>');
	$('#otheredit').append('<tr><td>Email</td><td><input type="text" name="email"></td></tr>');
	$('#otheredit').append('<tr><td>Booking Date</td><td><input type="date" name="bookdate"  readonly></td></tr>');
	$('#otheredit').append('<tr><td>Amount Paid</td><td><input type="number" name="amountpaid" ></td></tr>');
	$('#otheredit').append('<tr><td>Payment info</td><td><textarea name="paymentinfo" rows="4" cols="30" ></textarea></td></tr>');
	$('#otheredit').append('<tr><td colspan="2"><button  id="otherupdatebutton" onclick="custandpaymentedit()" disabled="disabled">Edit Customer and Payment Details</button></td></tr>');
	$('#subcontent').append('<br><br>');


	$('#subcontent').append('<fieldset id="corefield"><legend><h2>Core Modification</h2></legend></fieldset>');
	$('#corefield').append('<table id="coreedit"></table>');
	$('#coreedit').append('<tr><td>Check in Date</td><td><input type="date" onchange="calculatenights()" name="chkin"></td><td>Check out Date</td><td><input type="date" onchange="calculatenights()" name="chkout" ></td></tr>');
  	$('#coreedit').append('<tr><td>Category</td><td><select id="category" name="category" onchange="changecore()"></select></td><td>Plan</td><td><select id="plan" name="plan" onchange="changecore()"></select></td></tr>');
  	$('#coreedit').append('<tr><td>Nights</td><td><input type="number" min="1"  name="nights" readonly></td><td>Rooms</td><td><input type="number" min="1"  name="rooms" onchange="changecore()" ></td></tr>');  
 	$('#coreedit').append('<tr><td>Extrabed</td><td><input type="number" min="0"  name="extrabed" ></td></tr>');
  	$('#coreedit').append('<tr><td>Child with Extrabed</td><td><input type="number" min="0"  name="cwextrabed" ></td><td>Child without Extrabed</td><td><input type="number" min="0"  name="cwoextrabed" ></td></tr>');

  	$('#coreedit').append('<tr><td>Room Price</td><td><input type="number" min="1"  name="roompr" ></td><td>Total Room Price</td><td><input type="number" min="0"  name="totroompr" ></td></tr>');

  	$('#coreedit').append('<tr><td>Extrabed Price</td><td><input type="number" min="0"  name="exbedpr" ></td></tr>');
  	$('#coreedit').append('<tr><td>Child with Extrabed Price</td><td><input type="number" min="0"  name="cwexbedpr" ></td><td>Child without Extrabed Price</td><td><input type="number" min="0"  name="cwoexbedpr" ></td>');

	$('#coreedit').append('<tr><td>Plan Charges</td><td><input type="number" min="0"  name="planpr" ></td><td>Total Cost of Hotel</td><td><input type="number" min="1"  name="tothotcost" ></td></tr>');
	
	$('#coreedit').append('<tr><td>Stay GST Rate</td><td><input type="number" min="0"  name="staygstrate" ></td><td>Stay GST</td><td><input type="number" min="0"  name="staygst" ></td></tr>');

	$('#coreedit').append('<tr><td>Food GST Rate</td><td><input type="number" min="0"  name="foodgstrate" ></td><td>Food GST</td><td><input type="number" min="0"  name="foodgst" ></td></tr>');

	$('#coreedit').append('<tr><td>Total GST</td><td><input type="number" min="0"  name="totgst" ></td><td>Final Price</td><td><input type="number" min="1"  name="finalpr" ></td></tr>');
	$('#coreedit').append('<tr><td>Status</td><td><div id="status"></div></td></tr>');
	$('#coreedit').append('<tr><td colspan="2"><button id="checkupdatebutton" onclick="coreupdatecheck()" disabled="disabled">Check Update</button></td><td colspan="2"><button id="coreupdatebutton" onclick="makecoreupldate()" disabled="disabled">Update Booking</button></td></tr>');
	$('#coreedit').append('<tr><td colspan="4"><button id="cancelbutton" onclick="cancelbooking()" disabled="disabled">Cancel Booking</button></td></tr>');
	$('#subcontent').append('<br><br>');
	
	/*
	fetch booking data ad next ajax request will available categories on that date of booking
	*/
	$.ajax({
	    type:"post",
	    url:"/modifybooking/fetchfullinfo",
	    dataType: 'json',
	     
        data: JSON.stringify({"keyword": bid}),
        contentType: 'application/json',
        success: function(data){
        	old_json=data;
        	id=data._id;
			name=data.cname;
			contact=data.contact;
			email=data.email;
			bookdate=data.bookdate;
			rooms=data.rooms;
			chkin=data.chkin;
			chkout=data.chkout;
			nights=data.nights;
			category=data.catagory;
			plan=data.plan;
			extrbed=data.exbed;
			cwex=data.cwextrabed;
			cwoex=data.cwoextrabed;
			roompr=data.roomprice;
			totroompr=data.totroomcost;
			plancharges=data.plancharges;
			extrabed=data.extrabed;
			childwexcost=data.childwexcost;
			childwoexcost=data.childwoexcost;
			tothotelcost=data.tothotelcost;   
			staygstrate=data.staygstrate;
			foodgstrate=data.foodgstrate;
			staygst=data.staygst; 
			foodgst=data.foodgst;
			totalgst=data.totalgst;
			finalpr=data.finalpr; 
			amtpaid=data.amtpaid; 
			pmtinfo=data.pmtinfo;
			status=data.status; 
			if(status=="confirmed"){
			$.ajax({
					type: "post",
					url: "/availability/getcat",
					dataType: 'json',
					
					data: JSON.stringify({
						"any": "any"
					}),
					contentType: 'application/json',
					success: function (data) {
						cat_plans = data;
						//console.log(cat_plans);
						catopts='';
						planopts='';
						if(cat_plans.catagories.length>0){
						for (i=0;i<cat_plans.catagories.length;i++){
							
							catopts+='<option value="'+cat_plans.catagories[i]+'">'+cat_plans.catagories[i]+'</option>';
							
						}
					}
					if(cat_plans.plans.length>0){
						for (i=0;i<cat_plans.plans.length;i++){
							planopts+='<option value="'+cat_plans.plans[i]+'">'+cat_plans.plans[i]+'</option>';
							
						}
					}
					
					$('#category').append(catopts);
					$('#plan').append(planopts);
					$('input[name=custname]').val(name);
					$('input[name=phno]').val(contact);
					$('input[name=email]').val(email);
					$('input[name=bookdate]').val(bookdate);
					$('input[name=amountpaid]').val(amtpaid);
					$('input[name=paymentinfo]').val(pmtinfo);
					$('input[name=chkin]').val(chkin);
					$('input[name=chkout]').val(chkout);
					$('input[name=nights]').val(nights);
					$('input[name=rooms]').val(rooms);
					$('input[name=extrabed]').val(extrbed);
					$('input[name=cwextrabed]').val(cwex);
					$('input[name=cwoextrabed]').val(cwoex);
					$('input[name=roompr]').val(roompr);
					$('input[name=totroompr]').val(totroompr);
					$('input[name=exbedpr]').val(extrabed);
					$('input[name=cwexbedpr]').val(childwexcost);
					$('input[name=cwoexbedpr]').val(childwoexcost);
					$('input[name=planpr]').val(plancharges);
					$('input[name=tothotcost]').val(tothotelcost);
					$('input[name=staygstrate]').val(staygstrate);
					$('input[name=foodgstrate]').val(foodgstrate);
					$('input[name=staygst]').val(staygst);
					$('input[name=foodgst]').val(foodgst);
					$('input[name=totgst]').val(totalgst);
					$('input[name=finalpr]').val(finalpr);
					$("#category").val(category);
					$('#plan').val(plan);
					$('#status').html(status);
					$('#coreupdatebutton').prop('disabled', false);
					$('#otherupdatebutton').prop('disabled', false);
					$('#checkupdatebutton').prop('disabled',false);
					$('#cancelbutton').prop('disabled',false);

					}
				});
		}else{
			alert('Booking is already cancelled');
			location.reload();
		}
        }
    });
	
}

function coreupdatecheck(){
	$('#coreupdatebutton').prop('disabled', true);
	$('#otherupdatebutton').prop('disabled', true);
	$('#checkupdatebutton').prop('disabled',true);	
	$('#cancelbutton').prop('disabled',true);
	new_json={"_id":old_json._id,"rooms": $('input[name=rooms]').val(),
	"chkin" :$('input[name=chkin]').val(),
			"chkout":$('input[name=chkout]').val(),
			"nights":$('input[name=nights]').val(),
			"catagory":$('#category').val(),
		"plan":$('#plan').val(),
			"exbed":$('input[name=extrabed]').val(),
		"cwextrabed":$('input[name=cwextrabed]').val(),
					
			"cwoextrabed":$('input[name=cwoextrabed]').val(),
		"roomprice":$('input[name=roompr]').val(),
					
			"totroomcost":$('input[name=totroompr]').val(),
			"plancharges":$('input[name=planpr]').val(),
		"extrabed":$('input[name=exbedpr]').val(),
			"childwexcost":$('input[name=cwexbedpr]').val(),
			"childwoexcost":$('input[name=cwoexbedpr]').val(),
			"tothotelcost":$('input[name=tothotcost]').val(),   
			"staygstrate":$('input[name=staygstrate]').val(),
	"foodgstrate":$('input[name=foodgstrate]').val(),
	"staygst":	$('input[name=staygst]').val(), 
	"foodgst":$('input[name=foodgst]').val(),
		"totalgst":$('input[name=totgst]').val(),
	"finalpr":$('input[name=finalpr]').val()
	}
	$.ajax({
	    type:"post",
	    url:"/modifybooking/coreupdatecheck",
	    dataType: 'json',
	     
        data: JSON.stringify({"old": old_json,"new":new_json}),
        contentType: 'application/json',
        success: function(data){
        		
					console.log(data.available)
					if(data.available){
						alert("Changes available");

						/*calculate prices and gst
						*/
						calculategst()

					}
					else{
						alert(data.notavailable+"\n are not available");
						
						$('#coreupdatebutton').prop('disabled', false);
						$('#otherupdatebutton').prop('disabled', false);
						$('#checkupdatebutton').prop('disabled',false);
						$('#cancelbutton').prop('disabled',false);
						loadolddata();
					}
        }
    });

}
//Calculate Nights
function calculatenights(){
	corechange=true;
	chin=$('input[name=chkin]').val();
	chout=$('input[name=chkout]').val();
	ci = new Date(chin);
	co = new Date(chout);
	
	$('input[name=nights]').val( Math.round(Math.abs((ci.getTime() - co.getTime()) / (24 * 60 * 60 * 1000))));

}
function cancelbooking(){
	$('#coreupdatebutton').prop('disabled', true);
	$('#otherupdatebutton').prop('disabled', true);
	$('#checkupdatebutton').prop('disabled',true);	
	$('#cancelbutton').prop('disabled',true);
	var r = confirm("Are You Sure? to cancel Booking");
	if (r == true) {
		bid=old_json._id;
	   $.ajax({
	    type:"post",
	    url:"/modifybooking/cancelbooking",
	    dataType: 'json',
	     
        data: JSON.stringify({"bookid": bid}),
        contentType: 'application/json',
        success: function(data){
        	location.reload();
        	if(data.resp)
        	alert("Booking Cancelled");
        }
    });
	} else {
		$('#coreupdatebutton').prop('disabled', false);
		$('#otherupdatebutton').prop('disabled', false);
		$('#checkupdatebutton').prop('disabled',false);
		$('#cancelbutton').prop('disabled',false);
	    return
	}
}

//load original booking data without modified

function loadolddata(){

					$('input[name=custname]').val(name);
					$('input[name=phno]').val(contact);
					$('input[name=email]').val(email);
					$('input[name=bookdate]').val(bookdate);
					$('input[name=amountpaid]').val(amtpaid);
					$('input[name=paymentinfo]').val(pmtinfo);
					$('input[name=chkin]').val(chkin);
					$('input[name=chkout]').val(chkout);
					$('input[name=nights]').val(nights);
					$('input[name=rooms]').val(rooms);
					$('input[name=extrabed]').val(extrbed);
					$('input[name=cwextrabed]').val(cwex);
					$('input[name=cwoextrabed]').val(cwoex);
					$('input[name=roompr]').val(roompr);
					$('input[name=totroompr]').val(totroompr);
					$('input[name=exbedpr]').val(extrabed);
					$('input[name=cwexbedpr]').val(childwexcost);
					$('input[name=cwoexbedpr]').val(childwoexcost);
					$('input[name=planpr]').val(plancharges);
					$('input[name=tothotcost]').val(tothotelcost);
					$('input[name=staygstrate]').val(staygstrate);
					$('input[name=foodgstrate]').val(foodgstrate);
					$('input[name=staygst]').val(staygst);
					$('input[name=foodgst]').val(foodgst);
					$('input[name=totgst]').val(totalgst);
					$('input[name=finalpr]').val(finalpr);
					$("#category").val(category);
					$('#plan').val(plan);
					$('#status').html(status);
}

function calculategst(){
	newgststay = 0
	newgstfood = 0
	newtotgststay = 0;
	newtotgstfood = 0;
	norooms=$('input[name=rooms]').val();
	chkind=$('input[name=chkin]').val();
	chkoutd=$('input[name=chkout]').val();
	chkinpass=chkind.split('-')
	chkoutpass= chkoutd.split('-')
	nchkin=chkinpass[1]+'/'+chkinpass[2]+'/'+chkinpass[0];
	nchkout=chkoutpass[1]+'/'+chkoutpass[2]+'/'+chkoutpass[0];
	nightscou = parseInt($('input[name=nights]').val())
	roombase=$('input[name=roompr]').val()
	cat=$("#category").val();
	pln=$('#plan').val();
	newroompr=0
	newtotroompr=0
	newexbedrate=0
	newplanpr=0
	/*
	plan base retrive remaining

	*/
	/*planbase = document.getElementsByName('plancost')[0].value*/

			$.ajax({
                type: "post",
                url: "/booking/getavail",
                dataType: 'json',
                data: JSON.stringify({
                  "checkindate": nchkin,
                  "checkoutdate": nchkout,
                  "norooms": norooms,
                  "nights": nightscou
                }),
                contentType: 'application/json',
				success: function (data) {
				
					for(i=0;i<data.jsa.length;i++){
						if(data.jsa[i].catagory.localeCompare(cat)==0){
								newroompr=data.jsa[i].roomprice
								newtotroompr=data.jsa[i].price
								break;
						}
					}
					for(i=0;i<data.plans.plannames.length;i++){
						if(data.plans.plannames[i].localeCompare(pln)==0){
							newplanpr=data.plans.planprices[i]
							break;
						}
					}
					newexbedrate=data.ebedprice

					newnoofexbed = $('input[name=extrabed]').val();
					newcwex = $('input[name=cwextrabed]').val();
					newcwoex = $('input[name=cwoextrabed]').val();
					if (newnoofexbed == null || newnoofexbed == "") {
						newnoofexbed = 0;
					}
					if (newcwex == null || newcwex == "") {
						newcwex = 0;
					}
					if (newcwoex == null || newcwoex == "") {
						newcwoex = 0;
					}
					planbase=newplanpr*norooms
					totchildwoextracost = (planbase / (4 * (parseFloat(norooms)))) * newcwoex ;
					totchildwextracost = ( newcwex * parseFloat(newexbedrate)) + (planbase / (4 * (parseFloat(norooms)))) * newcwex;
					totextrabedcost = (newnoofexbed * parseFloat(newexbedrate)) + (planbase / (2 * parseFloat(norooms))) * newnoofexbed ;
					$('input[name=roompr]').val(newroompr);
					$('input[name=totroompr]').val(newtotroompr);
					$('input[name=exbedpr]').val(totextrabedcost);
					$('input[name=cwexbedpr]').val(totchildwextracost);
					$('input[name=cwoexbedpr]').val(totchildwoextracost);
					$('input[name=planpr]').val(planbase);




					$.ajax({

						type: "post",
						url: "/booking/getgstrate",
						dataType: 'json',

						data: JSON.stringify({
							"roompr": newroompr
						}),
						contentType: 'application/json',
						success: function (data) {
							$('input[name=staygstrate]').val(data.stayrate);
							$('input[name=foodgstrate]').val(data.foodrate);
							
							newgststay = parseFloat(data.stayrate);
							newgstfood = parseFloat(data.foodrate);

							newtotgststay = parseFloat(newtotroompr) * newgststay / 100;

							newtotgstfood = parseFloat(newplanpr*norooms) * newgstfood / 100;
							
							//extrabed food

							
							
							
							newtotgstfood += (parseFloat(planbase) * newnoofexbed  / (2 * (parseFloat(norooms)))) * newgstfood / 100.0;

							//extrabed stay
							newtotgststay += (parseFloat(newexbedrate) * newnoofexbed ) * newgststay / 100.0;

							//child with extra bed
							newtotgstfood += (parseFloat(planbase) * newcwex  / (4 * (parseFloat(norooms)))) * newgstfood / 100.0;

							//child with exbed stay
							newtotgststay += (parseFloat(newexbedrate) * newcwex ) * newgststay / 100.0;

							//child without exbed

							newtotgstfood += (parseFloat(planbase) * newcwoex / (4 * (parseFloat(norooms)))) * newgstfood / 100.0;
							newtothotelcost= newtotroompr + planbase + totchildwextracost + totchildwoextracost + totextrabedcost
							
								$('input[name=tothotcost]').val(newtothotelcost);
								$('input[name=staygstrate]').val(newgststay);
								$('input[name=foodgstrate]').val(newgstfood);
								$('input[name=staygst]').val(newtotgststay);
								$('input[name=foodgst]').val(newtotgstfood);
								newtotgst=newtotgstfood+newtotgststay
								$('input[name=totgst]').val(newtotgst);
								$('input[name=finalpr]').val(newtothotelcost+newtotgst);


								corechange=false;

								$('#coreupdatebutton').prop('disabled', false);
								$('#otherupdatebutton').prop('disabled', false);
								$('#checkupdatebutton').prop('disabled',false);
								$('#cancelbutton').prop('disabled',false);
									


						}
					});


				}});
}

function makecoreupldate(){

	corechange=false;

	$('#coreupdatebutton').prop('disabled', true);
	$('#otherupdatebutton').prop('disabled', true);
	$('#checkupdatebutton').prop('disabled',true);
	$('#cancelbutton').prop('disabled',true);

	if(corechange){
		alert("please click on Check Update Button");
		return
	}
	oldid=old_json._id
	new_json={
	"rooms": parseInt($('input[name=rooms]').val()),
	"chkin" :$('input[name=chkin]').val(),
			"chkout":$('input[name=chkout]').val(),
			"nights":$('input[name=nights]').val(),
			"catagory":$('#category').val(),
		"plan":$('#plan').val(),
			"exbed":$('input[name=extrabed]').val(),
		"cwextrabed":$('input[name=cwextrabed]').val(),					
			"cwoextrabed":$('input[name=cwoextrabed]').val(),
		"roomprice":$('input[name=roompr]').val(),					
			"totroomcost":$('input[name=totroompr]').val(),
			"plancharges":$('input[name=planpr]').val(),
		"extrabed":$('input[name=exbedpr]').val(),
			"childwexcost":$('input[name=cwexbedpr]').val(),
			"childwoexcost":$('input[name=cwoexbedpr]').val(),
			"tothotelcost":$('input[name=tothotcost]').val(),   
			"staygstrate":$('input[name=staygstrate]').val(),
	"foodgstrate":$('input[name=foodgstrate]').val(),
	"staygst":	$('input[name=staygst]').val(), 
	"foodgst":$('input[name=foodgst]').val(),
		"totalgst":$('input[name=totgst]').val(),
	"finalpr":$('input[name=finalpr]').val()
	}

	$.ajax({

						type: "post",
						url: "/modifybooking/makecoreupdate",
						dataType: 'json',

						data: JSON.stringify({
							"ojson":old_json,
							"njson":new_json,
							"nid":old_json._id
						}),
						contentType: 'application/json',
						success: function (data) {
							if(data.success){
								alert("Booking Modified");
								location.reload();
							}
							else{
								alert("Booking Not Modified");
							}
								$('#coreupdatebutton').prop('disabled', false);
								$('#otherupdatebutton').prop('disabled', false);
								$('#checkupdatebutton').prop('disabled',false);
								$('#cancelbutton').prop('disabled',false);

						}
					});


}