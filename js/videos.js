//imports
var imported = document.createElement('script'); 
imported.src = 'js/dropzone.js'; 
document.head.appendChild(imported);

// SAMPLE DATA
Dropzone.autoDiscover = false;

// Putting a <button> element in the dropzone message which can be targeted by the keyboard.
// Note: Clicking the dropzone area or the button will trigger the file browser.
var myDropzone = new Dropzone('#my-awesome-dropzone', { 
<<<<<<< HEAD
	dictDefaultMessage: "Drop files here or <button type='button'>select</button> to upload.",
	createImageThumbnails: false,
	addedfile: true
});

myDropzone.on("addedfile", function(file) {
	console.log("is this being triggered");
    // This is not an image, so Dropzone doesn't create a thumbnail.
    // Set a default thumbnail:
	myDropzone.emit("thumbnail", rob.jpg, "https://stuff.mit.edu/~erjonat/img/rob.jpg");

    // You could of course generate another image yourself here,
    // and set it as a data url.
=======
	dictDefaultMessage: "Drop files here or <button type='button'>select</button> to upload."
>>>>>>> 499dfa6fb5121c978698de4c5a05ae7ec9ca079d
});
