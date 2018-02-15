function loadcategoryplanform(name,valu) {
	if (name.localeCompare('stayslabs')==0){
		document.getElementById('categoryform').innerHTML="";
		if(valu>0 && valu<20){
			for(i=0;i<valu;i++){
			$('#categoryform').append('Category Name<input type="text"  name="catname"'+i+'>');
			}
		}
	}
	if(name.localeCompare('noofplans')==0){
		document.getElementById('planform').innerHTML="";
		if(valu>0 && valu<20){
			for(i=0;i<valu;i++){
			$('#planform').append('Plan Name<input type="text"  name="planname"'+i+'>');
			}
		}

	}
	
}
function loadgstform(name,valu){
	if (name.localeCompare('stayslabs')==0){
		document.getElementById('staygstform').innerHTML="";
		if(valu>0 && valu<20){
			for(i=0;i<valu;i++){
			$('#staygstform').append('From<input type="number" min="0" name="stayslabfrom"'+i+'>&emsp;&emsp;To <input type="number" min="0" name="stayslabto"'+i+'>&emsp;&emsp;Percentage <input type="number" min="0" max="100" name="stayslabper"'+i+'>');
			}
		}

	}
	if(name.localeCompare('foodslabs')==0){
		document.getElementById('foodgstform').innerHTML="";
		if(valu>0 && valu<20){
			for(i=0;i<valu;i++){
			$('#foodgstform').append('From<input type="number" min="0" name="foodslabfrom"'+i+'>&emsp;&emsp;To <input type="number" min="0" name="foodslabto"'+i+'>&emsp;&emsp;Percentage <input type="number" min="0" max="100" name="foodslabper"'+i+'>');
			}
		}

	}
	
}