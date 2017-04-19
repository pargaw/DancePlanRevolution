//put member dictionary into local storage
if (localStorage.getItem('memberDict')==null){
	localStorage.setItem("memberDict", JSON.stringify({ 'Beth':0, 'Rob':0, 'Stefanie':0,'David':0}));
} 
var memberDict1 = JSON.parse(window.localStorage.getItem("memberDict"));
var members = Object.keys(memberDict1);

function setupMembers(){
	var t = document.getElementById('myTable');

	var members = ['Beth','Rob','Stefanie','David']

	var numrows = Math.ceil(members.length/3.0);
	var counter = 0;
	for(var i = 0; i < numrows; i++){
	  var tr = t.insertRow();
	  for(var j = 0; j < 3; j++){
	  	if (counter < members.length){
	  	  //add member image to table
	  	  var tdMem = tr.insertCell();
	  	  tdMem.style.padding = "3px 3px 20px 3px";
	  	  var figMem = document.createElement("FIGURE");
	  	  figMem.setAttribute("id","fig"+counter);
	  	  figMem.style.textAlign= "center";

	      var member = document.createElement("IMG");
	      member.setAttribute("src", "img/"+members[counter]+".jpg");
	      member.setAttribute("id","member"+counter);
	      member.width = "80";
	      member.height = "80";
	      member.style.borderRadius  = "50%";
	      member.style.position = "relative";

	      //add check mark in the same place
	      var tdCheck = tr.insertCell();
	      var check = document.createElement("IMG");
	      check.setAttribute("src", "img/redCheck.png")
	      check.setAttribute("id","check"+counter);
	      check.style.display = "block";
	      check.width = "60";
	      check.height = "60";
	      
	      var horizPadding = 6;
	      var vertPadding = 40;
	      var leftVal = member.width*j+17+10+horizPadding*j;
	      check.style.left = leftVal+"px";
	      var topVal = member.width*i+16+10+vertPadding*i;
	      check.style.top = topVal+"px";
	      check.style.zIndex = "2";
	      check.style.position = "absolute";
	      if (memberDict1[members[counter]]==1){
	      	check.style.opacity = "1";
	      } else{
	      	check.style.opacity = "0";
	      }
	      check.onclick= function() {changeOpacity(this.id);};

	      figMem.appendChild(member)
	      tdMem.appendChild(figMem);
	      tdCheck.appendChild(check);

	      //update counter to new member
	      counter +=1;

	  	}  
	  }
	}
	var div = document.getElementById("attend");
	div.appendChild(t);

	//add name to member pictures
	for (var c=0;c<members.length;c++){
	  var caption = document.createElement("FIGCAPTION");
	  var txt = document.createTextNode(members[c]);
	  caption.appendChild(txt);
	  document.getElementById("fig"+c).appendChild(caption);
	}
	
}

//hide and view check mark on member images
function changeOpacity(id){
	var index = id.match(/([A-Za-z]+)([0-9]+)/)[2];
	if (document.getElementById(id).style.opacity != "0") {
        document.getElementById(id).style.opacity = "0";
    } else {
        document.getElementById(id).style.opacity = "1";
    }
}

function saveAttendance(){
	for (var c=0;c<members.length;c++){
		var id = "check"+c;
		if (document.getElementById(id).style.opacity ==0) {
	        memberDict1[members[c]]=0;
	        localStorage.setItem("memberDict", JSON.stringify(memberDict1));
	    } else {
	        memberDict1[members[c]]=1;
	        localStorage.setItem("memberDict", JSON.stringify(memberDict1));
	    }
	    //add saved toast 
		var x = document.getElementById("snackbar")
	    x.style.visibility = "visible";
	    setTimeout(function(){ x.style.visibility = "hidden"; }, 500);
	}
}