
function openbooking(v){

	$("#bookinghold").html("<table cellpadding=\"10\">"
		+"<tr><td>Catagory</td><td><input type=\"text\" value="+v+" name=\"catagory\" readonly></td></tr>"
		+"<tr><td>Plan</td><td><div id=\"planshold\"></div>"
		+"<tr><td>Extrabed</td><td><input type=\"number\" min=\"0\" onchange=\"showquatation()\" value=\"0\" max=\"200\" name=\"Extrabed\"></td></tr>"
		+"<tr><td>Child with Extrabed</td><td><input type=\"number\" min=\"0\" onchange=\"showquatation()\" max=\"200\" value=\"0\" name=\"Cwextra\"></td></tr>"
		+"<tr><td>Child without Extrabed</td><td><input type=\"number\" min=\"0\" onchange=\"showquatation()\" max=\"200\" value=\"0\" name=\"Cwoextra\"></td></tr>		</table>");

	//add plans available in selected dates
	$('#planshold').html('<select id="plan" onchange="showquatation()"></select>')

	if(plannamelist.length!=0){
		for(i =0;i<plannamelist.length;i++){

			
			if(i==0){
				$('#plan').append('<option value="'+plannamelist[i]+'" selected>'+plannamelist[i]+'</option>')
				
			}
			else if(i==(plannamelist.length-1)) {
				$('#plan').append('<option value="'+plannamelist[i]+'" >'+plannamelist[i]+'</option></select>')

			}
			else{
				$('#plan').append('<option value="'+plannamelist[i]+'" >'+plannamelist[i]+'</option>')
			}
			
		}
	}
	//quote the price with extrabed and child and GST in table format
	showquatation();
//append payment info amount paid and book and reset buttons
$('#bookbutton').html('<textarea rows="4" cols="30" placeholder="Enter Payment Details like cheque number,upi id ,date of payment,txn Reference" id="paymentinfo"></textarea>&emsp;'
	+'Amount Paid <input type="number" min="0" id="amtpaid"> <br> '
	+'<input type="submit" value="Book">&emsp;&emsp;&emsp;<input type="button" onclick="location.reload();" value="Reset">');



}


