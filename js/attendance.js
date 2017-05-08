// GLOBALS
var hyphen_delimited_date = getDate(false, '-'); // '05-01-2017'

//get relative server paths
var full_path = location.pathname;
var path = full_path.substr(0, full_path.lastIndexOf("/") + 1);


$(document).on('click', '#cancelMemberButton', function(e) {
    $('#newMember').hide();
});

$(document).on('click', '#addNew', function(e) {
    $('#newMember').toggle();
});


// on date change, update attendance display
function reloadAttendance(newDate) {
    hyphen_delimited_date = newDate;
    $(".task-name").text(TASKS[currentTask] + " for " + hyphen_delimited_date);
    setupMembers();
}

function setupMembers() { 
    $('#attendanceTable').empty();
    var t = document.getElementById('attendanceTable'); 

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
            div.appendChild(t);
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

