function maininsert() {
	/* $('#maincontent').html('');	
	$('#maincontent').append('From Date<input type="date" name="fromdate" onchange="settodate()">&emsp;&emsp;');
	$('#maincontent').append('To Date<input type="date" name="todate" onchange="checkday()">&emsp;&emsp;');
	$('#maincontent').append('<input type="button" value="Load Form" onclick="loadform()"><br><br><span id="warningmsg"></span><div id="formholder"></div>'); */


	$('#maincontent').html('\
	<div class="avil-instruction container">\
	<div class="col-md-8 col-sm-8 col-xs-12">\
	  <div class="input-group ">\
		<span class="input-group-addon">\
		  <span class="glyphicon glyphicon-calendar"></span>\
		</span>\
		<input type="text" name="newAvildate" id="newAvildate" class="form-control" />\
	  </div>\
	</div>\
	<div class="avilForm col-md-4 col-sm-4 col-xs-12">\
	  <button class="btn btn-primary" onclick="loadform()">Get Avibility Form</button>\
	</div>\
  </div>\
  <span id="warningmsg"></span>\
  <div id="formholder"></div>\
  ');
	setmin();
}

function mainedit() {
	$('#maincontent').html('\
	<div class="edit-instruction container">\
		<div class="col-md-8 col-sm-8 col-xs-12">\
	  		<div class="input-group ">\
				<span class="input-group-addon">\
					<span class="glyphicon glyphicon-calendar"></span>\
				</span>\
				<input type="text" name="editAvildate" id="editAvildate" class="form-control" />\
	  		</div>\
		</div>\
		<div class="avilForm col-md-4 col-sm-4 col-xs-12">\
	  		<button class="btn btn-primary" onclick="loadeditform()">Edit Avibility Form</button>\
		</div>\
  	</div>\
	  <div id="formholder"></div>\
	  <script>\
	  $("#editAvildate").datepicker({todayHighlight:true})\
		  </script>\
	');
}

/*
insert availibility functions start with setmin() and  ends with insertavailability()
*/
//set minimum date today

function setmin() {
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
		success: function (data) {
			out = data;
		}
	});

	$('#newAvildate').daterangepicker({
		minDate: new Date(out),
		todayHighlight: true,
	});
	

	// var today = new Date(out);
	// var dd = today.getDate();
	// var mm = today.getMonth() + 1;
	// var yyyy = today.getFullYear();
	// if (dd < 10) {
	// 	dd = '0' + dd
	// }
	// if (mm < 10) {
	// 	mm = '0' + mm
	// }
	// today = yyyy + '-' + mm + '-' + dd;
	// document.getElementsByName('fromdate')[0].setAttribute("min", today);
	// document.getElementsByName('todate')[0].setAttribute("min", today);
}
//set todate minimum=fromdate
/* function settodate(){
	var s=document.getElementsByName('fromdate')[0].value;
	document.getElementsByName('todate')[0].setAttribute("min", s);
	document.getElementsByName('todate')[0].value=s;
	checkday();
} */

//check weekend to give warning
function checkday() {
	var stayDate = $('#newAvildate').val();
	stayDate = stayDate.split(" - ");
	console.log(stayDate);

	var d1 = new Date(date1),
		d2 = new Date(date2),
		isWeekend = false;


	while (d1 <= d2) {
		var day = d1.getDay();
		isWeekend = (day === 6) || (day === 0);

		d1.setDate(d1.getDate() + 1);
	}
	if (isWeekend == true)
		document.getElementById('warningmsg').innerHTML = "Dates Contain Saturdays or Sundays";
	else
		document.getElementById('warningmsg').innerHTML = "";

}
var cat_plans;

/* 
 *Load Form for new avaibility
 */
