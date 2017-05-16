// UTILITIES
// get list of all members across all dance groups
function getMembers(){
    var membersRef = danceDatabase.ref('groups/' + currentDanceGroupID + '/members/');
    membersRef.on("value", function(snapshot) {
        var members = snapshot.val();
        if (members) {
            return members;
        } else {
            return false;
        }
    });
}

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
