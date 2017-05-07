var SAMPLEVIDEOS = [{
    "date": "02/03/2017",
    "url": "https://www.youtube.com/watch?v=jkGAvU7LJSM"
}];

var VALID_FILE_EXTS = ['avi', 'mov', 'mp4']
var selectedFolder = ''; // 
var file;

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).on('click', '.modal-content', function(e) {
    var input = $('#videoURL').val();
    var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var link = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)/;
    if (re.test(input)) {
        $("#submitVideo").removeAttr('disabled')
    } else {
        $("#submitVideo").attr('disabled', 'disabled');
    }
})

$(document).on('click', '#submitVideo', function(e) {
    var inputURL = $('#videoURL').val();
    var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var link = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)/;
    if (!re.test(inputURL)) {
        $("#submitVideo").attr('disabled', 'disabled');
        $("#videoForm").effect("shake");
        $('.modal-content').effect('shake');
        inputCheckFalse();
    } else {
        var newinput = inputURL.replace(link, 'https://www.youtube.com/embed/');
        $('#iframeVideo').attr('src', newinput);
        var date = getDate();
        uploadedVideo();
        //{'date': date, 'url' : inputURL}
        // localStorage.setItem('videos', Json.stringify(SAMPLEVIDEOS));
        // var template = getVideoTemplate(date, inputURL);
        // document.getElementById('display').prepend(template);
    }
    // var createdNewIframe = document.createElement('iframe'); //need to add new form
});

$(document).on('change', 'select', function(e) {
    selectedFolder = $(this).val();

    if (selectedFolder == '') {
        // TODO bootstrap validation;
        return;
    } else if (selectedFolder == 'Add a new folder') {
        // TODO add input element to type in
        // replace selectedFolder with whatever user entered if valid, i.e. non repetitive
        $('#newFolder').show();

        $(document).bind('keyup', '#newFolder', function(e) {
            folderName = $('#newFolder').val();
            selectedFolder = '/' + folderName + '/';
            console.log('selectedFolder in keyup', selectedFolder);

            // TODO validation that selectedFolder isn't duplicate name
        });
    } else {
        console.log('updated folder?');
        folderName = selectedFolder;
        selectedFolder = '/' + folderName + '/';
    }
});

function include(arr, filename) {
    var file_ext = filename.substring(filename.length-3, filename.length);
    var valid_file = arr.indexOf(file_ext) != -1;
    console.log('valid file', valid_file);
    return valid_file;
}

// function validType(file) {
//     return file.type
// }

function loadFolderNames() {
    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroup);
    dbFoldersRef.on('value', function(snapshot) {
        var select = document.getElementById('folders');
        select.innerHTML = '';

        var data = snapshot.val();
        var keys = Object.keys(data); 
        console.log(keys);

        keys.forEach(function(key) {
            // console.log(key);
            var option = document.createElement('option');
            option.id = key;
            option.text = key;

            // console.log(option);
            select.appendChild(option);
        })

        // let users create a new folder
        var option = document.createElement('option');
        option.id = 'newFolderOption';
        option.text = 'Add a new folder';
        select.appendChild(option);
    });
}

function chooseVideo() {
    var fileTracker = document.getElementById("uploadFile");
    var txt = "";
    var selectErrorMsg = "Please choose a video!";

    if ('files' in fileTracker) {
        if (fileTracker.files.length == 0) {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
            return;
        } else {
            for (var i = 0; i < fileTracker.files.length; i++) {
                file = fileTracker.files[i];
                console.log('file', file);  

                var videoNameLabel = document.getElementById('videoNameLabel');
                console.log('videoname label', videoNameLabel);
                videoNameLabel.innerHTML = file.name;
            }
        }
    } else {
        if (fileTracker.value == "") {
            // TODO bootstrap validation
            console.log(selectErrorMsg);
        } else {
            // TODO bootstrap validation
            console.log('Uploading from file is not supported by this browser. Please upload from URL instead.')
            console.log('path of selected file', fileTracker.value);
        }
    }
}

function uploadVideoFromFile() {
    console.log('foldername', selectedFolder);

    var name = file.name;
    var folderPath = 'groups/' + currentDanceGroup + selectedFolder;
    var videoPath = folderPath + name;

    var folderRef = danceStorage.ref(folderPath);
    var videoRef = danceStorage.ref(videoPath);
    var dbVideoRef = danceDatabase.ref('videos/' + currentDanceGroup);

    // need id from dbVideoRef 
    var dbFolderRef = danceDatabase.ref('videofolders/' + currentDanceGroup + selectedFolder);

    console.log('file name', name);
    console.log('folder path', folderPath);
    console.log('video path', videoPath);  

    // check for valid file extension and for video name
    // change to validType
    if (include(VALID_FILE_EXTS, name)){ 
        // draw thumbnail of video in form
        // var canvas = document.getElementById('thumbnailCanvas');
        // canvas.getContext('2d').drawImage(file, 0, 0, file.videoWidth, file.videoHeight);

        videoRef.put(file).then(function(snapshot) {
            folderRef.child(name).getDownloadURL().then(function(url) {
                console.log('download url', url);

                var newPostRef = dbVideoRef.push({
                    date: getDate(true),
                    folder: folderName, 
                    name: name,
                    url: url
                });

                // Get the unique ID generated by a push()
                var postId = newPostRef.key;
                
                // dbFolderRef.push(postId);
                var newFolderKey = dbFolderRef.push().key;
                var update = {};
                update[newFolderKey] = postId; 
                dbFolderRef.update(update);

                $('#newFolder').hide();
                // TODO also empty its html

                return url;
            }).catch(function(error) {
                console.log('error', error);
            });
        }); 
    } 
}


// do not work properly as 4/30/17
function uploadedVideo() {
    var x = document.getElementById("doneUpload");
    x.style.visibility = "visible";
    setTimeout(function() {
        x.style.visibility = "hidden";
    }, 1200);
};

function createNewVideo() {
    document.getElementById("date").innerHTML = "<h4>" + getDate() + "</h4>";
}