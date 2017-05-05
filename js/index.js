// https://www.sanwebe.com/2013/03/addremove-input-fields-dynamically-with-jquery
$(document).ready(function() {
    var max_fields = 20; //maximum input boxes allowed
    var wrapper = $(".input_fields_wrap"); //Fields wrapper
    var add_button = $(".add_field_button"); //Add button ID

    var x = 1; //initlal text box count
    $(add_button).click(function(e) { //on add input button click
        e.preventDefault();
        if (x < max_fields) { //max input box allowed
            x++; //text box increment
            $(wrapper).append('<div><input class="form-control width-50 inline member" type="text" name="mytext[]"/><span class="glyphicon glyphicon-remove remove_field" aria-hidden="true"></span></div>'); //add input box
            $(wrapper).last().find('input').focus();
        }
    });

    $(wrapper).on('keyup', '.member', function(e) {
        e.preventDefault();

        if ($(this).val()) {
            if (e.keyCode == 13) {
                if (x < max_fields) { //max input box allowed
                    x++; //text box increment
                    $(wrapper).append('<div><input class="form-control width-50 inline member" type="text" name="mytext[]"/><span class="glyphicon glyphicon-remove remove_field" aria-hidden="true"></span></div>'); //add input box
                    $(wrapper).last().find('input').focus();
                }
            }
        };
    });

    $(wrapper).on("click", ".remove_field", function(e) { //user click on remove text
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
    })
});

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

var currentDanceGroup;


$(document).on('click', '.group-name h4', function(e) {
    console.log($(this));

    // TODO every time new dance group is chosen on main page,
    // update currentDanceGroup and localStorage accordingly
    localStorage.clear();
    currentDanceGroup = $(this).attr('id');
    if (currentDanceGroup) {
        localStorage.setItem("currentDanceGroup", currentDanceGroup);
    }
    console.log(currentDanceGroup);
    window.location.href = 'task.html';
});

function addNewGroup() {
    var name = $('#groupInp').val();
    console.log(name);

    // TODO get and save members
    // var members;


    if (name) {
        // replace spaces with dashes and convert to lowercase
        var id = name.replace(/\s+/g, '-').toLowerCase();
        console.log(id);
        var template = getGroupTemplate(name, id);
        document.getElementById('groups').prepend(template);

        var ref = danceDatabase.ref('groups/');

        // write child with custom key and save
        ref.child(id).setValue({
            name: name
        });

        $('#newGroup').get(0).reset();
        $('#newGroup').toggle();
    } else {
        $("#newGroup").effect("shake");
    }
}


function displayAllGroups() {
    var groupContainer = document.getElementById('groups');
    var ref = danceDatabase.ref('groups/');

    ref.orderByChild('timestamp').on("value", function(snapshot) {
        var groups = snapshot.val();
        var group_list = Object.keys(groups);
        console.log(group_list);

        // TODO note the backward iteration
        // must be consistent with display order of other tasks
        for (i = group_list.length; i >= 0; i--) {
            console.log(i);
            var group = groups[group_list[i]];

            if (group) {
                console.log(group);
                var name = group['name'];
                var id = group['id'];
                var template = getGroupTemplate(name, id);
                groupContainer.appendChild(template);
            }
        }
    }, function(error) {
        console.log("Oops, could not display all groups... " + error.code);
    });
}

window.onload = displayAllGroups;