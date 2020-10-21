import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import publicIp from "public-ip";
import { post } from "axios";
const Home = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [image, setImage] = useState(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  //button click handler
  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const handleRecord = useCallback(() => {
    captureImage();
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleStop = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, recordedChunks, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const handleRetake = useCallback(async () => {
    toggleCamera(true);
    if (recordedChunks.length) {
      setRecordedChunks([]);
      handleRecord();
    }
  }, [recordedChunks]);

  const handleSave = useCallback(async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      const file = new File([blob], await generateName(), {
        type: blob.type,
      });
      const formData = new FormData();
      formData.append("record", file);
      formData.append("image", image);
      formData.append("timestamp", getTimestamp());
      formData.append("ip", await getIp());
      const config = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      // const url = "http://localhost:8000/upload";
      const url = "/upload";
      post(url, formData, config)
        .then((res) => console.log(res))
        .catch((err) => console.error(err));
    }
  }, [recordedChunks]);

  const handlePlay = () => {
    if (recordedChunks.length) {
      toggleCamera(false);
    }
  };

  //utility fn
  const getTimestamp = () => {
    let date = new Date().toDateString();
    let time = new Date().toLocaleTimeString();
    let dateTime = `${date} ${time}`;
    return dateTime;
  };

  const getIp = async () => {
    return await publicIp.v4();
    // return "59.94.95.165"; //todo
  };

  const generateName = async () => {
    let timestamp = Date.now();
    let ip = await getIp();
    let name = `${ip}-${timestamp}`;
    return name;
  };

  const toggleCamera = (flag) => {
    let camera = document.querySelector(".camera");
    let video = document.querySelector("video");
    if (flag) {
      camera.style.display = "block";
      video.style.display = "none";
    } else {
      camera.style.display = "none";
      video.style.display = "block";
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      let videoUrl = window.URL.createObjectURL(blob);

      video.src = videoUrl;
    }
  };

  const renderStopBtn = () => (
    <button className="stop" onClick={handleStop}>
      Stop
    </button>
  );

  const renderRecordBtn = () => {
    if (recordedChunks.length <= 0) {
      return (
        <button className="stop" onClick={handleRecord}>
          Record
        </button>
      );
    } else return null;
  };

  const renderToolsBtn = () => {
    if (recordedChunks.length > 0) {
      return (
        <>
          <button className="retake" onClick={handleRetake}>
            Retake
          </button>
          <button className="save" onClick={handleSave}>
            Save
          </button>
          <button className="download" onClick={handleDownload}>
            Download
          </button>
          <button className="play" onClick={handlePlay}>
            Play
          </button>
        </>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      <video
        className="video"
        width="650"
        controls
        autoPlay
        height="650"
      ></video>
      <Webcam className="camera" audio={true} ref={webcamRef} />
      <br />
      {capturing ? renderStopBtn() : renderRecordBtn()}
      {renderToolsBtn()}
    </>
  );
};

export default Home;
