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

        $('#announcementInp').val(null);
        $('#newAnnouncement').hide();

        var template = getAnnouncementTemplate(date, msg);
        document.getElementById('announcementsDisplay').prepend(template);

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
    var announcementContainer = document.getElementById("announcementsDisplay");
    var ref = danceDatabase.ref('announcements/' + currentDanceGroup + '/');

    ref.on("value", function(snapshot) {
        var announcements = snapshot.val();
        console.log(announcements);
        var announcement_list = Object.keys(announcements);

        // TODO note the backward iteration
        // must be consistent with display order of other tasks
        for (i = announcement_list.length; i--;) {
            var announcement = announcements[announcement_list[i]];
            console.log(announcement);

            if (announcement) {
                var date = announcement["date"];
                var msg = announcement["msg"];

                var template = getAnnouncementTemplate(date, msg);
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
    x.style.visibility = "visible";
    setTimeout(function() {
        x.style.visibility = "hidden";
    }, 900);
}


var editing = false;
var messageNum = 0;

function getAnnouncementTemplate(date, msg) {
    messageNum += 1;
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

    msgDiv.id = "message" + messageNum;
    announcementDiv.appendChild(msgDiv);

    announcementDiv.className = "panel-body";
    announcementDiv.id = "announDiv";


    // for editing the announcements
    var input = document.createElement('textarea');
    input.id = "inputTxt" + messageNum;
    input.className = 'form-control';
    input.style.display = "none";

    var update = document.createElement("BUTTON");
    update.id = "updateButton" + messageNum;
    update.innerHTML = "Update";
    update.className = 'btn';
    update.style.display = "none";

    announcementDiv.appendChild(input);
    announcementDiv.appendChild(update);

    var editButton = document.createElement("BUTTON");
    editButton.id = "editBtn";
    editButton.className = "editBtn" + messageNum;
    editButton.innerHTML = '<img src="img/green_edit.png" id="imgBtn"/>';

    editButton.onclick = function() {
        if (!editing) {
            editing = true;
            var num = this.className.match(/\d+/g);

            document.getElementById("inputTxt" + num).style.display = "block";
            document.getElementById("updateButton" + num).style.display = "block";

            var oldVal = document.getElementById("message" + num).innerHTML;
            document.getElementById("inputTxt" + num).placeholder = oldVal;
            document.getElementById("inputTxt" + num).innerHTML = oldVal;

            document.getElementById("message" + num).innerHTML = "";

            update.onclick = function() {
                var inp = document.getElementById("inputTxt" + num).value;

                document.getElementById("inputTxt" + num).style.display = "none";
                document.getElementById("updateButton" + num).style.display = "none";

                if (inp == "") {
                    document.getElementById("message" + num).innerHTML = oldVal;
                } else {
                    document.getElementById("message" + num).innerHTML = inp;
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