function loadform() {
	var stayDate = $('#newAvildate').val();
	stayDate = stayDate.split(" - ");
	console.log(stayDate);

	availibility = "";
	$.ajax({

		type: "post",
		url: "/checkfilled",
		dataType: 'json',
		async: false,
		data: JSON.stringify({
			"from": stayDate[0],
			"to": stayDate[0]

		}),
		contentType: 'application/json',
		success: function (data) {
			availability = data.d;
			console.log("data.d"+data.d);
		}

	});
	// if selected dates has already available data then print "Already Available"
	if (availability.localeCompare("available") == 0) {
		document.getElementById('formholder').innerHTML = "Already available";
	}
	//if selected dates has no available data then create form to insert availability
	else {
		//get all catagories and plans available in hotel

		$.ajax({

			type: "post",
			url: "/getcat",
			async: false,
			dataType: 'json',
			data: JSON.stringify({
				"any": "any",


			}),	
			contentType: 'application/json',
			success: function (data) {
				cat_plans = data;
			}

		});
		//display form dynamically
		displayform(cat_plans);
	}
}
//create form for inserting data
function displayform(catplans) {
	$('#formholder').html('');

	$('#formholder').append('\
	<div class="x_panel">\
        	<div class="x_title">\
                <h2>Rooms Category <small>*Check before submit</small></h2>\
                <ul class="nav navbar-right panel_toolbox">\
                    <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a></li>\
                </ul>\
				<div class="clearfix">\
				</div>\
            </div>\
			<div class="x_content">\
				<fieldset id="roomscat"></fieldset>\
            </div>\
        </div>\
	');

	for (i = 0; i < catplans.catagories.length; i++) {
		$('#roomscat').append('<input type="text" name="cat' + i + '" value="' + catplans.catagories[i] + '"readonly="readonly">&emsp;&emsp;');
		$('#roomscat').append('<input type="number" name="avlroom' + i + '" min="0" placeholder="Rooms Availability">&emsp;&emsp;');
		$('#roomscat').append('<input type="number" name="roomprice' + i + '" min="0" placeholder="Base Room Price"><br>');
	}
	
	// $('#formholder').append('<br><br>');
	// $('#formholder').append('<input type="number" name="extrbed" min="0" placeholder="Extrabed Price">&emsp;&emsp;');
	// $('#formholder').append('Promocode <input type="checkbox" name="PromoCode"><br><br>');
	// $('#formholder').append('Plans<br><fieldset id="roomsplan"></fieldset>');
	// for (i = 0; i < catplans.plans.length; i++) {
	// 	$('#roomsplan').append('<input type="text" name="plan' + i + '" value="' + catplans.plans[i] + '"readonly="readonly">&emsp;&emsp;');
	// 	$('#roomsplan').append('<input type="number" name="planprice' + i + '" min="0" placeholder="Plan Charges"><br>');
	// }
	// $('#formholder').append('<br>Please write numeric data services which you want to offer in selected dates write "0" if you want to offer at no cost otherwise leave it blank that shows "service not offered" <br><br>');

	// $('#formholder').append('<input type="button" value="Submit" onclick=insertavailability()>&emsp;&emsp;<input type="button" value="Reset" onclick=resetData()>');

}

function resetData() {
	location.reload();
}

