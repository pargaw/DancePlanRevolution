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
	      console.log(member.offsetLeft);

	      figMem.appendChild(member)
	      tdMem.appendChild(figMem);

	      //add check mark in the same place
	      var tdCheck = tr.insertCell();
	      var check = document.createElement("IMG");
	      check.setAttribute("src", "img/redCheck.png")
	      check.setAttribute("id","check"+counter);
	      check.style.display = "block";
	      check.width = "60";
	      check.height = "60";
	      
	      var leftVal = 80*j+17+10+6*j;
	      check.style.left = leftVal+"px";
	      var topVal = 80*i+16+10+40*i;
	      check.style.top = topVal+"px";
	      check.style.zIndex = "2";
	      check.style.position = "absolute";
	      check.style.display = 'block';
	      check.style.opacity = "0";
	      check.onclick= function() {changeOpacity(this.id);};

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
	if (document.getElementById(id).style.opacity != "0") {
        document.getElementById(id).style.opacity = "0";
    } else {
        document.getElementById(id).style.opacity = "1";;
    }
}