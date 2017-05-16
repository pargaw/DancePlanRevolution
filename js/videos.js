var VALID_FILE_EXTS = ['avi', 'mov', 'mp4'];
var selectedFolder = ''; 
var file;
var uploadType = '';
var validURL = '';
var idCount = 0;
var videoName = '';
var folderName = '';
var foldersCurrentlyShowing = true;
var numOfFolders = 0;
var inCurrentFolder = false;
// $('.overlay').hide();

function checkURLValidity(input){
    var re = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    var reEmbed = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/embed\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
    if(re.test(input) || reEmbed.test(input)){return true;}
    else{return false;}
}

$(document).on('click', '#cancelVideoPost', function(e) { 
    hideVideoUploadForm();
});

$(document).on('click',  '#filterByFolder' , function(e){
    //displayFolderNames();
    if(inCurrentFolder){
        $('#videoDisplay').remove();
        //displayFolderNames();
    }
    if(!foldersCurrentlyShowing){
        $('#videoFolders').remove(); //removing folders here 
        console.log("being called from document filter by folder click")
        displayFolderNames();
        foldersCurrentlyShowing = true;
    }
    console.log(numOfFolders, "AT LEAST THIS");
    for(i =0; i<= numOfFolders-1;i++){
        console.log("is foderID click working?", i);
        $('#folderID'+i).on('click', function(evt){
            inCurrentFolder = true;
            var folderName = $(this).text();
            displayAllVideosInFolder(folderName);
            $('#videoFolders').empty();
            console.log(i);        
            foldersCurrentlyShowing = false;
        })
    }
    // console.log(folderIsAlreadyClicked);
});



$(document).on('click', '#addNewVideo', function(e) {
    $('#uploadOptions').toggle();
    $('#newVideo').hide();
    uploadType = '';
});

$(document).on('click', '#localUpload', function(e) {
    uploadType = 'local';
    $('#uploadOptions').toggle();
    $('#videoNameInput, #videoURL').hide();
    $('#folderSelection, #fileUpload, #newVideo, #videoButtons').show();

    $('#videoURL').removeAttr('required');
    $('#videoNameInput').removeAttr('required');
    $('#uploadVideoFile').attr('required', '');
});

$(document).on('click', '#urlUpload', function(e) {
    uploadType = 'url';
    $('#uploadOptions').toggle();
    $('#fileUpload').hide();
    $('#folderSelection, #newVideo, #videoNameInput, #videoURL, #videoButtons').show();
    $('#videoURL').focus();

    $('#videoURL').attr('required', '');
    $('#videoNameInput').attr('required', '');
    $('#uploadVideoFile').removeAttr('required');
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

            // TODO check that selectedFolder name isn't duplicate of existing one
        });
    } else {
        folderName = selectedFolder;
        selectedFolder = '/' + folderName + '/';
    }

    if ((validURL || file) && videoName) { 
        $("#submitVideo").prop('disabled', false);
    };
});

$(document).on('keyup', '#videoNameInput', function(e) {
    videoName = $(this).val();

    // TODO check that selectedFolder name isn't duplicate of existing one
});

$(document).on('click','#0', function(evt){
    pauseTheVideos();
})

function include(arr, filename) {
    var file_ext = filename.substring(filename.length-3, filename.length);
    var valid_file = arr.indexOf(file_ext) != -1;
    return valid_file;
}

function loadFolderNames() {

    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID);
    dbFoldersRef.on('value', function(snapshot) {
        var select = document.getElementById('folders');
        select.innerHTML = '';
        var data = snapshot.val();
        var optionDefault = document.createElement('option');
        optionDefault.id = 'defaultOption';
        optionDefault.text = 'Choose a folder';
        select.appendChild(optionDefault);

        if (data) {
            var keys = Object.keys(data); 

            //the default option should be the first to come up in the folder dropdown
            keys.forEach(function(key) {
                var option = document.createElement('option');
                option.id = key;
                option.text = key;
                select.appendChild(option);
            })
        }
        
        // let users create a new folder
        var option = document.createElement('option');
        option.id = 'newFolderOption';
        option.text = 'Add a new folder';
        select.appendChild(option);
    });
}