function showquatation(){
	if($('#quotetab').length==0){

		totromcost=0;totextrabedcost=0,totchildcost=0,totplancost=0,totcosttohot=0,finalcost=0,totstaygst=0,totfoodgst=0;

		$('#quotehold').html('<table cellpadding="5" id="quotetab"></table>')

		var temp=document.getElementsByName('catagory')[0].value;
		for(i=0;i<jsarr.length;i++){
			if(jsarr[i].catagory==temp){
				temp=i;
				break;
			}
		}
		totromcost=jsarr[temp].price
		//show total price
		$('#quotetab').append('<tr><td>Total Room(s) Charges (₹) :</td><td><input type="number" min="0" name="roomcost" value="'+totromcost+'"</td></tr>');



		//Plan Price


		var temp=document.getElementById('plan').value
		if(temp==null || temp.localeCompare("")==0 ){
			$('#quotetab').append('<tr><td>Applied Plan Charges (₹) :</td><td><input type="number" min="0" name="plancost" value="0"</td></tr>');
		}
		else{
				for(i=0;i<plannamelist.length;i++){
				if(plannamelist[i]==temp){
					temp=i;
					break;
					}
				}
				totplancost=parseFloat(planprices[temp])*parseFloat(document.getElementById('norooms').value)
				
				$('#quotetab').append('<tr><td>Applied Plan Charges (₹) :</td><td><input type="number" min="0" name="plancost" value="'+totplancost+'"</td></tr>');

	}



	//show extrabed price



	var temp=parseInt(($("input[name=Extrabed]").val()==null)|| ($("input[name=Extrabed]").val().localeCompare(""))==0 ?0:$("input[name=Extrabed]").val());
	totextrabedcost=(temp*parseFloat(ebed))+(totplancost/(2*parseFloat(document.getElementById('norooms').value)))*temp;
	$('#quotetab').append('<tr><td>Extrabed(s) Charges (₹) :</td><td><input type="number" min="0" name="extrabedcost" value="'+totextrabedcost+'"</td></tr>');



	//show child price with and w/o bed
	
	var temp=parseInt(($("input[name=Cwextra]").val()==null)|| ($("input[name=Cwextra]").val().localeCompare(""))==0 ?0:$("input[name=Cwextra]").val());
	//noofchild*extrabedcharges + (plancost/2)*(1/2) food charges calculated half
	totchildwextracost=(temp*parseFloat(ebed))+(totplancost/(4*(parseFloat(document.getElementById('norooms').value))))*temp;
	
	$('#quotetab').append('<tr><td>Child with extrabed(s) Charges (₹) :</td><td><input type="number" min="0" name="childwexcost" value="'+totchildwextracost+'"</td></tr>');
	


	
	var temp=parseInt(($("input[name=Cwoextra]").val()==null)|| ($("input[name=Cwoextra]").val().localeCompare(""))==0 ?0:$("input[name=Cwoextra]").val());
	// (plancost/2)*(1/2) food charges calculated half
	totchildwoextracost=(totplancost/(4*(parseFloat(document.getElementById('norooms').value))))*temp;
	
	$('#quotetab').append('<tr><td>Child without extrabed(s) Charges (₹) :</td><td><input type="number" min="0" name="childwoexcost" value="'+totchildwoextracost+'"</td></tr>');z = document.createElement("TD");
	





	//Show total cost to Hotel
	
	totcosttohot=totromcost+totextrabedcost+totchildwextracost+totchildwoextracost+totplancost;
	$('#quotetab').append('<tr><td>Total Cost to Hotel (₹) :</td><td><input type="number" min="0" name="hotelcost" value="'+totcosttohot+'"</td></tr>');
	
	//calculategst() function is for set gst rates in ui and calculate the total gst rate


	//Show gst rates 
	$('#quotetab').append('<tr><td>GST Rate for Stay (%) :</td><td><input type="number"  name="gststayrate" id="test" min="0"></td>')
	

	$('#quotetab').append('<tr><td>GST Rate for Food (%) :</td><td><input type="number"  name="gstfoodrate" min="0"></td>')








//total Stay GST in INR
$('#quotetab').append('<tr><td>Total Stay GST (₹) : </td><td><input type="number" name="totstaygst" min="0" ></td>')


//total Food GST in INR
$('#quotetab').append('<tr><td>Total Food GST (₹) : </td><td><input type="number" name="totfoodgst" min="0"></td>')


//total GST in INR




$('#quotetab').append('<tr><td>Total GST (₹) : </td><td><input type="number" name="totgst" min="0" ></td>')





	//Show Final cost
	
	$('#quotetab').append('<tr><td>Final Price (₹) :</td><td><input type="number" name="finalwithgst" min="0" value="'+finalcost+'"></td>')

	calculategst()
}
else{
		var temp=document.getElementsByName('catagory')[0].value;
		for(i=0;i<jsarr.length;i++){
			if(jsarr[i].catagory==temp){
				temp=i;
				break;
			}
		}
		totromcost=jsarr[temp].price
		$('input[name=roomcost]').val(totromcost);


	var temp=document.getElementById('plan').value
	for(i=0;i<plannamelist.length;i++){
		if(plannamelist[i]==temp){
			temp=i;
			break;
		}
	}
	totplancost=parseFloat(planprices[temp])*parseFloat(document.getElementById('norooms').value)
	$('input[name=plancost]').val(totplancost);
	var temp=parseInt(($("input[name=Extrabed]").val()==null)|| ($("input[name=Extrabed]").val().localeCompare(""))==0 ?0:$("input[name=Extrabed]").val());
	totextrabedcost=(parseFloat(temp)*parseFloat(ebed))+(totplancost/(2*(parseFloat(document.getElementById('norooms').value))))*temp;
	$('input[name=extrabedcost]').val(totextrabedcost);
	var temp=parseInt(($("input[name=Cwextra]").val()==null)|| ($("input[name=Cwextra]").val().localeCompare(""))==0 ?0:$("input[name=Cwextra]").val());
		//noofchild*extrabedcharges + (plancost/2)*(1/2) food charges calculated half
		totchildwextracost=(parseFloat(temp)*parseFloat(ebed))+(totplancost/(4*(parseFloat(document.getElementById('norooms').value))))*temp;
		$('input[name=childwexcost]').val(totchildwextracost);
		var temp=parseInt(($("input[name=Cwoextra]").val()==null)|| ($("input[name=Cwoextra]").val().localeCompare(""))==0 ?0:$("input[name=Cwoextra]").val());
	// (plancost/2)*(1/2) food charges calculated half
	totchildwoextracost=(totplancost/(4*(parseFloat(document.getElementById('norooms').value))))*temp;
	$('input[name=childwoexcost]').val(totchildwoextracost);	
	totcosttohot=totromcost+totextrabedcost+totchildwextracost+totchildwoextracost+totplancost;
	$('input[name=hotelcost]').val(totcosttohot);
	calculategst()	
}
}

