$(document).on('click', '#addNew', function(e) {
    $('#newGroup').toggle();
});

$(document).on('click', '#cancelButton', function(e) {
    $('#newGroup').hide();
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
