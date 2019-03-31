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


var video = document.querySelector('video');
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var localMediaStream = null;


function successCallback(stream) {
    // stream available to console so you could inspect it and see what this object looks like
    window.stream = stream;

    if (window.URL) {
        video.srcObject=stream;
        video.play();
    } else {
        video.src = stream;
    }

    video.play();
}


function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
}

function snapshot() {
    if (localMediaStream) {
        ctx.drawImage(video, 0, 0);
        document.querySelector('img').src = canvas.toDataURL('image/png');
        var image_link = canvas.toDataURL('image/png');
        console.log(image_link);
        document.getElementById('photo').value = image_link;
       // sendImage(1, image_link);
    }
}

video.addEventListener('click', snapshot, false);

navigator.getUserMedia({video: true}, function(stream) {
    video.srcObject=stream;
    video.play();
    localMediaStream = stream;
}, errorCallback);