function calculategst(){
	gststay=0
	gstfood=0
	totgststay=0;
	totgstfood=0;
	x=document.getElementById('nightcount').innerHTML
	y=x.split(" ")
	nightscou=parseInt(y[0])
	roombase=document.getElementsByName('roomcost')[0].value
	planbase=document.getElementsByName('plancost')[0].value

//ebed is in index.html
exbedcharge=parseFloat(ebed);
noofexbed=document.getElementsByName('Extrabed')[0].value
cwex=document.getElementsByName('Cwextra')[0].value
cwoex=document.getElementsByName('Cwoextra')[0].value
if(noofexbed==null || noofexbed==""){
	noofexbed=0;
}
if(cwex==null || cwex==""){
	cwex=0;
}if(cwoex==null || cwoex==""){
	cwoex=0;
}



var temp=document.getElementsByName('catagory')[0].value;
for(i=0;i<jsarr.length;i++){
	if(jsarr[i].catagory==temp){
		temp=i;
		break;
	}
}
roompr=jsarr[temp].roomprice



	$.ajax({

		type: "post",
		url: "/getgstrate",
		dataType: 'json',

		data: JSON.stringify({
			"roompr":roompr
		}),
		contentType: 'application/json',
		success: function(data) {
			
			
			document.getElementsByName('gststayrate')[0].value=data.stayrate;
			document.getElementsByName('gstfoodrate')[0].value=data.foodrate;
			gststay=parseFloat(data.stayrate);
			gstfood=parseFloat(data.foodrate);
			totgststay=parseFloat(roombase)*gststay/100;

			totgstfood=parseFloat(planbase)*gstfood/100;
			
				//extrabed food
				totgstfood+=(parseFloat(planbase)*noofexbed/(2*(parseFloat(document.getElementById('norooms').value))))*gstfood/100.0;
				
				//extrabed stay
				totgststay+=(parseFloat(exbedcharge)*noofexbed)*gststay/100.0;
				
				//child with extra bed
				totgstfood+=(parseFloat(planbase)*noofexbed/(4*(parseFloat(document.getElementById('norooms').value))))*gstfood/100.0;
				
				//child with exbed stay
				totgststay+=(parseFloat(exbedcharge)*cwex)*gststay/100.0;
			
				//child without exbed
			
				totgstfood+=(parseFloat(planbase)*cwoex/(4*(parseFloat(document.getElementById('norooms').value))))*gstfood/100.0;
				
				document.getElementsByName('totstaygst')[0].value=totgststay
				document.getElementsByName('totfoodgst')[0].value=totgstfood
				document.getElementsByName('totgst')[0].value=totgstfood+totgststay
				document.getElementsByName('finalwithgst')[0].value=parseFloat(document.getElementsByName('hotelcost')[0].value)+totgstfood+totgststay


			}
		});

	}







		function dobooking(){
			cname=document.getElementsByName('cname')[0].value
			contact=document.getElementsByName('contact')[0].value
			email=document.getElementsByName('email')[0].value
			bookdate=document.getElementsByName('bookdate')[0].value
			rooms=document.getElementsByName('norooms')[0].value
			chkin=document.getElementsByName('chkindate')[0].value
			chkout=document.getElementsByName('chkoutdate')[0].value
			x=(document.getElementById('nightcount').innerHTML).split(" ") 
			nights=x[0]
			cat=document.getElementsByName('catagory')[0].value		
			plan=document.getElementById('plan').value
			extrabed=document.getElementsByName('Extrabed')[0].value
			cwextrabed=document.getElementsByName('Cwextra')[0].value
			cwoextrabed=document.getElementsByName('Cwoextra')[0].value
			totroomcost=document.getElementsByName('roomcost')[0].value
			roomcost=Math.round((parseFloat(totroomcost)/(parseFloat(nights)*parseFloat(rooms)))*100)/100	
			roomcost=roomcost.toString()
			plancost=document.getElementsByName('plancost')[0].value
			extraperson=document.getElementsByName('extrabedcost')[0].value
			childwex=document.getElementsByName('childwexcost')[0].value
			childwoex=document.getElementsByName('childwoexcost')[0].value
			tothotelcost=document.getElementsByName('hotelcost')[0].value
			staygstrate=document.getElementsByName('gststayrate')[0].value
			foodgstrate=document.getElementsByName('gstfoodrate')[0].value
			staygst=document.getElementsByName('totstaygst')[0].value
			foodgst=document.getElementsByName('totfoodgst')[0].value
			totalgst=document.getElementsByName('totgst')[0].value
			finalpr=document.getElementsByName('finalwithgst')[0].value
			pmtinfo=document.getElementById('paymentinfo').value
			paid=document.getElementById('amtpaid').value







			$.ajax({

				type: "post",
				url: "/dobooking",
				dataType: 'json',
				async:false,
				data: JSON.stringify({
					"cname":cname,"contact":contact,"email":email,"bookdate":bookdate,"rooms":rooms,"chkin":chkin,"chkout":chkout,"nights":nights,"catagory":cat,"plan":plan,
					"exbed":extrabed,"cwextrabed":cwextrabed,"cwoextrabed":cwoextrabed,"roomprice":roomcost,"totroomcost":totroomcost,"plancharges":plancost,"extrabed":extraperson,
					"childwexcost":childwex,"childwoexcost":childwoex,"tothotelcost":tothotelcost,"staygstrate":staygstrate,"foodgstrate":foodgstrate,"staygst":staygst,"foodgst":foodgst,
					"totalgst":totalgst,"finalpr":finalpr,"amtpaid":paid,"pmtinfo":pmtinfo,"status":"confirmed"

				}),
				contentType: 'application/json',
				success: function(data) {
					console.log(data.response)
					if(data.response.localeCompare("Success")==0){
						$('#mainhold').html('<h2>Rooms Booked Successfully</h2><br><button onclick="location.reload();">Book Another Rooms </button>');
					}
					else if(data.response.localeCompare("available")==0){
						$('#mainhold').html('<h2>Rooms Booked for Customer with same category</h2><br><button onclick="location.reload();">Try Again</button>');

					}
					else{
						$('#mainhold').html('<h2>Rooms Not Booked</h2><br><button onclick="location.reload();">Try Again</button>');

					}

				}
			});


			return false;
		}
