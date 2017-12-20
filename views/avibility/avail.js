function maininsert(){
	document.getElementById('maincontent').innerHTML="";
	x = document.createTextNode("From Date");
	document.getElementById('maincontent').appendChild(x);
	y = document.createElement("input");
	y.setAttribute("type","date");
	y.setAttribute("name","fromdate");
	y.setAttribute("onchange","settodate()")
		document.getElementById("maincontent").appendChild(y);
		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("maincontent").appendChild(x);

		x = document.createTextNode("To Date");
		document.getElementById('maincontent').appendChild(x);
		y = document.createElement("input");
		y.setAttribute("type","date");
		y.setAttribute("name","todate");
		y.setAttribute("onchange","checkday()")
			document.getElementById("maincontent").appendChild(y);
			x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
			document.getElementById("maincontent").appendChild(x);


			y = document.createElement("input");
			y.setAttribute("type","button");
			y.setAttribute("value","Load Form");
			y.setAttribute("onclick","loadform()")
				document.getElementById("maincontent").appendChild(y);
				x = document.createElement('br');
				document.getElementById("maincontent").appendChild(x);
				x = document.createElement('span');
				x.setAttribute("id","warningmsg");
				document.getElementById("maincontent").appendChild(x);
				x = document.createElement('br');
				document.getElementById("maincontent").appendChild(x);
				x = document.createElement('div');
				x.setAttribute("id","formholder");
				document.getElementById("maincontent").appendChild(x);
				setmin();
}

function mainedit(){
	document.getElementById('maincontent').innerHTML="";
	x = document.createTextNode("Date to Edit");
	document.getElementById('maincontent').appendChild(x);
	y = document.createElement("input");
	y.setAttribute("type","date");
	y.setAttribute("name","edate");
		document.getElementById("maincontent").appendChild(y);
		y = document.createElement("input");
		y.setAttribute("type","button");
		y.setAttribute("value","Load Form");
		y.setAttribute("onclick","loadeditform()")
		document.getElementById("maincontent").appendChild(y);
		x = document.createElement('br');
		document.getElementById("maincontent").appendChild(x);
		x = document.createElement('div');
		x.setAttribute("id","formholder");
		document.getElementById("maincontent").appendChild(x);
}

/*
insert availibility functions start with setmin() and  ends with insertavailability()
*/
//set minimum date today

function setmin(){
	var out = null;

	$.ajax({

		type: "post",
		url: "/getdate",
		async: false,
		dataType: 'json',
		data: JSON.stringify({
			"any": "any"
		}),
		contentType: 'application/json',
		success: function(data) {
			out = data;
		}
	});
	var today = new Date(out);
	var dd = today.getDate();
	var mm = today.getMonth() + 1;
	var yyyy = today.getFullYear();
	if (dd < 10) {
		dd = '0' + dd
	}
	if (mm < 10) {
		mm = '0' + mm
	}

	today = yyyy + '-' + mm + '-' + dd;
	document.getElementsByName('fromdate')[0].setAttribute("min", today);
	document.getElementsByName('todate')[0].setAttribute("min", today);
}
//set todate minimum=fromdate
function settodate(){
	var s=document.getElementsByName('fromdate')[0].value;
	document.getElementsByName('todate')[0].setAttribute("min", s);
	document.getElementsByName('todate')[0].value=s;
	checkday();
}

