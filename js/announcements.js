// CLICK HANDLERS
$(document).on('click', '#cancelButton', function(e) {
    $('#newAnnouncement').hide();
});

$(document).on('click', '#doneButton', function(e) {
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

        var id = userRef.key;

        $('#announcementInp').val(null);
        $('#newAnnouncement').hide(); 

        //show toast of sent announcement
        showSentToast();
    } else {
        $("#announcementInp").effect("shake");
    }
}

function createNewAnnouncement() {
    document.getElementById("dateHeader").innerHTML = "<h4>" + getDate(true) + "</h4>";
    $('#newAnnouncement').toggle();
}

function displayAllAnnouncements() {
    var ref = danceDatabase.ref('announcements/' + currentDanceGroup + '/');

    ref.on("value", function(snapshot) {
        var announcementContainer = document.getElementById("announcementsDisplay");
        announcementsDisplay.innerHTML = '';

        var announcements = snapshot.val();
        var announcement_list = Object.keys(announcements);

        // TODO note the backward iteration
        // must be consistent with display order of other tasks
        for (i = announcement_list.length; i--;) {
            var key = announcement_list[i];
            var announcement = announcements[key];

            if (announcement) {
                var date = announcement["date"];
                var msg = announcement["msg"];

                var template = getAnnouncementTemplate(date, msg, key);
                announcementContainer.appendChild(template);
            }
        }
    }, function(error) {
        console.log("Oops, could not display all announcements... " + error.code);
    });
}

function showSentToast() {
    // show toast of announcement has been sent 
    var x = document.getElementById("sentToast");
    x.style.display = "block";
    setTimeout(function() {
        x.style.display = "none";
    }, 2000);
}

var editing = false;
function getAnnouncementTemplate(date, msg, messageId) {
    var dateDiv = document.createElement("div");
    var dateText = document.createElement("h5");
    dateText.innerHTML = date;
    dateDiv.appendChild(dateText);

    var msgDiv = document.createElement("div");
    var msgText = document.createTextNode(msg);
    msgDiv.appendChild(msgText);

    var announcementDiv = document.createElement("div");

	msgDiv.id = "message" + messageId;
    msgDiv.className = "messages";
    announcementDiv.appendChild(msgDiv);

    // for editing the announcements
    var input = document.createElement('textarea');
    input.id = "inputTxt" + messageId;
    input.className = 'form-control';
    input.style.display = "none";
    input.className = "inputs";

    var cancel = document.createElement("BUTTON");
    cancel.id = "cancelEditButton" + messageId;
    cancel.innerHTML = "Cancel";
    cancel.className = 'btn btn-danger';
    cancel.style.display = "none";

    var update = document.createElement("BUTTON");
    update.id = "updateButton" + messageId;
    update.innerHTML = "Update";
    update.className = 'btn btn-primary';
    update.style.display = "none";

    announcementDiv.appendChild(input);
    announcementDiv.appendChild(cancel);
    announcementDiv.appendChild(update);

    dateDiv.id = "date";
    announcementDiv.appendChild(dateDiv);

	var deleteButton = document.createElement("IMG");
    deleteButton.id = "deleteBtn";
	deleteButton.src = 'img/red_trash.png';
    deleteButton.className = "deleteBtn" + messageId;
    deleteButton.onclick = function() {
		var key = getMessageID(deleteButton, 'deleteBtn'.length); 
		$('#myDeleteModal').modal('show');

		$('#yesBtn').on('click', function() {
		  var thisAnnounce = document.getElementById("announDiv"+key);
	      $("#announDiv" + key).fadeOut('slow', function() {
	      	var ref = danceDatabase.ref('announcements/' + currentDanceGroup).child(key);
	        ref.remove();
	        announcementDiv.parentElement.remove();
	      });	
		  $('#myModal').modal('hide');
		});
    }
    announcementDiv.appendChild(deleteButton);

    var editButton = document.createElement("IMG");
    editButton.id = "editBtn";
    editButton.className = "editBtn" + messageId;
    editButton.src = "img/green_edit.png";

    editButton.onclick = function() {
        if (!editing) {
            editing = true;

            //get which message number
            var key = getMessageID(editButton, 'editBtn'.length);

            //hide edit button
            editButton.style.display = "none";
            deleteButton.style.display = "none";

            document.getElementById("inputTxt" + key).style.display = "block";
            document.getElementById("updateButton" + key).style.display = "inline-block";
            document.getElementById("cancelEditButton" + key).style.display = "inline-block";

            var oldVal = document.getElementById("message" + key).innerHTML;

            // document.getElementById("inputTxt" + key).placeholder = oldVal;
            document.getElementById("inputTxt" + key).innerHTML = oldVal;

            document.getElementById("message" + key).innerHTML = "";

            update.onclick = function() {
                var inp = document.getElementById("inputTxt" + key).value;

                document.getElementById("inputTxt" + key).style.display = "none";
                document.getElementById("updateButton" + key).style.display = "none";
                document.getElementById("cancelEditButton" + key).style.display = "none";

                if (inp == "") {
                    document.getElementById("message" + key).innerHTML = oldVal;
                } else {
                    document.getElementById("message" + key).innerHTML = inp;
                }
                editButton.style.display = "inline-block";
                deleteButton.style.display = "inline-block";
                editing = false;

                var ref = danceDatabase.ref('announcements/' + currentDanceGroup);

		        var announcementRef = ref.child(key);
		        announcementRef.update({
		          "msg": inp
		        });
            }

            cancel.onclick = function(){
                document.getElementById("inputTxt" + key).style.display = "none";
                document.getElementById("updateButton" + key).style.display = "none";
                document.getElementById("cancelEditButton" + key).style.display = "none";

                document.getElementById("message" + key).innerHTML = oldVal;

                editButton.style.display = "inline-block";
                deleteButton.style.display = "inline-block";
                editing = false;
            }
        }
    }
    announcementDiv.appendChild(editButton);

    announcementDiv.className = "panel-body";
    announcementDiv.id = "announDiv" + messageId;

    var panelDiv = document.createElement("div");
    panelDiv.className = "panel panel-default";
    panelDiv.appendChild(announcementDiv);

    return panelDiv;
}

function deleteConfirmed(){
	return true;
}

function getMessageID(element, prefixLength) {
    var msgId = element.className; 
    var key = msgId.substring(prefixLength, msgId.length);
    return key;    
}