// Check that the browser supports GetUserMedia
function hasGetUserMedia() {
    return !!(navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);
}


if (hasGetUserMedia()) {
    // Good to go!
} else {
    alert('getUserMedia() is not supported in your browser');
}


var constraints = {
    audio: false,
    video: true
};

navigator.getUserMedia(constraints, function(stream) {
    video.srcObject=stream;
    video.play();
    localMediaStream = stream;
}, errorCallback);


var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;

function snapshot() {
    if (localMediaStream) {
        ctx.drawImage(video, 0, 0);
        document.querySelector('img').src = canvas.toDataURL('image/png');
        var image_link = canvas.toDataURL('image/png');
        console.log(image_link);
        // Attach base64 image to form
        document.getElementById('photo').value = image_link;
    }
}

video.addEventListener('click', snapshot, false);

function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}