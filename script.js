const video = document.getElementById('video');

// Loading the various models for face detection and recognition
// Once all the models are loaded, start the video
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('./models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('./models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('./models'),
    faceapi.nets.faceExpressionNet.loadFromUri('./models')
]).then(startVideo)

function startVideo() {
    // Sets the video srcObject to the webcam's video stream
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )
}

// Adding event handler for video element
video.addEventListener('play', () => {
    // Canvas to display the detection results
    const canvas = faceapi.createCanvasFromMedia(video);

    // Append the canvas to the end of the document with position absolute
    document.body.append(canvas);
    const displaysize = { width: video.width, height: video.height};

    // Making the canvas dimension same as video
    faceapi.matchDimensions(canvas, displaysize);

    // Load the face detections every one second
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

        // Resizing to match the video dimensions
        const resizedDetections = faceapi.resizeResults(detections, displaysize);

        // Clear the canvas before drawing the detections to avoid overlapping
        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height)

        // Drawing the detections using faceapi method
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }, 100);
})