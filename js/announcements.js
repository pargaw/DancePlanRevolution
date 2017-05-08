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

function getAnnouncementTemplate(date, msg, messageId) {
    var dateDiv = document.createElement("div");
    var dateText = document.createElement("h5");
    dateText.innerHTML = date;
    dateDiv.appendChild(dateText);

    var msgDiv = document.createElement("div");
    var msgText = document.createTextNode(msg);
    msgDiv.appendChild(msgText);

    var announcementDiv = document.createElement("div");
    dateDiv.id = "date" + messageId;
    announcementDiv.appendChild(dateDiv);

    msgDiv.id = "message" + messageId;
    announcementDiv.appendChild(msgDiv);

    announcementDiv.className = "panel-body";
    announcementDiv.id = "announDiv" + messageId;


    // for editing the announcements
    var input = document.createElement('textarea');
    input.id = "inputTxt" + messageId;
    console.log('input', input);
    input.className = 'form-control';
    input.style.display = "none";

    var update = document.createElement("BUTTON");
    update.id = "updateButton" + messageId;
    update.innerHTML = "Update post";
    update.className = 'btn';
    update.style.display = "none";

    announcementDiv.appendChild(input);
    announcementDiv.appendChild(update);

    var editButton = document.createElement("BUTTON");
    editButton.id = "editBtn" + messageId;
    editButton.className = "editBtn";
    editButton.innerHTML = '<img src="img/green_edit.png" id="imgBtn' + messageId + '"/>';

    var deleteButton = document.createElement("BUTTON");
    deleteButton.id = "deleteBtn" + messageId;
    deleteButton.className = "deleteBtn";
    deleteButton.innerHTML = '<img src="img/red_trash.png" id="imgBtn' + messageId + '"/>';    

    announcementDiv.appendChild(editButton);
    announcementDiv.appendChild(deleteButton);

    var panelDiv = document.createElement("div");
    panelDiv.className = "panel panel-default";
    panelDiv.appendChild(announcementDiv);

    return panelDiv;
}


function getMessageID(element, prefixLength) {
    var msgId = element.attr('id'); 
    var key = msgId.substring(prefixLength, msgId.length);
    return key;    
}

$(document).on('click', '[id^=editBtn]', function(){
    var key = getMessageID($(this), 'editBtn'.length);

    $("#inputTxt" + key).css("display", "block");
    $("#updateButton" + key).css("display", "block");

    var oldVal = $("#message" + key).html();
    $("#inputTxt" + key).attr('placeholder', oldVal);
    $("#inputTxt" + key).html(oldVal);
    $("#message" + key).html('');

    $(document).on('click', "#updateButton" + key, function() {
        var inp = $("#inputTxt" + key).val();

        $("#inputTxt" + key).css('display', "none");
        $("#updateButton" + key).css('display', "none");

        if (inp == "") {
            inp = oldVal;
        }

        $("#message" + key).html(inp);

        var ref = danceDatabase.ref('announcements/' + currentDanceGroup);

        var announcementRef = ref.child(key);
        announcementRef.update({
          "msg": inp
        });
    });
});

$(document).on('click', '[id^=deleteBtn]', function(){
    var key = getMessageID($(this), 'deleteBtn'.length); 

    $("#announDiv" + key).fadeOut('slow', function() {
        var ref = danceDatabase.ref('announcements/' + currentDanceGroup).child(key);
        ref.remove();
        $(this).parent().remove();
    });
});