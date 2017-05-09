// GLOBALS
var hyphen_delimited_date = getDate(false, '-'); // '05-01-2017'
var memberPhoto;

//get relative server paths
var full_path = location.pathname;
var path = full_path.substr(0, full_path.lastIndexOf("/") + 1);



$(document).on('click', '#cancelMemberButton', function(e) {
    $('#newMember').hide();
});

$(document).on('click', '#addNew', function(e) {
    $('#newMember').toggle();
});

function saveMemberToDatabase(kerberos, name, url) {
    if (!url) {
        // no-user-img.jpg
        url = 'https://firebasestorage.googleapis.com/v0/b/danceplanrevolution.appspot.com/o/members%2Fno-user-img.jpg?alt=media&token=a00922f3-120a-4e4b-ae4e-58807d69a93e';
    }

    console.log(kerberos, name, url);
    console.log('attendance/' + currentDanceGroup + '/' + hyphen_delimited_date + '/'); 
    var attendanceRef = danceDatabase.ref('attendance/' + currentDanceGroup + '/' + hyphen_delimited_date);
    var groupsRef = danceDatabase.ref('groups/' + currentDanceGroup + '/members/');
    var membersRef = danceDatabase.ref('members/');

    var updateObjFalse = {};
    var updateObjTrue = {};
    updateObjFalse[kerberos] = false;
    updateObjTrue[kerberos] = true;

    attendanceRef.update(updateObjFalse);
    groupsRef.update(updateObjTrue);
    membersRef.child(kerberos).set({
        groups: [currentDanceGroup],
        kerberos: kerberos,
        name: name,
        photo: url
    });
}

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
                saveMemberToDatabase(kerberos, name, url);
            }).catch(function(error) {
                console.log('error', error);
            });
        }); 
    } else {
        console.log('no member photo', kerberos, name);
        saveMemberToDatabase(kerberos, name);
    }
});


// on date change, update attendance display
function reloadAttendance(newDate) {
    hyphen_delimited_date = newDate;
    $(".task-name").text(TASKS[currentTask] + " for " + hyphen_delimited_date);
    setupMembers();
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

function setupMembers() { 
    return danceDatabase.ref('attendance/' + currentDanceGroup + '/' + hyphen_delimited_date).once('value').then(function(snapshot) {
        var attendance = snapshot.val(); 
        var membersRef = danceDatabase.ref('groups/' + currentDanceGroup + '/members/');
        // console.log(attendance);

        membersRef.on("value", function(snapshot) {
            var members = snapshot.val();
            var numMembers = Object.keys(members).length;
            // console.log(members, Object.keys(members), numMembers); 

            var numRows = Math.ceil(numMembers / 3.0);
            var counter = 0;

            for (var memberKey in members) {
                if (members.hasOwnProperty(memberKey)) {
                    // console.log(memberKey + " -> " + members[memberKey]);
                    var memberRef = danceDatabase.ref('members/' + memberKey);

                    // retrieve and set up data for each group ember
                    memberRef.on("value", function(snapshot) {
                        $('#attendanceTable').empty();
                        var t = document.getElementById('attendanceTable'); 

                        var memberData = snapshot.val();
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
                    });
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
    var ref = danceDatabase.ref('attendance/' + currentDanceGroup + '/' + hyphen_delimited_date);
    ref.set(newAttendance); 

    // notify user of saved changes with toast 
    var x = document.getElementById("savedToast");
    x.style.visibility = "visible";
    setTimeout(function() {
        x.style.visibility = "hidden";
    }, 800); 
}