function displayFolderNames(){
    // console.log(foldersCurrentlyShowing);
    // if(foldersCurrentlyShowing){
        numOfFolders = 0;
        var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID);
        dbFoldersRef.on('value', function(snapshot) {
            var data = snapshot.val();
            console.log(data, snapshot, 'here');
            if (data) {
                var keys = Object.keys(data); 
                var id = 0;
                // addFolderHTML("Add new folder...", "add_new_folder");         
                //the default option should be the first to come up in the folder dropdown
                keys.forEach(function(key) {
                    addFolderHTML(key, id);
                    id +=1;
                    numOfFolders+=1;
                }); 
            }
            console.log("going in once, displayFolderNames()");
        });
    // foldersCurrentlyShowing = false;
    // }
    // else{
    //     numOfFolders=0;
    //     //remove folders?
    //     $('#videoFolders').empty();
    //     console.log(numOfFolders);
    //     //foldersCurrentlyShowing    
    // }
    // checkForEditAndDeleteFolderPress();
}
//is this called when we first add a video in the folder???? //bug might be there
function displayAllVideosInFolder(foldername){
    var names =[];  
    var dates = [];
    var selectedFolder = '/'+ foldername + '/';
    var dbFoldersRef = danceDatabase.ref('videofolders/' + currentDanceGroupID + selectedFolder);
    var dbVideosRef = danceDatabase.ref('/videos/' + currentDanceGroupID);
    dbFoldersRef.on('value', function(snapshot) {
        var data = snapshot.val();
        if(data){
            var videoKeys = Object.keys(data);
            videoKeys.forEach(function(key){
                // console.log(keys, key);
                dbVideosRef.on('value', function(snapshot){
                    var dataVideo = snapshot.val();
                    var keyVideo = Object.keys(dataVideo);
                    keyVideo.forEach(function(key){
                        // console.log('key', key);
                        var date = dataVideo[key].date;
                        if(dataVideo[key].folder == foldername && !names.includes(dataVideo[key].name)  && !dates.includes(dataVideo[key].date in dates)){
                            names.push(dataVideo[key].name);
                            dates.push(dataVideo[key].date);
                            var src = dataVideo[key].url.replace("https://www.youtube.com/watch?v=", "");
                            console.log('entering iframe from folderseref')
                            addIframeVideo (src, date, foldername);
                        }
                    })
                })
            })
        }
    })
}


function removeVideosNotInTheFolder(){
    $('#videoDisplay').empty();
}

function chooseVideo() {
    var fileTracker = document.getElementById("uploadVideoFile");
    var txt = "";
    var selectErrorMsg = "Please choose a video!";

    if ('files' in fileTracker) {
        if (fileTracker.files.length == 0) {
            // TODO bootstrap validation
            // console.log(selectErrorMsg);
            return;
        } else {
            for (var i = 0; i < fileTracker.files.length; i++) {
                file = fileTracker.files[i];
                // console.log('file', file);

                var videoNameLabel = document.getElementById('videoNameLabel');
                // console.log('videoNameLabel', videoNameLabel);
                videoNameLabel.innerHTML = file.name;
                videoName = file.name;

                if (selectedFolder) {
                    $("#submitVideo").prop('disabled', false);

                }
            }
        }
    } else {
        if (fileTracker.value == "") {
            // TODO bootstrap validation
            // console.log(selectErrorMsg);
        } else {
            // TODO bootstrap validation
            // console.log('Uploading from file is not supported by this browser. Please upload from URL instead.')
            // console.log('path of selected file', fileTracker.value);
        }
    }
}

function saveVideoToDatabase(dbVideoRef, dbFolderRef, videoName, url) {
    console.log('url, name, folder when saving to database', url, videoName, folderName);

    var newPostRef = dbVideoRef.push({
        date: getDate(true),
        folder: folderName, 
        name: videoName,
        url: url
    });
    console.log("saving to database",newPostRef);
    // Get the unique ID generated by a push()
    var postId = newPostRef.key;
    
    // dbFolderRef.push(postId);
    var newFolderKey = dbFolderRef.push().key;
    var update = {};
    update[newFolderKey] = postId; 

    dbFolderRef.update(update).then(function() {
        $('#newFolder').hide();
        resetVideoParams();
        return url;
    });

}

function resetVideoParams() { 
    selectedFolder = ''; 
    file = null;
    uploadType = '';
    validURL = '';
    videoName = '';
    folderName = '';
    $('#videoNameInput').val('');
    hideVideoUploadForm();
}

function hideVideoUploadForm() {
    removeLoadingOverlay();
    $('#newVideo')[0].reset();
    $('#newVideo').hide();
}

function takeVideoToFolder(videoName, folderName){
    displayAllVideosInFolder(folderName);
}