function insertavailability() {
	var ftdate = $('#newAvildate').val().split(" - ");
	var frdate = ftdate[0];
	tdate = ftdate[1];
	var roomsarr = [],
		plansarr = []
	var catcount = cat_plans.catagories.length;
	var plancount = cat_plans.plans.length;
	for (i = 0; i < catcount; i++) {
		if ((document.getElementsByName('avlroom' + i)[0].value != "" && document.getElementsByName('avlroom' + i)[0].value != null), (document.getElementsByName('roomprice' + i)[0].value != "" && document.getElementsByName('roomprice' + i)[0].value != null)) {
			roomsarr.push({
				"catagory": document.getElementsByName('cat' + i)[0].value,
				"available": parseInt(document.getElementsByName('avlroom' + i)[0].value),
				"price": document.getElementsByName('roomprice' + i)[0].value
			});
		}
	}
	x = document.getElementsByName('extrbed')[0].value
	if (x == null || x == "") {
		document.getElementsByName('extrbed')[0].focus()
		return

	}
	if (x.localeCompare("") == 0) {
		document.getElementsByName('extrbed')[0].focus()
		return

	}
	exbed = x

	pro = (document.getElementsByName('PromoCode')[0].checked ? "yes" : "no")
	for (i = 0; i < plancount; i++) {
		if (document.getElementsByName('planprice' + i)[0].value != "" && document.getElementsByName('planprice' + i)[0].value != null) {
			plansarr.push({
				"name": document.getElementsByName('plan' + i)[0].value,
				"price": document.getElementsByName('planprice' + i)[0].value
			});
		}
	}


	$.ajax({

		type: "post",
		url: "/insertavail",
		dataType: 'json',
		data: JSON.stringify({

			"fromdate": frdate,
			"todate": tdate,
			"Rooms": roomsarr,
			"PromoCode": pro,
			"extrabed": exbed,
			"Plans": plansarr

		}),
		contentType: 'application/json',
		success: function (data) {
			if ("Success".localeCompare(data.res) == 0) {
				$('#formholder').html("<h2>Inserted Successfully<h2>");
			}
		}

	});
}


/*
editing functions start from loadeditform()
*/


var cat_plans;
var retrived_json;

function loadeditform() {
	var edate = $('#editAvildate').val();
	console.log("date"+edate);
	$.ajax({

		type: "post",
		url: "/checkfilled",
		dataType: 'json',
		async: false,
		data: JSON.stringify({
			"from": edate,
			"to": edate

		}),
		contentType: 'application/json',
		success: function (data) {

			availability = data.d;
		}

	});
	// if selected date has already available data then print "Already Available"
	if (availability.localeCompare("available") == 0) {

		$.ajax({
			type: "post",
			url: "/getcat",
			dataType: 'json',
			async: false,
			data: JSON.stringify({
				"any": "any"
			}),
			contentType: 'application/json',
			success: function (data) {
				cat_plans = data;
			}
		});
		$.ajax({
			type: "post",
			url: "/geteditdata",
			dataType: 'json',
			async: false,
			data: JSON.stringify({
				"edate": edate
			}),
			contentType: 'application/json',
			success: function (data) {
				retrived_json = data;
			}
		});
		displayeditform();

	} else {
		$('#formholder').html("Please Insert Availibility for givendate");
	}
}
/*
 * Edit Form Display
 * */
