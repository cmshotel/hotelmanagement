inf=[];
function loadfilter(){
	var x=document.getElementById('optionswise').value
	if(x.localeCompare("bookdatewise")==0){
		$('#filterhold').html('Booking date from&nbsp;<input type="date" id="datefrom">&emsp;&emsp;Booking date to&nbsp;<input type="date" id="dateto">&emsp;&emsp;'
			+'<button onclick="bookdateload()">Find</button>');
	}
	else if(x.localeCompare("chkindatewise")==0){
		$('#filterhold').html('Check in date from&nbsp;<input type="date" id="datefrom">&emsp;&emsp;Check in date to&nbsp;<input type="date" id="dateto">&emsp;&emsp;'
			+'<button onclick="chkindateload()">Find</button>');
	}
	else{
		$('#filterhold').html('');
	}
}
function bookdateload(){
	frm=$('#datefrom').val();
	t=$('#dateto').val();
	 $.ajax({
    type:"post",
    url:"/getview",
    dataType: 'json',
        data: JSON.stringify({"from":frm,"to":t,"flg":"bookdate"}),
        contentType: 'application/json',
        success: function(data){
        	
			$('#selecthold').html('');
        	
        	if(data.length!=0){
        		inf=data;
        		$('#selecthold').html('<table id="mytab" border="1" cellpadding="5"></table>')
        		$('#mytab').append('<tr><th>Booking Date</th><th>Check in Date</th><th>Customer Name</th><th>Contact Number</th><th>Category</th><th>Rooms</th><th>Nights</th><th>Select</th></tr>')
        		for( i=0;i<data.length;i++){
        			$('#mytab').append('<tr><td>'+data[i].bookdate+'</td><td>'+data[i].chkin+'</td><td>'+data[i].cname+'</td><td>'+data[i].contact+'</td><td>'+data[i].catagory+'</td><td>'+data[i].rooms+'</td><td>'+data[i].nights+'</td><td><input type="radio" value="'+i+'" onchange="selecteddoc(this.value)" name="radiogrp"></td></tr>');
        		}
        		//$('#selecthold').append('')
        	}
        	else{
        		$('#selecthold').html('<h2>No Results</h2>');
        		$('#detailshold').html('')
        	}
        

          
           
        }
    });
}
function chkindateload(){
	frm=$('#datefrom').val();
	t=$('#dateto').val();
	 $.ajax({
    type:"post",
    url:"/getview",
    dataType: 'json',
        data: JSON.stringify({"from":frm,"to":t,"flg":"chkindate"}),
        contentType: 'application/json',
        success: function(data){
        	$('#selecthold').html('');
        	
        	if(data.length!=0){
        		inf=data;
        		$('#selecthold').html('<table id="mytab" border="1" cellpadding="5"></table>')
        		$('#mytab').append('<tr><th>Booking Date</th><th>Check in Date</th><th>Customer Name</th><th>Contact Number</th><th>Category</th><th>Rooms</th><th>Nights</th><th>Select</th></tr>')
        		for( i=0;i<data.length;i++){
        			$('#mytab').append('<tr><td>'+data[i].bookdate+'</td><td>'+data[i].chkin+'</td><td>'+data[i].cname+'</td><td>'+data[i].contact+'</td><td>'+data[i].catagory+'</td><td>'+data[i].rooms+'</td><td>'+data[i].nights+'</td><td><input type="radio" value="'+i+'" onchange="selecteddoc(this.value)" name="radiogrp"></td></tr>');
        		}
        	}
          else{
        		$('#selecthold').html('<h2>No Results</h2>');
        		$('#detailshold').html('')
        	}
           
        }
    });

}

function selecteddoc(valu){
var x=inf;

$('#detailshold').html('<table border="1" id="ytab" cellpadding="5"></table>');
$('#ytab').append('<tr><td>Customer Name</td><td>'+x[valu].cname+'</td><td>Contact</td><td>'+x[valu].contact+'</td><td>Email</td><td>'+x[valu].email+'</td></tr>')
$('#ytab').append('<tr><td>Booking Date</td><td>'+x[valu].bookdate+'</td><td>Rooms</td><td>'+x[valu].rooms+'</td><td>Category</td><td>'+x[valu].catagory+'</td></tr>')

$('#ytab').append('<tr><td>Check in</td><td>'+x[valu].chkin+'</td><td>Check out</td><td>'+x[valu].chkout+'</td><td>Nights</td><td>'+x[valu].nights+'</td></tr>')
$('#ytab').append('<tr><td>Room Price</td><td>'+x[valu].roomprice+'</td><td>Total Room Cost</td><td>'+x[valu].totroomcost+'</td></tr>')
$('#ytab').append('<tr><td>Plan</td><td>'+x[valu].plan+'</td><td>Plan Charges</td><td>'+x[valu].plancharges+'</td></tr>')
$('#ytab').append('<tr><td>Child with Ex.Bed</td><td>'+x[valu].cwextrabed+'</td><td>Cost</td><td>'+x[valu].childwexcost+'</td></tr>')
$('#ytab').append('<tr><td>Child without Ex.Bed</td><td>'+x[valu].cwoextrabed+'</td><td>Cost</td><td>'+x[valu].childwoexcost+'</td></tr>')
$('#ytab').append('<tr><td>Extrabed</td><td>'+x[valu].exbed+'</td><td>Cost</td><td>'+x[valu].extrabed+'</td></tr>')
$('#ytab').append('<tr><td>GST Rate for Stay</td><td>'+x[valu].staygstrate+'</td><td>Stay GST</td><td>'+x[valu].staygst+'</td></tr>')
$('#ytab').append('<tr><td>GST Rate for Food</td><td>'+x[valu].foodgstrate+'</td><td>Food GST</td><td>'+x[valu].foodgst+'</td></tr>')
$('#ytab').append('<tr><td>Total Hotel Cost</td><td>'+x[valu].tothotelcost+'</td><td>Total GST</td><td>'+x[valu].totalgst+'</td><td>Final Price</td><td>'+x[valu].finalpr+'</td></tr>')
$('#ytab').append('<tr><td>Amount Paid</td><td>'+x[valu].amtpaid+'</td><td>Status</td><td>'+x[valu].status+'</td></tr>')
$('#detailshold').append('<br>Payment info:&nbsp;'+x[valu].pmtinfo)

}