//check weekend to give warning
function checkday(){
	date1=document.getElementsByName('fromdate')[0].value;
	date2=document.getElementsByName('todate')[0].value

	var d1 = new Date(date1),
	d2 = new Date(date2),
	isWeekend = false;


	while (d1 <= d2) {
		var day = d1.getDay();
		isWeekend = (day === 6) || (day === 0);

		d1.setDate(d1.getDate() + 1);
	}
	if(isWeekend==true)
	document.getElementById('warningmsg').innerHTML="Dates Contain Saturdays or Sundays";
	else
	document.getElementById('warningmsg').innerHTML="";

}
var cat_plans;
function loadform(){
	from=document.getElementsByName('fromdate')[0].value
	to=document.getElementsByName('todate')[0].value
	availibility="";
	$.ajax({

		type: "post",
		url: "/checkfilled",
		dataType: 'json',
		async:false,
		data: JSON.stringify({
			"from": from,
			"to": to

		}),
		contentType: 'application/json',
		success: function(data) {

			availability=data.d;}

		});
	// if selected dates has already available data then print "Already Available"
	if( availability.localeCompare("available")==0){
		document.getElementById('formholder').innerHTML="Already available";
	}
	//if selected dates has no available data then create form to insert availability
	else{
		//get all catagories and plans available in hotel

		$.ajax({

			type: "post",
			url: "/getcat",
			async:false,
			dataType: 'json',
			data: JSON.stringify({
				"any": "any",


			}),
			contentType: 'application/json',
			success: function(data) {cat_plans=data;}

		});
		//display form dynamically
		displayform(cat_plans);
	}
}
//create form for inserting data
function displayform(catplans){
	document.getElementById('formholder').innerHTML="";

	x = document.createTextNode("Rooms");
	document.getElementById('formholder').appendChild(x);
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	var y = document.createElement("fieldset");
	y.setAttribute("id","roomscat");
	document.getElementById('formholder').appendChild(y);
	for(i=0;i<catplans.catagories.length;i++){
		var y = document.createElement("input");
		y.setAttribute("type","text");
		y.setAttribute("name","cat"+i)
		y.setAttribute("value",catplans.catagories[i])
		y.setAttribute("readonly","readonly")
		document.getElementById("roomscat").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomscat").appendChild(x);

		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("name","avlroom"+i)
		y.setAttribute("min","0")
		y.setAttribute("placeholder","Rooms Availability ")
		document.getElementById("roomscat").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomscat").appendChild(x);


		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("name","roomprice"+i)
			y.setAttribute("min","0")
		y.setAttribute("placeholder","Base Room Price ")
		document.getElementById("roomscat").appendChild(y);
		y = document.createElement("br");
		document.getElementById("roomscat").appendChild(y);
	}
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	y = document.createElement("input");
	y.setAttribute("type","number");
	y.setAttribute("name","extrbed");
	y.setAttribute("min","0")
	y.setAttribute("placeholder","Extrabed Price")
	document.getElementById('formholder').appendChild(y);
	x = document.createTextNode('\u00A0\u00A0\u00A0' +'PromoCode'+ '\u00A0\u00A0');
		document.getElementById("formholder").appendChild(x);
	y = document.createElement("input");
	y.setAttribute("type","checkbox");
	y.setAttribute("name","PromoCode")
	document.getElementById('formholder').appendChild(y);

		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);

	x = document.createTextNode("Plans");
	document.getElementById('formholder').appendChild(x);
		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	var y = document.createElement("fieldset");
	y.setAttribute("id","roomsplan");
	document.getElementById('formholder').appendChild(y);
	for(i=0;i<catplans.plans.length;i++){
		var y = document.createElement("input");
		y.setAttribute("type","text");
		y.setAttribute("name","plan"+i)
		y.setAttribute("value",catplans.plans[i])
		y.setAttribute("readonly","readonly")
		document.getElementById("roomsplan").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomsplan").appendChild(x);

		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("min","0")
		y.setAttribute("name","planprice"+i)
		y.setAttribute("placeholder","Plan Charges ")
		document.getElementById("roomsplan").appendChild(y);


		y = document.createElement("br");
		document.getElementById("roomsplan").appendChild(y);
	}
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
		x=document.createTextNode("Please write numeric data services which you want to offer in selected dates write \"0\" if you want to offer at no cost otherwise leave it blank that shows \"service not offered \"");
document.getElementById("formholder").appendChild(x);
y = document.createElement("br");
	document.getElementById("formholder").appendChild(y);
	var y = document.createElement("input");
	y.setAttribute("value","submit");
	y.setAttribute("type","button");
	y.setAttribute("onclick","insertavailability()");
	document.getElementById('formholder').appendChild(y);
	x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
	document.getElementById("formholder").appendChild(x);
	var y = document.createElement("input");
	y.setAttribute("value","reset");
	y.setAttribute("type","button");
	y.setAttribute("onclick","resetData()");
	document.getElementById('formholder').appendChild(y);
}

function resetData(){
	location.reload();
}

