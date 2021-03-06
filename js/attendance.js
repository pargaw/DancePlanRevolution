// GLOBALS
var hyphen_delimited_date = getDate(false, '-'); // '05-01-2017'
var memberPhoto;

//get relative server paths
var full_path = location.pathname;
var path = full_path.substr(0, full_path.lastIndexOf("/") + 1);

function hideAttendanceForm() {
    $('#memberImgLabel').empty();
    $('#newMember')[0].reset();
    // console.log('try to empty', $('#newMember .help-block li'));
    $('#newMember .help-block li').empty();
    // console.log($('#newMember .help-block li'));
    $('#newMember').hide();
}

$(document).on('click', '#cancelMemberButton', function(e) {
    hideAttendanceForm();
});

$(document).on('click', '#addNew', function(e) {
    $('#newMember').toggle();
});

$(document).on('click', '#attendanceTable img', function(e) {
    saveAttendance();
});

function saveMemberToDatabase(kerberos, name, url) {
    if (!url) {
        // no-user-img.jpg
        url = 'https://firebasestorage.googleapis.com/v0/b/danceplanrevolution.appspot.com/o/members%2Fno-user-img.jpg?alt=media&token=a00922f3-120a-4e4b-ae4e-58807d69a93e';
    }

    // console.log(kerberos, name, url);
    // var attendanceRef = danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date);
    var groupsRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    var membersRef = danceDatabase.ref('members/');

    var updateObjFalse = {};
    var updateObjTrue = {};
    updateObjFalse[kerberos] = false;
    updateObjTrue[kerberos] = true;

    // attendanceRef.update(updateObjFalse);
    groupsRef.update(updateObjTrue);
    membersRef.child(kerberos).set({
        groups: [currentDanceGroupID],
        kerberos: kerberos,
        name: name,
        photo: url
    });

    hideAttendanceForm();
    checkAttendanceTable();
}



let storeMemberPhoto = new Promise(function(resolve, reject) {
    var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    membersRef.on("value", function(snapshot) {
        var members = snapshot.val();
        if (members) {
            // console.log('members', members);
            resolve(members);
        } else {
            // console.log('no members?');
            reject(false);
        }
    });
});

$(document).on('click', '#addMemberButton', function(e) {
    // assume all fields have been validated 
    var kerberos = strip_text($('#addMemberKerberos').val());
    var name = strip_text($('#addMemberName').val());
    console.log('stripped member fields', kerberos, name);

    if (kerberos && name) {
        if (memberPhoto) {
            // assumes jpg files only
            var folderPath = 'members/';
            var imagePath = kerberos + '.jpg';
            var memberRef = danceStorage.ref(folderPath + imagePath);
            var folderRef = danceStorage.ref(folderPath);
            console.log('image path', imagePath);

            console.log('memberPhoto', memberPhoto);

            var uploadTask = memberRef.put(memberPhoto);
            uploadTask.on('state_changed', function(snapshot) {
                console.log(snapshot.totalBytesTransferred); // progress of upload
            });
            // memberRef.put(memberPhoto).then(function(snapshot) {
            //     console.log('HALP', snapshot);
            //     // folderRef.child(imagePath).getDownloadURL().then(function(url) {
            //     //     console.log('url', url);
            //     //     saveMemberToDatabase(kerberos, name, url);
            //     // }).catch(function(error) {
            //     //     console.log('error in getting download url', error);
            //     // }); 
            // }).catch(function(error) {
            //     console.log('error in storing photo', error);
            // });
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

// get list of all members for a given group
let getMembers = new Promise(function(resolve, reject) {
    var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    membersRef.on("value", function(snapshot) {
        var members = snapshot.val();
        if (members) {
            // console.log('members', members);
            resolve(members);
        } else {
            // console.log('no members?');
            reject(false);
        }
    });
});

function checkAttendanceTable() { 
    getMembers.then(function(fromResolve) {
        // console.log('members', fromResolve);
        setupMembers();
    }).catch(function(fromReject){
        console.log('no members!');
        requestToAddMembers();
    });
}

function requestToAddMembers() {
    $("#attendanceTable").html('There are no members right now! Add by clicking the + button above. You can also do this in <a href="settings.html">Settings</a>.');
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
                // console.log('memberImgLabel', memberImgLabel);
                memberImgLabel.innerHTML = file.name;
                memberPhoto = file;
                // console.log('memphoto', memberPhoto);
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

function setupMembers() {
    return danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date).once('value').then(function(snapshot) {
        var attendance = snapshot.val(); 
        var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');

        membersRef.on("value", function(snapshot) {
            var members = snapshot.val();

            if (members) {
                var numMembers = Object.keys(members).length;
                // console.log(members, Object.keys(members), numMembers); 


                var numRows = Math.ceil(numMembers / 3.0);
                var counter = 0;

                $('#attendanceTable').empty();
                $('.attendanceInstructions').show();

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

                                // make td with figure of img, caption, checkmark per member
                                var tdMem = document.createElement("TD");
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

                                // set up checkmark that indicates absence/presence
                                var check = document.createElement("IMG");
                                check.src = path + "img/green_checkmark.png";
                                check.setAttribute("class", "checkmark");
                                check.style.width = member.width + 'px';
                                check.style.height = member.height + 'px';
                                check.style.opacity = 0;

                                // how we indicate someone as present 
                                if (attendance && attendance[kerberos]) {
                                    check.style.opacity = 0.5; 
                                }

                                // update attendance view
                                check.setAttribute("id", "check_" + kerberos);
                                check.onclick = function() {
                                    changeOpacity(this.id);
                                };

                                var caption = document.createElement("FIGCAPTION");
                                var txt = document.createTextNode(name);
                                caption.appendChild(txt);

                                

                                // create hierarchy of elements
                                figMem.appendChild(member);
                                figMem.appendChild(check);
                                figMem.appendChild(caption);
                
                                tdMem.appendChild(figMem);
                                tr.appendChild(tdMem);

                                // update counter for table layout
                                counter += 1; 
                            }
                            
                        });
                    }
                }
            }

            var div = document.getElementById("attend");
            div.appendChild(document.getElementById('attendanceTable'));
        });
    });
}

// hide or view checkmark on member images
function changeOpacity(id) { 
    var eltStyle = document.getElementById(id).style;

    if (eltStyle.opacity != "0") {
        eltStyle.opacity = "0";
    } else {
        eltStyle.opacity = "0.5";
    }
}

function saveAttendance() {
    var newAttendance = {};

    // use opacities of all checkmarks to determine who's present/absent
    $("[id^=check]").each(function() {
        var opacity = $(this).css('opacity'); 
        var member = $(this).attr('id').substring('check_'.length);
        newAttendance[member] = opacity != '0'; 
    }); 

    // save new attendance to db
    var ref = danceDatabase.ref('attendance/' + currentDanceGroupID + '/' + hyphen_delimited_date);
    ref.set(newAttendance);
}
