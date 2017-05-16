var memberPhoto;
var hyphen_delimited_date = getDate(false, '-');

function strip_text(text) {
    return text.replace(/^\s+|\s+$/g, '');
}

$(document).on('click', '#addNew', function(e) {
    $('#newGroup').toggle();
});

$(document).on('click', '#cancelButton', function(e) {
    $('#newGroup').hide();
});

$(document).on('click', '#addAnotherMemberButton', function(e) {
    var addedMembersDiv = document.getElementById('addedMembers');

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

        document.getElementById("addedMemLabel").style.display="block";
        var inp = document.createElement('input');
        inp.value = name;
        inp.disabled = true;
        addedMembersDiv.appendChild(inp);

        var sp = document.createElement('span');
        sp.className = "glyphicon glyphicon-remove";
        addedMembersDiv.appendChild(sp);

        $('#addMemberKerberos').val('');
        $('#addMemberName').val('');
        

    } else {
        $("#newGroup").effect("shake");
    }

});

$(document).on('click', '#doneButton', function(e) {
    addNewGroup();
});

function getGroupTemplate(name, id) {
    var groupDiv = document.createElement("div");
    groupDiv.className = "panel panel-default group-name";

    var groupName = document.createElement("h4");
    groupName.className = "panel-body";
    groupName.innerHTML = name;
    groupName.id = id;

    groupDiv.appendChild(groupName);
    return groupDiv;
}


$(document).on('keydown', 'input', function(e) {
    if (e.which == 13) {
        e.preventDefault();
    }
});

var currentDanceGroupID;
var currentDanceGroup;

function goToGroupPage(groupID) {
    localStorage.clear();
    currentDanceGroupID = groupID;
    currentDanceGroup = $('#' + currentDanceGroupID).html();
    if (currentDanceGroupID) {
        localStorage.setItem("currentDanceGroupID", currentDanceGroupID);
        localStorage.setItem("currentDanceGroup", currentDanceGroup);
    }
    console.log(currentDanceGroupID, currentDanceGroup);
    window.location.href = 'task.html';
}

$(document).on('click', '.group-name h4', function(e) {
    // every time new dance group is chosen on main page,
    // update currentDanceGroupID and localStorage accordingly
    goToGroupPage($(this).attr('id'));
});



function addNewGroup() {
    var name = $('#groupInp').val();
    console.log(name); 

    if (name) {
        // replace spaces with dashes and convert to lowercase
        var id = name.replace(/\s+/g, '-').toLowerCase();
        console.log(id);
        var template = getGroupTemplate(name, id);
        console.log(template);
        document.getElementById('groups').prepend(template);

        var ref = danceDatabase.ref('groups/');
        console.log(ref.child(id)); 

        // write child with custom key and save
        ref.child(id).set({
            id: id,
            name: name,
            date: getDate(true) 
        });

        $('#newGroup').get(0).reset();
        $('#newGroup').toggle();
        goToGroupPage(id);
    } else {
        $("#newGroup").effect("shake");
    }
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

function saveMemberToDatabase(kerberos, name, url) {
    if (!url) {
        // no-user-img.jpg
        url = 'https://firebasestorage.googleapis.com/v0/b/danceplanrevolution.appspot.com/o/members%2Fno-user-img.jpg?alt=media&token=a00922f3-120a-4e4b-ae4e-58807d69a93e';
    }
    console.log(kerberos, name, url);
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
    $('#newGroup')[0].reset();
    $('#newGroup').hide();
}

function displayAllGroups() {
    var groupContainer = document.getElementById('groups');
    var ref = danceDatabase.ref('groups/');

    // ref.orderByChild.on('date', function (snapshot) {
    //     console.log(snapshot.val());

    //     snapshot.forEach(function(child) {
    //         console.log(child.val());
    //     };
    // });
    ref.orderByChild('date').on("value", function(snapshot) {
        var groups = snapshot.val();
        var group_list = Object.keys(groups);
        console.log('keys', group_list);
        $('#groups').empty();

        this.data = [];

        snapshot.forEach(function(child) {
            this.data.push(child.val());
        }.bind(this));

        console.log(this.data);
        console.log("filtered", data.map(function(val) { return new Date(val.timestamp).toString(); }));

        // TODO note the backward iteration
        // must be consistent with display order of other tasks
        for (i = group_list.length; i >= 0; i--) {
            console.log(i);
            var group = groups[group_list[i]];

            if (group) {
                console.log('GROUP', group);
                var name = group['name'];
                var id = group['id'];
                var template = getGroupTemplate(name, id);
                groupContainer.prepend(template);
            }
        }
    }, function(error) {
        console.log("Oops, could not display all groups... " + error.code);
    });
}

window.onload = displayAllGroups;

function removeTeam(groups,attend,announ,videos,videofolders){
    groups.remove();
    attend.remove();
    announ.remove();
    videos.remove();
    videofolders.remove();
    window.location.href = 'index.html';
}