function insertavailability(){
	var frdate=document.getElementsByName('fromdate')[0].value
	tdate=document.getElementsByName('todate')[0].value
	var roomsarr=[],plansarr=[]
	var catcount=cat_plans.catagories.length;
	var plancount=cat_plans.plans.length;
	for( i=0;i<catcount;i++){
		if((document.getElementsByName('avlroom'+i)[0].value!="" &&document.getElementsByName('avlroom'+i)[0].value!=null  ),( document.getElementsByName('roomprice'+i)[0].value!="" &&document.getElementsByName('roomprice'+i)[0].value!=null )){
			roomsarr.push({"catagory":document.getElementsByName('cat'+i)[0].value,"available":parseInt(document.getElementsByName('avlroom'+i)[0].value),"price":document.getElementsByName('roomprice'+i)[0].value});
		}
	}
	x=document.getElementsByName('extrbed')[0].value
	if(x==null || x==""){
		document.getElementsByName('extrbed')[0].focus()
		return

	}
	if(x.localeCompare("")==0){
		document.getElementsByName('extrbed')[0].focus()
		return

	}
	exbed=x

	pro=(document.getElementsByName('PromoCode')[0].checked?"yes":"no")
	for( i=0;i<plancount;i++){
		if(document.getElementsByName('planprice'+i)[0].value!="" &&document.getElementsByName('planprice'+i)[0].value!=null  ){
			plansarr.push({"name":document.getElementsByName('plan'+i)[0].value,"price":document.getElementsByName('planprice'+i)[0].value});
		}
	}


	$.ajax({

			type: "post",
			url: "/insertavail",
			dataType: 'json',
			data: JSON.stringify({

				"fromdate":frdate,"todate":tdate,"Rooms":roomsarr,"PromoCode":pro,"extrabed":exbed,"Plans":plansarr

			}),
			contentType: 'application/json',
			success: function(data) {
				if("Success".localeCompare(data.res)==0){
					document.getElementById('formholder').innerHTML="<h2>Inserted Successfully<h2>"
				}
			}

		});
}


/*
editing functions start from loadeditform()
*/


var cat_plans;
var retrived_json;
function loadeditform(){
	var edate=document.getElementsByName('edate')[0].value
	$.ajax({

		type: "post",
		url: "/checkfilled",
		dataType: 'json',
		async:false,
		data: JSON.stringify({
			"from": edate,
			"to": edate

		}),
		contentType: 'application/json',
		success: function(data) {

			availability=data.d;}

		});
	// if selected date has already available data then print "Already Available"
	if( availability.localeCompare("available")==0){

		$.ajax({
			type: "post",
			url: "/getcat",
			dataType: 'json',
			async:false,
			data: JSON.stringify({
				"any": "any"
			}),
			contentType: 'application/json',
			success: function(data) {cat_plans=data;}
		});
		$.ajax({
			type: "post",
			url: "/geteditdata",
			dataType: 'json',
			async:false,
			data: JSON.stringify({
				"edate": edate
			}),
			contentType: 'application/json',
			success: function(data) {retrived_json=data;}
		});
		displayeditform();

	}
	else{
		document.getElementById('formholder').innerHTML="Please Insert Availibility for givendate";
	}
}
function displayeditform(){
	document.getElementById('formholder').innerHTML="";

	x = document.createTextNode("Rooms");
	document.getElementById('formholder').appendChild(x);
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	var y = document.createElement("fieldset");
	y.setAttribute("id","roomscat");
	document.getElementById('formholder').appendChild(y);

	for(i=0;i<cat_plans.catagories.length;i++){
		var y = document.createElement("input");
		y.setAttribute("type","text");
		y.setAttribute("name","cat"+i)
		y.setAttribute("value",cat_plans.catagories[i])
		y.setAttribute("readonly","readonly")
		document.getElementById("roomscat").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomscat").appendChild(x);
		index=0;
flag=false;
		for(j=0;j<retrived_json.room.length;j++){
		if(retrived_json.room[j].catagory.localeCompare(cat_plans.catagories[i])==0){
			index=j;flag=false;
			break;

		}
		flag=true;

	}

		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("name","avlroom"+i)
		y.setAttribute("min","0")
		if(flag==true)
		y.setAttribute("value","")
		else
		y.setAttribute("value",retrived_json.room[index].available)
		y.setAttribute("placeholder","Rooms Availability ")
		document.getElementById("roomscat").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomscat").appendChild(x);


		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("name","roomprice"+i)
			y.setAttribute("min","0")
			if(flag==true)
			y.setAttribute("value","")
			else
			y.setAttribute("value",retrived_json.room[index].price)
		y.setAttribute("placeholder","Base Room Price ")
		document.getElementById("roomscat").appendChild(y);
		y = document.createElement("br");
		document.getElementById("roomscat").appendChild(y);
	}
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	y = document.createElement("input");
	y.setAttribute("type","number");
	y.setAttribute("name","extrbed");
	y.setAttribute("min","0")
	y.setAttribute("value",retrived_json.Extrabed)
	y.setAttribute("placeholder","Extrabed Price")
	document.getElementById('formholder').appendChild(y);
	x = document.createTextNode('\u00A0\u00A0\u00A0' +'PromoCode'+ '\u00A0\u00A0');
		document.getElementById("formholder").appendChild(x);
	y = document.createElement("input");
	y.setAttribute("type","checkbox");
	y.setAttribute("name","PromoCode")
	flg=false;
	if(retrived_json.coupon.localeCompare("yes")==0){
		y.setAttribute("checked","checked")
	}
	else{
		flg=false;
	}

	document.getElementById('formholder').appendChild(y);

		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);

	x = document.createTextNode("Plans");
	document.getElementById('formholder').appendChild(x);
		y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
	var y = document.createElement("fieldset");
	y.setAttribute("id","roomsplan");
	document.getElementById('formholder').appendChild(y);

	for(i=0;i<cat_plans.plans.length;i++){
		var y = document.createElement("input");
		y.setAttribute("type","text");
		y.setAttribute("name","plan"+i)
		y.setAttribute("value",cat_plans.plans[i])
		y.setAttribute("readonly","readonly")
		document.getElementById("roomsplan").appendChild(y);
		index=0;
		flag=false
		if(retrived_json.Plans.length!=0){
			for(j=0;j<retrived_json.Plans.length;j++){
				if(retrived_json.Plans[j].name.localeCompare(cat_plans.plans[i])==0){

					index=j
					flag=false;
					break;

				}
				flag=true;

			}
		}
		else{
			flag=true;
		}
		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomsplan").appendChild(x);

		y = document.createElement("input");
		y.setAttribute("type","number");
		y.setAttribute("min","0")
		y.setAttribute("name","planprice"+i)
		if(flag==true)
		y.setAttribute("value","")
		else
		y.setAttribute("value",retrived_json.Plans[index].price)
		y.setAttribute("placeholder","Plan Charges ")
		document.getElementById("roomsplan").appendChild(y);


		y = document.createElement("br");
		document.getElementById("roomsplan").appendChild(y);
	}
	y = document.createElement("br");
		document.getElementById("formholder").appendChild(y);
		x=document.createTextNode("Please write numeric data services which you want to offer in selected dates write \"0\" if you want to offer at no cost otherwise leave it blank that shows \"service not offered \"");
