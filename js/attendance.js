//put member dictionary into local storage
if (localStorage.getItem('memberDict') == null) {
    localStorage.setItem("memberDict", JSON.stringify({
        'Beth': 0,
        'Rob': 0,
        'Stefanie': 0,
        'David': 0
    }));
}

var memberDict1 = JSON.parse(window.localStorage.getItem("memberDict"));
var members = Object.keys(memberDict1);

function setupMembers() {
    var t = document.getElementById('myTable');

    var members = ['Beth', 'Rob', 'Stefanie', 'David']

    var numrows = Math.ceil(members.length / 3.0);
    var counter = 0;

    //get relative server paths
    var full_path = location.pathname;
    var path = full_path.substr(0, full_path.lastIndexOf("/") + 1);

    for (var i = 0; i < numrows; i++) {
        var tr = t.insertRow();
        for (var j = 0; j < 3; j++) {
            if (counter < members.length) {
                //add member image to table
                var tdMem = tr.insertCell();
                var figMem = document.createElement("FIGURE");
                figMem.setAttribute("id", "fig" + counter); 

                var member = document.createElement("IMG");
                member.setAttribute("src", path + "img/" + members[counter] + ".jpg");
                member.setAttribute("id", "member" + counter);
                member.width = "80";
                member.height = "80";
                member.style.borderRadius = "50%";
                member.style.position = "relative";

                var check = document.createElement("IMG");
                check.src = path + "img/green_checkmark.png";
                check.setAttribute("class", "checkmark");
                check.style.width = member.width + 'px';
                check.style.height = member.height + 'px';
                check.style.opacity = 0;

                check.setAttribute("id", "check" + counter);
                check.onclick = function() {
                    changeOpacity(this.id);
                };

                figMem.appendChild(member);
                figMem.appendChild(check);
                tdMem.appendChild(figMem);

                //update counter to new member
                counter += 1;

            }
        }
    }
    var div = document.getElementById("attend");
    div.appendChild(t);

    //add name to member pictures
    for (var c = 0; c < members.length; c++) {
        var caption = document.createElement("FIGCAPTION");
        var txt = document.createTextNode(members[c]);
        caption.appendChild(txt);
        document.getElementById("fig" + c).appendChild(caption);
    }

}

//hide and view check mark on member images
function changeOpacity(id) {
    var index = id.match(/([A-Za-z]+)([0-9]+)/)[2];
    if (document.getElementById(id).style.opacity != "0") {
        document.getElementById(id).style.opacity = "0";
    } else {
        document.getElementById(id).style.opacity = "0.5";
    }
}

function saveAttendance() {
    for (var c = 0; c < members.length; c++) {
        var id = "check" + c;
        if (document.getElementById(id).style.opacity == 0) {
            memberDict1[members[c]] = 0;
            localStorage.setItem("memberDict", JSON.stringify(memberDict1));
        } else {
            memberDict1[members[c]] = 1;
            localStorage.setItem("memberDict", JSON.stringify(memberDict1));
        }
        //add saved toast 
        var x = document.getElementById("savedToast");
        x.style.visibility = "visible";
        setTimeout(function() {
            x.style.visibility = "hidden";
        }, 800);
    }
}