// function getTeamName() {
// 	var currentDanceGroupID = localStorage.getItem("currentDanceGroupID");
// }

// function changeTeamName(){
// 	window.localStorage.setItem( key, JSON.stringify(value) );
// }


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


var deletedMembers = [];
var addedMembers = [];

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

    updateTaskPgContent();
    setupMembers_settings();
}

window.onload = initializePage;



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



// CLICK HANDLERS -->TODO what is this for????
$(document).on('click', '.navbar-brand', function(e) {
    window.location.href = 'index.html';
});

// if we change currentTask, change content displayed by the carousel 
$(document).on('click', '.taskbar a', function(e) {
    currentTask = $(this).attr('id');
    updateTaskPgContent(true);
});

$(document).on('click', '#addNew', function(e) {
    addNewTaskItem();
});


// $(document).ready(function() {

//     $(".ui-datepicker-trigger").attr("data-toggle","tooltip");
//     $(".ui-datepicker-trigger").attr("data-original-title", dateTooltipText);
//     $(".ui-datepicker-trigger").attr("title", dateTooltipText);

//     $('[data-toggle="tooltip"]').tooltip(); 

// });



// use new index of carousel to update page content
$(document).on('slide.bs.carousel', '.carousel', function(e) {
    var slideFrom = $(this).find('.active').index();
    var slideTo = $(e.relatedTarget).index();
    currentTask = slideTo - 2;
    // updateTaskPgContent();
});


// GENERAL TASK MANIPULATION
function addNewTaskItem() {
    if (currentTask == 0) {
        // ???
    } else if (currentTask == 2) {
        createNewAnnouncement();
    }
}

function changeDate(date) { 
    if (currentTask == 0) {
        reloadAttendance(date);
    } else if (currentTask == 1) {
        
    } else {
        displayAllAnnouncements(date);
    }
}

function updateTaskPgContent(indirect) {
    // move to new carousel item if tab, not carousel arrow, was clicked
    if (indirect) {
        $("#myCarousel").carousel(parseInt(currentTask));
    }

    // activate element in secondary bar
    $(".taskbar li>a").removeClass('active');
    $(".taskbar li>a#" + currentTask).addClass('active');

    var newTaskButton = $('#addNew');
  
}


// UTILITIES
// return date in mm/dd/yy hh:mm starting form
function getDate(time_included, delimiter) {
    var n = new Date(); 
    // 01, 02, 03, ... 29, 30, 31
    var dd = (n.getDate() < 10 ? '0' : '') + n.getDate();
    // 01, 02, 03, ... 10, 11, 12
    var mm = ((n.getMonth() + 1) < 10 ? '0' : '') + (n.getMonth() + 1);
    // 1970, 1971, ... 2015, 2016, ...
    var yy = n.getFullYear();

    // firebase doesn't like keys with slashes,
    // so for attendance, we can save with hyphens instead
    if (delimiter) {
        var date = mm + delimiter + dd + delimiter + yy;
    } else {
        var date = mm + "-" + dd + "-" + yy;
    }


    if (time_included) {
        hr = n.getHours();
        min = n.getMinutes();
        if (hr >= 13) {
            ap = 'pm';
            hr -= 12;
        } else {
            ap = 'am';
        }

        if (min < 10) {
            min = '0' + min;
        }

        var time = " " + hr + ":" + min + ap;
        return date + time;
    };

    return date;
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
	$('#newMember').hide();
});

$(document).on('click', '#addMemberButton', function(e) {
    // assume all fields have been validated 
    var kerberos = $('#addMemberKerberos').val();
    var name = $('#addMemberName').val();
    console.log('inp fields', kerberos, name);

    if (memberPhoto) {
        // assumes jpg files only
        var folderPath = 'members/';
        var imagePath = kerberos + '.jpg';
        var memberRef = danceStorage.ref(folderPath + imagePath);
        var folderRef = danceStorage.ref(folderPath);

        memberRef.put(memberPhoto).then(function(snapshot) {
            folderRef.child(imagePath).getDownloadURL().then(function(url) {
                console.log('inp 2', kerberos, name);
                saveMemberToDatabase(kerberos,name,url);
                // addedMembers.push([kerberos,name,url]); -> save separately after pressing save button
            }).catch(function(error) {
                console.log('error', error);
            });
        }); 
    } else {
        console.log('no member photo', kerberos, name);
        saveMemberToDatabase(kerberos,name);
        // addedMembers.push([kerberos,name]); -> save separately after pressing save button
    }
    $('#newMember').hide();
});


// on date change, update attendance display
function reloadAttendance(newDate) {
    hyphen_delimited_date = newDate;
    $(".task-name").text(TASKS[currentTask] + " for " + hyphen_delimited_date);
    setupMembers_settings();
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
							      	// deleteMemberFromDatabase(kerberos, name, imgURL);
							      	deletedMembers.push([kerberos,name,imgURL])
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

function saveEditMembers() {
     for (var i = 0; i < deletedMembers.length; i++) {
     	if (deletedMembers[i].length==3){
			deleteMemberFromDatabase(deletedMembers[i][0], deletedMembers[i][1], deletedMembers[i][2]);
     	} else{
     		deleteMemberFromDatabase(deletedMembers[i][0], deletedMembers[i][1]);
     	}
     }
     deletedMembers = [];

   //   for (var j = 0; j < addedMembers.length; j++){
   //   	if (addedMembers[j].length==3){
			// saveMemberToDatabase(addedMembers[j][0], addedMembers[j][1], addedMembers[j][2]);
   //   	} else{
   //   		saveMemberToDatabase(addedMembers[j][0], addedMembers[j][1]);
   //   	}
   //   }
}