document.getElementById("formholder").appendChild(x);
y = document.createElement("br");
	document.getElementById("formholder").appendChild(y);
	var y = document.createElement("input");
	y.setAttribute("value","Update");
	y.setAttribute("type","button");
	y.setAttribute("onclick","updateavailability()");
	document.getElementById("formholder").appendChild(y);


}
function updateavailability(){
	var edate=document.getElementsByName('edate')[0].value
	var roomsarr=[],plansarr=[]
	var catcount=cat_plans.catagories.length;
	var plancount=cat_plans.plans.length;
	for( i=0;i<catcount;i++){
		if((document.getElementsByName('avlroom'+i)[0].value!="" &&document.getElementsByName('avlroom'+i)[0].value!=null  ),( document.getElementsByName('roomprice'+i)[0].value!="" && document.getElementsByName('roomprice'+i)[0].value!=null )){
			roomsarr.push({"catagory":document.getElementsByName('cat'+i)[0].value,"available":parseInt(document.getElementsByName('avlroom'+i)[0].value),"price":document.getElementsByName('roomprice'+i)[0].value});
		}
	}
	exbed=document.getElementsByName('extrbed')[0].value
	pro=(document.getElementsByName('PromoCode')[0].checked?"yes":"no")
	for( i=0;i<plancount;i++){
		if( document.getElementsByName('planprice'+i)[0].value!="" &&document.getElementsByName('planprice'+i)[0].value!=null  ){
			plansarr.push({"name":document.getElementsByName('plan'+i)[0].value,"price":document.getElementsByName('planprice'+i)[0].value});
		}
	}

	$.ajax({

			type: "post",
			url: "/updateavail",
			dataType: 'json',
			data: JSON.stringify({

				"edate":edate,"Rooms":roomsarr,"PromoCode":pro,"extrabed":exbed,"Plans":plansarr

			}),
			contentType: 'application/json',
			success: function(data) {
				if("Success".localeCompare(data.res)==0){
					document.getElementById('formholder').innerHTML="<h2>Updated Successfully<h2>"
				}
				else{
						document.getElementById('formholder').innerHTML="<h2>Not Updated, Someting went wrong<h2>"
				}
			}

		});


}
