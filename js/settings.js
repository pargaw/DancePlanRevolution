
var newTeamName = currentDanceGroup;

/*
Control page for determining which content is displayed for given task
*/
// GLOBALS
var hyphen_delimited_date = getDate(false, '-'); // '05-01-2017'
var memberPhoto;

//get relative server paths
var full_path = location.pathname;
var path = full_path.substr(0, full_path.lastIndexOf("/") + 1);

var currentTask = 0; // should be 0, 1, or 2, specifying one of the above tasks
var currentDanceGroupID = localStorage.getItem("currentDanceGroupID");
console.log("team name is "+currentDanceGroupID);
var currentDanceGroup = localStorage.getItem("currentDanceGroup");

// SETUP
function initializePage() {
    // $('.overlay').hide();
    // stop automatic carousel movement 
    $("#myCarousel").carousel({
        pause: true,
        interval: false
    });

    // set dance group
    if (localStorage.currentDanceGroupID != "undefined") {
        this.currentDanceGroupID = localStorage.currentDanceGroupID;
    }

    console.log($('#editTeamName>h4'));
    $('#editTeamName>input')[0].value = this.currentDanceGroup;
    // $('#editTeamName>input')[0].placeholder = 'Moo';

    // set current dance group based on the last one seen
    if (this.currentDanceGroupID) {
        $(".dance-group a").text(this.currentDanceGroup);
    } else {
        $(".dance-group a").text(this.currentDanceGroup);

        // TODO delete line above and uncomment one below when done 
        // $(".dance-group").text("Choose a team below");
    }

    // activate element in secondary bar
    $(".taskbar li>a").removeClass('active');
    $(".taskbar li>a#" + currentTask).addClass('active');
    updateTaskPgContent();
    setupMembers_settings();
}

window.onload = initializePage;

function strip_text(text) {
    return text.replace(/^\s+|\s+$/g, '');
}

$(document).on('keyup', '#editTeamName>input', function(){
    newTeamName = $(this).val();
});

$(document).on('click', '#cancelNameChangeButton', function() {
    $('#editTeamName>input').val(localStorage.getItem("currentDanceGroup"));
});

$(document).on('click', '#changeNameButton', function() {
    var danceGroupRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/');

    var updateObj = {};
    updateObj['name'] = newTeamName;

    danceGroupRef.update(updateObj);
    $(".dance-group a").text(newTeamName);
    localStorage.setItem("currentDanceGroup", newTeamName);

    // danceGroupRef.child('name').setValue(newTeamName);
});

// if we change currentTask, change content displayed by the carousel 
$(document).on('click', '.taskbar a', function(e) {
    currentTask = $(this).attr('id');
    // activate element in secondary bar
    $(".taskbar li>a").removeClass('active');
    $(".taskbar li>a#" + currentTask).addClass('active');

    updateTaskPgContent(true);
});


// use new index of carousel to update page content
$(document).on('slide.bs.carousel', '.carousel', function(e) {
    var slideFrom = $(this).find('.active').index();
    var slideTo = $(e.relatedTarget).index();
    currentTask = slideTo - 2;
    // updateTaskPgContent();
});


function updateTaskPgContent(indirect) {
    // move to new carousel item if tab, not carousel arrow, was clicked
    if (indirect) {
        $("#myCarousel").carousel(parseInt(currentTask));
    }

    // // activate element in secondary bar
    // $(".taskbar li>a").removeClass('active');
    // $(".taskbar li>a#" + currentTask).addClass('active');

    var newTaskButton = $('#addNew');
  
}



//Edit members

// get list of all members across all dance groups
function getMembers(){
    var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    membersRef.on("value", function(snapshot) {
        var members = snapshot.val();
        return members;
    });
}

$(document).on('click', '#addNew', function(e) {
    $('#newMember').toggle();
});

function saveMemberToDatabase(kerberos, name, url) {
    if (!url) {
        // no-user-img.jpg
        url = 'https://firebasestorage.googleapis.com/v0/b/danceplanrevolution.appspot.com/o/members%2Fno-user-img.jpg?alt=media&token=a00922f3-120a-4e4b-ae4e-58807d69a93e';
    }

    // console.log(kerberos, name, url);
    var attendanceRef = danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date);
    var groupsRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    var membersRef = danceDatabase.ref('members/');

    var updateObjFalse = {};
    var updateObjTrue = {};
    updateObjFalse[kerberos] = false;
    updateObjTrue[kerberos] = true;

    attendanceRef.update(updateObjFalse);
    groupsRef.update(updateObjTrue);
    membersRef.child(kerberos).set({
        groups: [currentDanceGroupID],
        kerberos: kerberos,
        name: name,
        photo: url
    });

    hideAttendanceForm();
}

function hideAttendanceForm() {
    $('#newMember')[0].reset();
    $('#newMember').hide();
}

function deleteMemberFromDatabase(kerberos, name, url) {
	 if (!url) {
        // no-user-img.jpg
        url = 'https://firebasestorage.googleapis.com/v0/b/danceplanrevolution.appspot.com/o/members%2Fno-user-img.jpg?alt=media&token=a00922f3-120a-4e4b-ae4e-58807d69a93e';
    }

    var attendanceRef = danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date);
    var groupsRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    var membersRef = danceDatabase.ref('members/');

    attendanceRef.child(kerberos).remove();
    groupsRef.child(kerberos).remove();
    membersRef.child(kerberos).remove();
}

