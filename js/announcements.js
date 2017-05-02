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
		var date = getDate(true);
		var ref = danceDatabase.ref('announcements/' + currentDanceGroup);

		// create new ref and save data to it in one step
		var userRef = ref.push({
			date: date,
			msg: msg
		});

		console.log('user key', userRef.key); 

		// var oldAnnouncements = JSON.parse(localStorage.getItem('announcements'));
		// oldAnnouncements.push({"date": date, "msg": msg});

		// localStorage.setItem("announcements", JSON.stringify(oldAnnouncements));

		$('#announcementInp').val(null); 
		$('#newAnnouncement').hide();

		var template = getAnnouncementTemplate(date, msg);
		document.getElementById('display').prepend(template);
		
		//show toast of sent announcement
		sentAnnouncement();
	} else {
		$("#announcementInp").effect("shake");
	}
}

function createNewAnnouncement() {  
	document.getElementById("dateHeader").innerHTML = "<h4>" + getDate(true) + "</h4>";
	$('#newAnnouncement').toggle();
}

function displayAllAnnouncements() {
	var announcementContainer = document.createElement("div");
	var ref = danceDatabase.ref('announcements/' + currentDanceGroup);

    ref.on("value", function(snapshot) {
    	var announcements = snapshot.val();
    	var num_announcements = Object.keys(announcements).length;

    	// TODO note the backward iteration
    	// must be consistent with display order of other tasks
		for (i = num_announcements; i--;) {
			if (announcements[i]) {
				var announcement = announcements[i];
				var date = announcement["date"];
				var msg = announcement["msg"]; 

				var template = getAnnouncementTemplate(date, msg);
			    announcementContainer.appendChild(template);
			}
		}

		document.getElementById('display').appendChild(announcementContainer);

    }, function(error) {
        console.log("Error: " + error.code);
    });
}

function sentAnnouncement(){
	// show toast of announcement has been sent 
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