function displayeditform() {
	$('#formholder').html('');

	$('#formholder').append('Rooms<br><fieldset id="roomscat"></fieldset>');


	for (i = 0; i < cat_plans.catagories.length; i++) {
		$('#roomscat').append('<input type="text" name="cat' + i + '" value="' + cat_plans.catagories[i] + '" readonly="readonly">&emsp;&emsp;')

		index = 0;
		flag = false;
		for (j = 0; j < retrived_json.room.length; j++) {
			if (retrived_json.room[j].catagory.localeCompare(cat_plans.catagories[i]) == 0) {
				index = j;
				flag = false;
				break;

			}
			flag = true;

		}

		y = document.createElement("input");
		y.setAttribute("type", "number");
		y.setAttribute("name", "avlroom" + i)
		y.setAttribute("min", "0")
		if (flag == true)
			y.setAttribute("value", "")
		else
			y.setAttribute("value", retrived_json.room[index].available)
		y.setAttribute("placeholder", "Rooms Availability ")
		document.getElementById("roomscat").appendChild(y);

		x = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0');
		document.getElementById("roomscat").appendChild(x);


		y = document.createElement("input");
		y.setAttribute("type", "number");
		y.setAttribute("name", "roomprice" + i)
		y.setAttribute("min", "0")
		if (flag == true)
			y.setAttribute("value", "")
		else
			y.setAttribute("value", retrived_json.room[index].price)
		y.setAttribute("placeholder", "Base Room Price ")
		document.getElementById("roomscat").appendChild(y);
		y = document.createElement("br");
		document.getElementById("roomscat").appendChild(y);
	}
	$('#formholder').append('<br><input type="number" name="extrbed" min="0" value="' + retrived_json.Extrabed + '">&emsp;&emsp;Promocode');

	y = document.createElement("input");
	y.setAttribute("type", "checkbox");
	y.setAttribute("name", "PromoCode")
	flg = false;
	if (retrived_json.coupon.localeCompare("yes") == 0) {
		y.setAttribute("checked", "checked")
	} else {
		flg = false;
	}

	document.getElementById('formholder').appendChild(y);
	$('#formholder').append('<br><br>Plans<fieldset id="roomsplan"></fieldset>');


	for (i = 0; i < cat_plans.plans.length; i++) {
		$('#roomsplan').append('<input type="text" name="plan' + i + '" value="' + cat_plans.plans[i] + '" readonly="readonly">');

		index = 0;
		flag = false
		if (retrived_json.Plans.length != 0) {
			for (j = 0; j < retrived_json.Plans.length; j++) {
				if (retrived_json.Plans[j].name.localeCompare(cat_plans.plans[i]) == 0) {

					index = j
					flag = false;
					break;

				}
				flag = true;

			}
		} else {
			flag = true;
		}
		$('#roomsplan').append('&emsp;&emsp;');

		y = document.createElement("input");
		y.setAttribute("type", "number");
		y.setAttribute("min", "0")
		y.setAttribute("name", "planprice" + i)
		if (flag == true)
			y.setAttribute("value", "")
		else
			y.setAttribute("value", retrived_json.Plans[index].price)
		y.setAttribute("placeholder", "Plan Charges ")
		document.getElementById("roomsplan").appendChild(y);

		$('#roomsplan').append('<br>');

	}
	$('#formholder').append('<br> Please write numeric data services which you want to offer in selected dates write "0" if you want to offer at no cost otherwise leave it blank that shows "service not offered" <br><input type="button" value="Update" onclick="updateavailability()"');
}

function updateavailability() {
	var edate = document.getElementsByName('edate')[0].value
	var roomsarr = [],
		plansarr = []
	var catcount = cat_plans.catagories.length;
	var plancount = cat_plans.plans.length;
	for (i = 0; i < catcount; i++) {
		if ((document.getElementsByName('avlroom' + i)[0].value != "" && document.getElementsByName('avlroom' + i)[0].value != null), (document.getElementsByName('roomprice' + i)[0].value != "" && document.getElementsByName('roomprice' + i)[0].value != null)) {
			roomsarr.push({
				"catagory": document.getElementsByName('cat' + i)[0].value,
				"available": parseInt(document.getElementsByName('avlroom' + i)[0].value),
				"price": document.getElementsByName('roomprice' + i)[0].value
			});
		}
	}
	exbed = document.getElementsByName('extrbed')[0].value
	pro = (document.getElementsByName('PromoCode')[0].checked ? "yes" : "no")
	for (i = 0; i < plancount; i++) {
		if (document.getElementsByName('planprice' + i)[0].value != "" && document.getElementsByName('planprice' + i)[0].value != null) {
			plansarr.push({
				"name": document.getElementsByName('plan' + i)[0].value,
				"price": document.getElementsByName('planprice' + i)[0].value
			});
		}
	}

	$.ajax({

		type: "post",
		url: "/updateavail",
		dataType: 'json',
		data: JSON.stringify({

			"edate": edate,
			"Rooms": roomsarr,
			"PromoCode": pro,
			"extrabed": exbed,
			"Plans": plansarr

		}),
		contentType: 'application/json',
		success: function (data) {
			if ("Success".localeCompare(data.res) == 0) {
				document.getElementById('formholder').innerHTML = "<h2>Updated Successfully<h2>"
			} else {
				document.getElementById('formholder').innerHTML = "<h2>Not Updated, Someting went wrong<h2>"
			}
		}

	});
}