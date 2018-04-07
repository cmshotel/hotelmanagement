 window.onload = initialloadchart()
   function initialloadchart(){

     var d = new Date();
     d.setMonth(d.getMonth() - 3);
    m=d.getMonth()+1
    y=d.getFullYear()
    //make start date
    var m = ("0" + m).slice(-2);
    sd=y+'-'+m+'-01'

    var d = new Date();
    d.setMonth(d.getMonth() + 3);
    m=d.getMonth()+1
    var m = ("0" + m).slice(-2);
    y=d.getFullYear()
    days=daysInMonth(new Date(y+"-"+m+"-01"))
    ed=y+'-'+m+'-'+days

    $.ajax({

  		type: "post",
  		url: "/charts/getbardata",
  		dataType: 'json',
  		async:true,

  		data: JSON.stringify({
  			"start": sd,
  			"end":ed,
  			"months":7

  		}),
  		contentType: 'application/json',
  		success: function (data) {
        console.log(data)
        displaychart(data)
  		}
  	});

   }





function findforchart(){
	frommonth=$('#frommonthbar').val()
	fromyear=$('#fromyearbar').val()
	tomonth=$('#tomonthbar').val()
	toyear=$('#toyearbar').val()
	endday=daysInMonth(new Date(toyear+"-"+tomonth+"-01"));
	startdate=fromyear+"-"+frommonth+"-01";
	enddate=toyear+"-"+tomonth+"-"+endday;
	sd=new Date(startdate);
	ed=new Date(enddate)
	var months;
    months=(ed.getMonth() - sd.getMonth()) + (12 * (ed.getFullYear() - sd.getFullYear()))+1;
    
    /*not proper calculation of month*/

	$.ajax({

		type: "post",
		url: "/charts/getbardata",
		dataType: 'json',
		async:true,

		data: JSON.stringify({
			"start": startdate,
			"end":enddate,
			"months":months

		}),
		contentType: 'application/json',
		success: function (data) {

      displaychart(data)
		}
	});

}
function daysInMonth(anyDateInMonth) {
    return new Date(anyDateInMonth.getYear(),
                    anyDateInMonth.getMonth()+1,
                    0).getDate();}
function getmonthname(month_number){
  switch(month_number){
    case 1:return 'January';
    case 2:return 'February';
    case 3:return 'March';
    case 4:return 'April';
    case 5:return 'May';
    case 6:return 'June';
    case 7:return 'July';
    case 8:return 'August';
    case 9:return 'September';
    case 10:return 'October';
    case 11:return 'November';
    case 12:return 'December';


  }

}

function displaychart(dat){

  document.getElementById("chartContainer").innerHTML = '<canvas id="bar-chartcanvas"></canvas>';

  var ctx = $("#bar-chartcanvas");

  lbls=[];
  cnts=[];
  for(i=0;i<dat.length;i++){
    temp=dat[i].month.split('-')
    m=getmonthname(parseInt(temp[0]))
    lbls.push(m+'-'+temp[1])
    cnts.push(parseInt(dat[i].rooms))


  }
  /*
  get random color
  */
  var coloR = [];

        var dynamicColors = function() {
           var r = Math.floor(Math.random() * 255);
           var g = Math.floor(Math.random() * 255);
           var b = Math.floor(Math.random() * 255);
           return "rgb(" + r + "," + g + "," + b + ")";
        };

        for (var i in dat) {
           coloR.push(dynamicColors());
        }
 	  var data = {
        labels: lbls,
        datasets: [
            {
                label: "Monthly Volume",
                data: cnts,
                backgroundColor: coloR,
                borderColor: 'rgba(200, 200, 200, 0.75)',

                hoverBorderColor: 'rgba(200, 200, 200, 1)',
                borderWidth: 2
            }
        ]
    };

    //options
    var options = {
        responsive: true,
        title: {
            display: true,
            position: "left",
            text: "Monthly Volume",
            fontSize: 18,
            fontColor: "#111"
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                fontColor: "#333",
                fontSize: 16
            }
        },
        scales: {
            yAxes: [{
                ticks: {
                    min: 0
                }
            }]
        }
    };

    //create Chart class object
    var chart = new Chart(ctx, {
        type: "bar",
        data: data,
        options: options
    });

}
