var data  = "jignesh";
var html = `
<html>
<head>
    <meta charset="utf-8">
    
    
    <style>
    .invoice-box {
        max-width: 800px;
        margin: auto;
        padding: 30px;
        border: 1px solid #eee;
        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
        font-size: 16px;
        line-height: 24px;
        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
        color: #555;
    }
    
    .invoice-box table {
        width: 100%;
        line-height: inherit;
        text-align: left;
    }
    
    .invoice-box table td {
        padding: 5px;
        vertical-align: top;
    }
    
    .invoice-box table tr td:nth-child(2) {
        text-align: right;
    }
    
    .invoice-box table tr.top table td {
        padding-bottom: 20px;
    }
    
    .invoice-box table tr.top table td.title {
        font-size: 45px;
        line-height: 45px;
        color: #333;
    }
    
    .invoice-box table tr.information table td {
        padding-bottom: 40px;
    }
    
    .invoice-box table tr.heading td {
        background: #eee;
        border-bottom: 1px solid #ddd;
        font-weight: bold;
    }
    
    .invoice-box table tr.details td {
        padding-bottom: 20px;
    }
    
    .invoice-box table tr.item td{
        border-bottom: 1px solid #eee;
    }
    
    .invoice-box table tr.item.last td {
        border-bottom: none;
    }
    
    .invoice-box table tr.total td:nth-child(2) {
        border-top: 2px solid #eee;
        font-weight: bold;
    }
    
    @media only screen and (max-width: 600px) {
        .invoice-box table tr.top table td {
            width: 100%;
            display: block;
            text-align: center;
        }
        
        .invoice-box table tr.information table td {
            width: 100%;
            display: block;
            text-align: center;
        }
    }
    
    /** RTL **/
    .rtl {
        direction: rtl;
        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
    }
    
    .rtl table {
        text-align: right;
    }
    
    .rtl table tr td:nth-child(2) {
        text-align: left;
    }
    </style>
</head>

<body>
    <div class="invoice-box">
        <table cellpadding="0" cellspacing="0">
            <tr class="top">
                <td colspan="2">
                    <table>
                        <tr>
                            <td class="title">
                                <img src="https://www.sparksuite.com/images/logo.png" style="width:100%; max-width:300px;">
                            </td>
                            <td></td>
                            
                            <td>
                                Invoice #: `+dbresp["ops"][0]["_id"]	+`<br>
                                Invoice Date: January 1, 2015<br>
                               
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="information">
                <td colspan="2">
                    <table>
                        <tr>
                            <td>
                                Utsav Mori.<br>
                                PHNO<br>
                                
                            </td>
                            
                            
                        </tr>
                    </table>
                </td>
            </tr>
            
            <tr class="heading">
                <td colspan="3">
                    Payment INFO
                </td>
                
               
            </tr>
            
            <tr class="details">
                <td colspan="3">
                    CheQUE
                </td>
                
               
            </tr>
            
            <tr class="heading">
                <td>
                    Item
                </td>
                
                <td>
                    Quantity
                </td>
                <td>
                    Price
                </td>
            </tr>
            
            <tr class="item">
                <td>
                    $Catagory Room
                </td>
                
                <td>
                    $rooms
                </td>
                 <td>
                    $Total Room Cost
                </td>
            </tr>
            
            <tr class="item">
                <td>
                    $PLan Charges
                </td>
                
                <td>
                    $rooms
                </td>
                 <td>
                    $Plan Cost
                </td>
            </tr>
            
            <tr class="item last">
                <td>
                    Extrabed Charges
                </td>
                <td>
                    $childwoexbed+exbed+childwithexbed
                </td>
                
                <td>
                    $exbedcost
                </td>
            </tr>
            
            <tr class="total">
                <td></td>
                <td></td>
                
                <td>
                   Total: $385.00
                </td>
            </tr>
            <tr class="total">
                <td></td>
                <td></td>
                
                <td>
                   GST: $385.00
                </td>
            </tr>
            <tr class="total">
                <td></td>
                <td></td>
                
                <td>
                   Grand Total: `+data+`
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
`; //Some HTML String from code above
var fs = require('fs');
var pdf = require('html-pdf');
var options = { format: 'Letter' };
 
pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res); // { filename: '/app/businesscard.pdf' }
});


