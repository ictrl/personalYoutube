import React from "react";
import Webcam from "react-webcam";
import publicIp from "public-ip";
import axios from "axios";
import "./App.css";

function App() {
  const getTimestamp = () => {
    let timestamp = Date.now();
    return (timestamp = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp));
  };

  const getIp = async () => {
    // return await publicIp.v4();
    return "sds";
  };

  return (
    <div className="App">
      <Webcam className="record" />;
      <Webcam audio={false} ref={webcamRef} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}
      {/* <VideoRecorder
        className={{ width: "100px" }}
        onError={() => alert("Please allow to proceed")}
        onRecordingComplete={async (blob) => {
          const file = new File([blob], "record", {
            type: blob.type,
          });
          const formData = new FormData();
          formData.append("record", file);
          formData.append("timestamp", getTimestamp());
          formData.append("ip", await getIp());
          const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
          axios
            .post("http://localhost:8000/upload", formData, config)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              console.error(error);
            });
        }}
      /> */}
    </div>
  );
}

export default App;
