// SAMPLE DATA
var sampleAnnouncements = [
	{
		"date": "02/03/2017", 
		"msg": "First post of the semester - welcome! :)"
	},

	{
		"date": "02/09/2017", 
		"msg": "Office hours tomorrow are cancelled."
	}
];	


// CLICK HANDLERS
$(document).on('click', '#cancelButton', function(e) {
	$('#newAnnouncement').hide();
});

$(document).on('click', '#doneButton', function(e) {
	// e.preventDefault();
	addNewAnnouncement();
});


// MAIN ACTIONS ON ANNOUNCEMENTS
function addNewAnnouncement() {
	var msg = $('#announcementInp').val();

	if (msg) { 
		var date = getDate();

		var oldAnnouncements = JSON.parse(localStorage.getItem('announcements'));
		oldAnnouncements.push({"date": date, "msg": msg});

		localStorage.setItem("announcements", JSON.stringify(oldAnnouncements));

		$('#announcementInp').val(null); 
		$('#newAnnouncement').hide();

		var template = getAnnouncementTemplate(date, msg);
		document.getElementById('display').prepend(template);
	} else {
		$("#announcementInp").effect("shake");
	}
	//show toast of sent announcement
	sentAnnouncement();
}

function createNewAnnouncement() {  
	document.getElementById("dateHeader").innerHTML = "<h4>" + getDate() + "</h4>";
	$('#newAnnouncement').toggle();
}

function displayAllAnnouncements() {
	var announcementContainer = document.createElement("div");
	var announcements = JSON.parse(localStorage.getItem('announcements'));
	if (!announcements) {
		announcements = sampleAnnouncements;
	}

	for (i = announcements.length; i--;) { 
		var announcement = announcements[i];
		var date = announcement["date"];
		var msg = announcement["msg"]; 

		var template = getAnnouncementTemplate(date, msg);
	    announcementContainer.appendChild(template);
	}

	document.getElementById('display').appendChild(announcementContainer);

	if (!localStorage.getItem('announcements')) {
		localStorage.setItem("announcements", JSON.stringify(sampleAnnouncements));
	}
}

function sentAnnouncement(){
	//show toast of announcement has been sent 
	var x = document.getElementById("sentToast");
	x.style.visibility = "visible";
	setTimeout(function(){ x.style.visibility = "hidden"; }, 800);
}


var editing = false; 
var messageNum = 0;
function getAnnouncementTemplate(date, msg) { 
	messageNum +=1;
	var dateDiv = document.createElement("div");
  	var dateText = document.createElement("h5");	  	
  	dateText.innerHTML = date;
  	dateDiv.appendChild(dateText);

	var msgDiv = document.createElement("div");
	var msgText = document.createTextNode(msg); 
  	msgDiv.appendChild(msgText);

  	var announcementDiv = document.createElement("div");
  	dateDiv.id = "date";
  	announcementDiv.appendChild(dateDiv);

  	msgDiv.id = "message"+messageNum;
  	announcementDiv.appendChild(msgDiv);

  	announcementDiv.className = "panel-body";
  	announcementDiv.id = "announDiv";

  	var input = document.createElement('input');
	input.id = "inputTxt"+messageNum;
	input.style.display = "none";

	var update = document.createElement("BUTTON");
	update.id = "updateButton"+messageNum;
	update.innerHTML = "Update Announcement"; 
	update.style.display = "none";

	announcementDiv.appendChild(input);
	announcementDiv.appendChild(update);

  	var editButton = document.createElement("BUTTON");
  	editButton.id = "editBtn";
  	editButton.className = "editBtn"+messageNum;
    editButton.innerHTML = '<img src="img/edit.png" id="imgBtn"/>';
 	editButton.onclick = function(){
	 	if (!editing){
			editing = true;
			var num = this.className.match(/\d+/g);

			document.getElementById("inputTxt"+num).style.display = "block";
			document.getElementById("updateButton"+num).style.display = "block";
		
			var oldVal = document.getElementById("message"+num).innerHTML;
			document.getElementById("inputTxt"+num).placeholder = oldVal; 

			document.getElementById("message"+num).innerHTML = "";

			update.onclick = function(){
				var inp = document.getElementById("inputTxt"+num).value;

				document.getElementById("inputTxt"+num).style.display = "none";
				document.getElementById("updateButton"+num).style.display = "none";

				if (inp==""){
					document.getElementById("message"+num).innerHTML = oldVal;
				} else{
					document.getElementById("message"+num).innerHTML = inp;
				}
				editing = false;
			}	
		}	
	}
  	
  	announcementDiv.appendChild(editButton);

  	var panelDiv = document.createElement("div");
  	panelDiv.className = "panel panel-default";
  	panelDiv.appendChild(announcementDiv);

  	return panelDiv;
}