var data  = "jignesh";
													// 	var html = `
													// 	<html>
													// 	<head>
													// 	    <meta charset="utf-8">
														    
														    
													// 	    <style>
													// 	    .invoice-box {
													// 	        max-width: 800px;
													// 	        margin: auto;
													// 	        padding: 30px;
													// 	        border: 1px solid #eee;
													// 	        box-shadow: 0 0 10px rgba(0, 0, 0, .15);
													// 	        font-size: 16px;
													// 	        line-height: 24px;
													// 	        font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
													// 	        color: #555;
													// 	    }
														    
													// 	    .invoice-box table {
													// 	        width: 100%;
													// 	        line-height: inherit;
													// 	        text-align: left;
													// 	    }
														    
													// 	    .invoice-box table td {
													// 	        padding: 5px;
													// 	        vertical-align: top;
													// 	    }
														    
													// 	    .invoice-box table tr td:nth-child(2) {
													// 	        text-align: right;
													// 	    }
														    
													// 	    .invoice-box table tr.top table td {
													// 	        padding-bottom: 20px;
													// 	    }
														    
													// 	    .invoice-box table tr.top table td.title {
													// 	        font-size: 45px;
													// 	        line-height: 45px;
													// 	        color: #333;
													// 	    }
														    
													// 	    .invoice-box table tr.information table td {
													// 	        padding-bottom: 40px;
													// 	    }
														    
													// 	    .invoice-box table tr.heading td {
													// 	        background: #eee;
													// 	        border-bottom: 1px solid #ddd;
													// 	        font-weight: bold;
													// 	    }
														    
													// 	    .invoice-box table tr.details td {
													// 	        padding-bottom: 20px;
													// 	    }
														    
													// 	    .invoice-box table tr.item td{
													// 	        border-bottom: 1px solid #eee;
													// 	    }
														    
													// 	    .invoice-box table tr.item.last td {
													// 	        border-bottom: none;
													// 	    }
														    
													// 	    .invoice-box table tr.total td:nth-child(2) {
													// 	        border-top: 2px solid #eee;
													// 	        font-weight: bold;
													// 	    }
														    
													// 	    @media only screen and (max-width: 600px) {
													// 	        .invoice-box table tr.top table td {
													// 	            width: 100%;
													// 	            display: block;
													// 	            text-align: center;
													// 	        }
														        
													// 	        .invoice-box table tr.information table td {
													// 	            width: 100%;
													// 	            display: block;
													// 	            text-align: center;
													// 	        }
													// 	    }
														    
													// 	    /** RTL **/
													// 	    .rtl {
													// 	        direction: rtl;
													// 	        font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
													// 	    }
														    
													// 	    .rtl table {
													// 	        text-align: right;
													// 	    }
														    
													// 	    .rtl table tr td:nth-child(2) {
													// 	        text-align: left;
													// 	    }
													// 	    </style>
													// 	</head>

													// 	<body>
													// 	    <div class="invoice-box">
													// 	        <table cellpadding="0" cellspacing="0">
													// 	            <tr class="top">
													// 	                <td colspan="2">
													// 	                    <table>
													// 	                        <tr>
													// 	                            <td class="title">
													// 	                                <img src="https://www.sparksuite.com/images/logo.png" style="width:100%; max-width:300px;">
													// 	                            </td>
													// 	                            <td></td>
														                            
													// 	                            <td>
													// 	                                Invoice #: 123<br>
													// 	                                Invoice Date: January 1, 2015<br>
														                               
													// 	                            </td>
													// 	                        </tr>
													// 	                    </table>
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="information">
													// 	                <td colspan="2">
													// 	                    <table>
													// 	                        <tr>
													// 	                            <td>
													// 	                                Utsav Mori.<br>
													// 	                                PHNO<br>
														                                
													// 	                            </td>
														                            
														                            
													// 	                        </tr>
													// 	                    </table>
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="heading">
													// 	                <td colspan="3">
													// 	                    Payment INFO
													// 	                </td>
														                
														               
													// 	            </tr>
														            
													// 	            <tr class="details">
													// 	                <td colspan="3">
													// 	                    CheQUE
													// 	                </td>
														                
														               
													// 	            </tr>
														            
													// 	            <tr class="heading">
													// 	                <td>
													// 	                    Item
													// 	                </td>
														                
													// 	                <td>
													// 	                    Quantity
													// 	                </td>
													// 	                <td>
													// 	                    Price
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="item">
													// 	                <td>
													// 	                    $Catagory Room
													// 	                </td>
														                
													// 	                <td>
													// 	                    $rooms
													// 	                </td>
													// 	                 <td>
													// 	                    $Total Room Cost
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="item">
													// 	                <td>
													// 	                    $PLan Charges
													// 	                </td>
														                
													// 	                <td>
													// 	                    $rooms
													// 	                </td>
													// 	                 <td>
													// 	                    $Plan Cost
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="item last">
													// 	                <td>
													// 	                    Extrabed Charges
													// 	                </td>
													// 	                <td>
													// 	                    $childwoexbed+exbed+childwithexbed
													// 	                </td>
														                
													// 	                <td>
													// 	                    $exbedcost
													// 	                </td>
													// 	            </tr>
														            
													// 	            <tr class="total">
													// 	                <td></td>
													// 	                <td></td>
														                
													// 	                <td>
													// 	                   Total: $385.00
													// 	                </td>
													// 	            </tr>
													// 	            <tr class="total">
													// 	                <td></td>
													// 	                <td></td>
														                
													// 	                <td>
													// 	                   GST: $385.00
													// 	                </td>
													// 	            </tr>
													// 	            <tr class="total">
													// 	                <td></td>
													// 	                <td></td>
														                
													// 	                <td>
													// 	                   Grand Total: `+data+`
													// 	                </td>
													// 	            </tr>
													// 	        </table>
													// 	    </div>
													// 	</body>
													// 	</html>
													// 	`; //Some HTML String from code above
													// 	var fs = require('fs');
													// 	var pdf = require('html-pdf');
													// 	var options = { format: 'Letter' };
														 
													// 	pdf.create(html, options).toFile('./businesscard.pdf', function(err, res) {
													// 	  if (err) return console.log(err);
													// 	  console.log(res); // { filename: '/app/businesscard.pdf' }
													// 	});
													//  /* 
													//   *Send Mail
													//   */
													// let mailOptions = {
												 //        from: '"Jignesh Sanghani 👻" <sanghanijignesh25@gmail.com>', // sender address
												 //        to: 'utsavrmori@gmail.com', // list of receivers
												 //        subject: 'Testing ✔', // Subject line
												 //        text: 'Hello world?', // plain text body
												 //        html: '<h1>Hello world?</h1>' // html body
												 //         attachments:[{
													//         filename: 'filename.pdf',
													//         path: '',
													//         contentType: 'application/pdf'
													//     }]
												 //    };

												 //    // send mail with defined transport object
												 //    transporter.sendMail(mailOptions, (error, info) => {
												 //        if (error) {
												 //            return console.log(error);
												 //        }
												 //    });