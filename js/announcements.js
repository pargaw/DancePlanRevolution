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

function getAnnouncementTemplate(date, msg) { 
	var dateDiv = document.createElement("div");
  	var dateText = document.createElement("h5");	  	
  	dateText.innerHTML = date;
  	dateDiv.appendChild(dateText);

	var msgDiv = document.createElement("div");
	var msgText = document.createTextNode(msg); 
  	msgDiv.appendChild(msgText);

  	var announcementDiv = document.createElement("div");
  	announcementDiv.appendChild(dateDiv);
  	announcementDiv.appendChild(msgDiv);
  	announcementDiv.className = "panel-body";

  	var panelDiv = document.createElement("div");
  	panelDiv.className = "panel panel-default";
  	panelDiv.appendChild(announcementDiv);

  	return panelDiv;
}