$(document).on('click', '#cancelMemberButton', function(e) {
	hideAttendanceForm();
});

$(document).on('click', '#addMemberButton', function(e) {
    // assume all fields have been validated 
    var kerberos = strip_text($('#addMemberKerberos').val());
    var name = strip_text($('#addMemberName').val());
    console.log('stripped member np fields', kerberos, name);

    if (kerberos && name) {
        if (memberPhoto) {
            // assumes jpg files only
            var folderPath = 'members/';
            var imagePath = kerberos + '.jpg';
            var memberRef = danceStorage.ref(folderPath + imagePath);
            var folderRef = danceStorage.ref(folderPath);

            memberRef.put(memberPhoto).then(function(snapshot) {
                folderRef.child(imagePath).getDownloadURL().then(function(url) {
                    saveMemberToDatabase(kerberos, name, url);
                }).catch(function(error) {
                    console.log('error', error);
                });
            }); 
        } else {
            console.log('no member photo', kerberos, name);
            saveMemberToDatabase(kerberos, name);
        }
    } else {
        $("#newMember").effect("shake");
    }
});

// on date change, update attendance display
function reloadAttendance(newDate) {
    hyphen_delimited_date = newDate;
    $(".task-name").text(TASKS[currentTask] + " for " + hyphen_delimited_date);
    checkAttendanceTable();
}

function choosePhoto() {
    var fileTracker = document.getElementById("uploadPhotoFile");
    var txt = "";
    var selectErrorMsg = "Please choose an image!";

    if ('files' in fileTracker) {
        if (fileTracker.files.length == 0) {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
            return;
        } else {
            for (var i = 0; i < fileTracker.files.length; i++) {
                file = fileTracker.files[i];
                console.log('file', file);

                var memberImgLabel = document.getElementById('memberImgLabel');
                console.log('memberImgLabel', memberImgLabel);
                memberImgLabel.innerHTML = file.name;
                memberPhoto = file;
            }
        }
    } else {
        if (fileTracker.value == "") {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
        } else {
            // TODO bootstrap validation
            console.log('Uploading from file is not supported by this browser.')
            console.log('path of selected file', fileTracker.value);
        }
    }
}

function setupMembers_settings() { 
    return danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date).once('value').then(function(snapshot) {
        var attendance = snapshot.val(); 
        var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');

        membersRef.on("value", function(snapshot) {
            var members = snapshot.val();
            var numMembers = Object.keys(members).length;
            // console.log(members, Object.keys(members), numMembers); 

            var numRows = Math.ceil(numMembers / 3.0);
            var counter = 0;

            $('#attendanceTable').empty();
            var t = document.getElementById('attendanceTable'); 

            for (var memberKey in members) {
                if (members.hasOwnProperty(memberKey)) {
                    // console.log(memberKey + " -> " + members[memberKey]);
                    var memberRef = danceDatabase.ref('members/' + memberKey);

                    // retrieve and set up data for each group ember
                    memberRef.on("value", function(snapshot) {
                        var memberData = snapshot.val();

                        if (memberData) {
                            var kerberos = memberData.kerberos;
                            var name = memberData.name;
                            var imgURL = memberData.photo;

                            // make new row for every 3 people
                            if (counter % 3 == 0) {
                                tr = t.insertRow();
                            } 

                            // make td with figure of img, caption per member
                            var tdMem = document.createElement("TD");
                            tdMem.setAttribute("id","tdMem_"+kerberos);
                            var figMem = document.createElement("FIGURE");
                            var member = document.createElement("IMG");

                            figMem.setAttribute("id", "fig_" + kerberos); 

                            imgPath = imgURL ? imgURL : path + "img/no-user-img.jpg";
                            member.setAttribute("src", imgPath);
                            member.setAttribute("id", 'img_' + kerberos);
                            member.setAttribute("class", "member");
                            member.width = "80";
                            member.height = "80";
                            member.style.borderRadius = "50%";
                            member.style.position = "relative";

                            var caption = document.createElement("FIGCAPTION");
                            var txt = document.createTextNode(name);
                            caption.appendChild(txt);

                            var deleteButton = document.createElement("IMG");
                            deleteButton.id = "deleteBtnAttend";
                            // deleteButton.className = "deleteBtnAttend" + messageNum;
                            deleteButton.src = "img/red_trash.png";
                            deleteButton.onclick = function() {
                            	var key = getMessageID(deleteButton, 'deleteBtn'.length); 
								$('#myDeleteModal').modal('show');

								$('#yesBtn').on('click', function() {
							      $("#tdMem_"+kerberos).fadeOut('slow', function() {
							      	deleteMemberFromDatabase(kerberos, name, imgURL);
							        $("#tdMem_"+kerberos).remove();
							      });	
								  $('#myModal').modal('hide');
								});
                            }

                            // create hierarchy of elements
                            figMem.appendChild(member);
                            figMem.appendChild(caption);
                            figMem.appendChild(deleteButton);
            
                            tdMem.appendChild(figMem);
                            tr.appendChild(tdMem);

                            // update counter for table layout
                            counter += 1; 
                        }
                        
                    });
                }
            }
            var div = document.getElementById("attend");
            div.appendChild(document.getElementById('attendanceTable'));
        });
    });
}

function getMessageID(element, prefixLength) {
    var msgId = element.className; 
    var key = msgId.substring(prefixLength, msgId.length);
    return key;    
}