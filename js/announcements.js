// CLICK HANDLERS
$(document).on('click', '#cancelButton', function(e) {
    $('#newAnnouncement').hide();
});

$(document).on('click', '#doneButton', function(e) {
    addNewAnnouncement();
});


function hideAnnouncementForm() {
    $('#newAnnouncement')[0].reset();
    $('#newAnnouncement').hide();
}

// MAIN ACTIONS ON ANNOUNCEMENTS
function addNewAnnouncement() {
    var msg = strip_text($('#announcementInp').val());

    if (msg && msg.length >= 1) {
        var date = getDate(true);
        var ref = danceDatabase.ref('announcements/' + currentDanceGroupID);

        // create new ref and save data to it in one step
        var userRef = ref.push({
            date: date,
            msg: msg
        });

        var id = userRef.key;

        hideAnnouncementForm();

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

$(document).on('click', '#resetButton', function() {
    displayAllAnnouncements();
});

function displayAllAnnouncements(filterDate) {
    var ref = danceDatabase.ref('announcements/' + currentDanceGroupID + '/');

    if (filterDate) {
        $('.resetRow').show();
    } else {
        $('.resetRow').hide();
    }

    ref.on("value", function(snapshot) {
        var announcementContainer = document.getElementById("announcementsDisplay");
        announcementsDisplay.innerHTML = '';
        var announcements = snapshot.val();

        if (announcements) {
            var announcement_list = Object.keys(announcements);

            // TODO note the backward iteration
            // must be consistent with display order of other tasks
            for (i = announcement_list.length; i--;) {
                var key = announcement_list[i];
                var announcement = announcements[key];

                if (announcement) {
                    var date = announcement["date"];
                    var msg = announcement["msg"]; 

                    if (!filterDate || (filterDate && filterDate === date.substring(0, filterDate.length))) {  
                        var template = getAnnouncementTemplate(date, msg, key);
                        announcementContainer.appendChild(template);  
                    }
                }
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
    var dateDiv = document.createElement("h6");
    var dateText = document.createTextNode(date);
    dateDiv.appendChild(dateText);

    var msgDiv = document.createElement("h5");
    var msgText = document.createTextNode(msg);
    msgDiv.appendChild(msgText);

    var announcementDiv = document.createElement("div");

    var lDiv = document.createElement("div");
    lDiv.id = "leftDiv";
    lDiv.style.wordBreak ="break-all"; 
    lDiv.style.wordWrap = "break-word";

	msgDiv.id = "message" + messageId;
    msgDiv.className = "messages";
    lDiv.appendChild(msgDiv);

    // for editing the announcements
    var input = document.createElement('textarea');
    input.id = "inputTxt" + messageId;
    input.className = 'form-control';
    input.style.display = "none"; 

    var errorHelpBlock = document.createElement('div');
    errorHelpBlock.className = 'help-block with-errors';

    var textRightDiv = document.createElement("div");
    textRightDiv.className = 'text-right';

    var cancel = document.createElement("img");
    cancel.id = "cancelEditButton" + messageId;
    cancel.src = "img/close.png";
    cancel.className = 'formImgButtons';
    cancel.style.display = "none";

    var updateBtnWrapper = document.createElement('button');
    updateBtnWrapper.type = 'submit'; 

    var update = document.createElement("img");
    update.id = "updateButton" + messageId;
    update.src = "img/green_checkmark.png";
    update.className = 'formImgButtons';
    update.style.display = "none";

    updateBtnWrapper.appendChild(update);
    textRightDiv.appendChild(cancel);
    textRightDiv.appendChild(update);

    lDiv.appendChild(input);
    lDiv.appendChild(errorHelpBlock);
    lDiv.appendChild(textRightDiv);

    dateDiv.id = "date"; 
    lDiv.appendChild(dateDiv);
    announcementDiv.appendChild(lDiv);


    var rDiv = document.createElement("div");
    rDiv.id = "rightDiv";

    var editButton = document.createElement("IMG");
    editButton.id = "editBtn";
    editButton.className = "editBtn" + messageId;
    editButton.src = "img/green_edit.png";

    editButton.onclick = function() {
        if (!editing) {
            editing = true;

            //get which message number
            var key = getMessageID(editButton, 'editBtn'.length);

            //hide edit and delete buttons and extend div
            editButton.style.display = "none";
            deleteButton.style.display = "none";
            lDiv.style.width = "100%";

            document.getElementById("inputTxt" + key).style.display = "block";
            document.getElementById("updateButton" + key).style.display = "inline-block";
            document.getElementById("cancelEditButton" + key).style.display = "inline-block";

            var oldVal = document.getElementById("message" + key).innerHTML;

            document.getElementById("inputTxt" + key).value = oldVal;
            document.getElementById("message" + key).innerHTML = "";
            document.getElementById("inputTxt" + key).focus();

            update.onclick = function() {
                var inp = document.getElementById("inputTxt" + key).value;
                console.log('inp', inp, inp.length, oldVal);

                document.getElementById("inputTxt" + key).style.display = "none";
                document.getElementById("updateButton" + key).style.display = "none";
                document.getElementById("cancelEditButton" + key).style.display = "none";

                if (inp.length < 2) {
                    console.log('shouldnt update!', inp.length);
                    document.getElementById("message" + key).value = oldVal;
                    document.getElementById("inputTxt" + key).value = oldVal;
                } else {
                    document.getElementById("message" + key).innerHTML = inp;
                }

                lDiv.style.width = "80%";
                editButton.style.display = "block";
                deleteButton.style.display = "block";

                editing = false;

                var ref = danceDatabase.ref('announcements/' + currentDanceGroupID);

                var announcementRef = ref.child(key);
                announcementRef.update({
                  "msg": inp
                });
            }

            cancel.onclick = function(){
                document.getElementById("inputTxt" + key).value = oldVal;
                document.getElementById("message" + key).innerHTML = oldVal;

                document.getElementById("inputTxt" + key).style.display = "none";
                document.getElementById("updateButton" + key).style.display = "none";
                document.getElementById("cancelEditButton" + key).style.display = "none"; 
                document.getElementById("message" + key).innerHTML = oldVal;

                lDiv.style.width = "80%";
                editButton.style.display = "block";
                deleteButton.style.display = "block";
                editing = false;
            }
        }
    }
    rDiv.appendChild(editButton);

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
	      	var ref = danceDatabase.ref('announcements/'+currentDanceGroupID).child(key);
	        ref.remove();
	        announcementDiv.parentElement.remove();
	      });	
		  $('#myDeleteModal').modal('hide');
		});
    }
    rDiv.appendChild(deleteButton);
    announcementDiv.appendChild(rDiv);

    announcementDiv.className = "panel-body";
    announcementDiv.id = "announDiv" + messageId;
    announcementDiv.style.position = "relative";

    var panelDiv = document.createElement("div");
    panelDiv.className = "panel panel-default";
    panelDiv.appendChild(announcementDiv);

    return panelDiv;
}

function getMessageID(element, prefixLength) {
    var msgId = element.className; 
    var key = msgId.substring(prefixLength, msgId.length);
    return key;    
}