function postVideo() { 
    var dbVideoRef = danceDatabase.ref('videos/' + currentDanceGroupID);
    var dbFolderRef = danceDatabase.ref('videofolders/' + currentDanceGroupID + selectedFolder);
    // var olddbFolderRef = dbFolderRef;
    // console.log('file and selectedFolder', this.file, this.selectedFolder);
    if (uploadType == 'local') {
        if (file && selectedFolder) {
            addLoadingOverlay();
            console.log('foldername in local', selectedFolder);
            console.log('filevideo local name', videoName);
            var videoName = file.name;
            var folderPath = 'groups/' + currentDanceGroupID + selectedFolder;
            var videoPath = folderPath + videoName;
            console.log('folder path local', folderPath);
            console.log('video path', videoPath);  
            console.log('videoName', videoName);
            var folderRef = danceStorage.ref(folderPath);
            var videoRef = danceStorage.ref(videoPath);
            // draw thumbnail of video in form
            // var canvas = document.getElementById('thumbnailCanvas');
            // canvas.getContext('2d').drawImage(file, 0, 0, file.videoWidth, file.videoHeight);

            videoRef.put(file).then(function(snapshot) {
                console.log('videoName inside videoRef fn', videoName);
                folderRef.child(videoName).getDownloadURL().then(function(url) {
                    console.log('saveVideoToDatabase comes after for local', videoName);
                    saveVideoToDatabase(dbVideoRef, dbFolderRef, videoName, url);
                }).catch(function(error) {
                    console.log('error', error);
                });
            }); 
        } 
        else {
            if (!this.file) {
                $('#fileUpload').effect( "shake" );
            }

            if (!this.selectedFolder) {
                $('#folderSelection').effect( "shake" ); 
            }
        } 
    }
    else if (uploadType == 'url') {
        console.log('url, name, folder', this.validURL, this.videoName, this.selectedFolder);
        
        if (this.validURL && this.videoName && this.selectedFolder) {
            addLoadingOverlay();
            console.log('entering iframe from postVideo()');
            var src = this.validURL.replace("https://www.youtube.com/watch?v=", "");
            addIframeVideo(src, this.date, this.selectedFolder.replace('/',''));
            saveVideoToDatabase(dbVideoRef, dbFolderRef, this.videoName, validURL);    
            foldersCurrentlyShowing = false;
            console.log(src, this.selectedFolder.replace('/','').replace('/',''), this.selectedFolder, "this is what went in");
            displayAllVideosInFolder(this.selectedFolder.replace('/','').replace('/',''));

        } else {
            if (!this.validURL) {
                $('#videoURL').effect( "shake" );
            }  

            if (!this.videoName) {
                $('#videoNameInput').effect( "shake" );
            }

            if (!this.selectedFolder) {
                $('#folderSelection').effect( "shake" );
            }   
        }
    }
}

//after input, check and if correct input => remove the disabled look and let button be clicked
$(document).ready(function(evt){
    // as of right now it doesnt yet recognize the autofill properly
    displayFolderNames();
    console.log("docuent. ready calling displayFolders")

    // foldersCurrentlyShowing = false;
    setTimeout(function (evt) {
    if ($('#videoURL:-webkit-autofill').val()) {
        $('#videoURL').val() = $('#videoURL:-webkit-autofill').val();
    }  }, 1);
    $('#videoURL').on('keyup', function(){
        var input = $('#videoURL').val();
        if (checkURLValidity(input)) {
            validURL = input;
            var src = input.replace("https://www.youtube.com/watch?v=", "");
            $("#submitVideo").prop('disabled', false);
            

            $("#submitVideo").unbind('click').on('click', function(evt){
                $('#videoFolders').remove();

                postVideo();
                $('#videoURL').val("");
                $('#newVideo').hide();
                $('#videoButtons').hide();
            });
        } else {
            $("#submitVideo").prop('disabled', true);
        }
    });
    $('.left.carousel-control, .right.carousel-control').on('click', function(evt){
        pauseTheVideos();
    }); 
})

function showVideoToast() {
    var x = document.getElementById("doneUpload");
    x.style.display = "block";
    setTimeout(function() {
        x.style.display = "none";
    }, 3000);
};

function createDateForVideo() {
    document.getElementById("date").innerHTML = "<h4>" + getDate() + "</h4>";
}

function createGroupTagForVideo(groupName){
    document.getElementById('groupTag').innerHTML = "<h4> #" + groupName + "</h4>";
}

function addIframeVideo (src, date, folderName) {
    console.log("foldername is",folderName, "entering iframe");
    $('<div class="panel panel-default" id="video'+ src+'"><div class="videoDates" style="position: relative"><h4>'+ date
        +'</h4><img class="deleteVid" id="deleteVidBtn'+src+'" src="img/red_trash.png"></div>'+'<div class="groupTag" style="position: relative"> <h4>#'+ 
        folderName +'folder </h4></div>' +'<div style="margin:auto" class="embed-responsive embed-responsive-16by9" style="margin-top:30px"> <iframe allowfullscreen id="iframe'+ 
        idCount + '" class="embed-responsive-item" src="https://www.youtube.com/embed/'+
        src+'"></iframe></div></div>').prependTo('#videoDisplay');
    idCount +=1;

    document.getElementById("deleteVidBtn"+src).onclick = function() {
        $('#myDeleteVidModal').modal('show');

        $('#yesVidBtn').on('click', function() {
            $("#video"+src).fadeOut('slow', function() {
                var vid = danceDatabase.ref('videos/'+currentDanceGroupID).child(key);
                vid.remove();

                var folder = danceDatabase.ref('videofolders/'+currentDanceGroupID+"/"+groupName).child(key);
                folder.remove();

                document.getElementById("video"+src).remove();
            });

          $('#myDeleteVidModal').modal('hide');
        });
    }
}

function pauseTheVideos(){
    for (i=0; i <= idCount-1; i++){
        $('#iframe'+i).attr('src', $('#iframe'+i).attr('src'));
    }
}

// folder stuff
function addFolderHTML(name, folderId){
    console.log(name);
    // $('<div class="panel panel-default folder-name" style="margin-top:20px"> <div class="row"><div class="col-6"><div id="leftDiv"><h4 class="panel-body" id="folderID' + 
    //     folderId+ '"><span class="glyphicon glyphicon-folder-close" style="margin:auto; margin-right:20px; margin-left: 20px"></span>'+ 
    //     name + '</h4></div></div><div class="col"><div class="rightDiv"><img id="editBtn" class="editBtn src="img/green_edit.png"><img class="deleteBtn src="img/red_trash.png" class="deleteBtn-KjkaykfGOpbn-rf683r"></div></div></div>').prependTo('#videoFolders');
    $('<div class="panel panel-default folder-name" style="margin-top:20px">'
    + '<div id="leftDiv"><h4 class="panel-body" id="folderID' +  folderId + '"><span class="glyphicon glyphicon-folder-close"'
    + ' style="margin:auto; margin-right:20px; margin-left: 20px"></span>'+ name + '</h4>  <img class="deleteFolder"'
    +'src="img/red_trash.png" id="deleteFolder_'+ 
    folderId +'"><img class="editFolder" src="img/green_edit.png" id="editFolder_'+  folderId +'"></div><div class="groupTag" style="position: relative"></div>' 
    +'</div>').prependTo('#videoFolders');
    // checkForEditAndDeleteFolderPress();

    $('#editFolder_'+folderId).on('click', function(evt){ //TODO
        console.log('editing');
    })


    $('#deleteFolder_'+folderId).on('click', function(evt){
            $('#myDeleteFolderModal').modal('show');

            $('#yesFolderBtn').on('click', function() {
                console.log("delete folder ", 'videofolders/'+currentDanceGroupID+"/"+'folderID'+folderId);
                $('#folderID'+folderId).parent().parent().fadeOut('slow', function() {
                    var foldername = 'folderID'+folderId;
                    var folder = danceDatabase.ref('videofolders/'+currentDanceGroupID+"/"+document.getElementById(foldername).innerText);
                    folder.remove();
                    document.getElementById('folderID'+folderId).parentNode.parentNode.remove();
                });
              $('#myDeleteFolderModal').modal('hide');
            });
        })

}

function addLoadingOverlay() {
    $("<div id='loadingOverlay' />").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        left: 0,
        top: 0,
        zIndex: 100, 
        background: "url(img/load.gif) no-repeat 50% 50%"
    }).appendTo($("#newVideo").css("position", "relative")); 
}

function removeLoadingOverlay(){ 
    $('#loadingOverlay').remove();
}

function getVideoID(element, prefixLength) {
    var msgId = element.className; 
    var key = msgId.substring(prefixLength, msgId.length);
    return key;    
}

// function checkForEditAndDeleteFolderPress(){
//     for(i=0;i<=numOfFolders-1; i++){
//         // $('#editFolder_'+i).on('click', function(evt){
//         // })
//         $('#deleteFolder_'+i).on('click', function(evt){
//             var folderName = $(this).text();
//             var newInput = '';
//             console.log(folderName, 'editing');
//         })
//     }

//}