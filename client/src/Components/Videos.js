import React, { useEffect, useState } from "react";
import FlatList from "flatlist-react";
import publicIp from "public-ip";
import { get } from "axios";

const Videos = () => {
  const [records, setRecords] = useState([]);
  const [ip, setIp] = useState(null);

  const setVideoDiv = async (fileName) => {
    let div = document.getElementById(`div-${fileName}`);
    let img = document.getElementById(`img-${fileName}`);
    div.removeChild(img);

    var videoElement = document.createElement("video");

    // videoElement.src = `http://localhost:8000/video/${fileName}`;
    videoElement.src = `/video/${fileName}`;
    videoElement.autoplay = true;
    videoElement.controls = true;

    div.appendChild(videoElement);

    div.insertBefore(videoElement, div.children[0]);
  };

  useEffect(() => {
    const getIp = async () => {
      let ipv4 = await publicIp.v4();
      setIp(ipv4);
    };
    const getRecords = async () => {
      let url = `/videos/${ip}`;
      get(url)
        .then((res) => setRecords(res.data))
        .catch((err) => console.error(err));
    };
    getRecords();
    getIp();
  }, [ip]);

  const deleteVideo = (fileName) => {
    let div = document.getElementById(`div-${fileName}`);
    div.remove();
    let url = `/delete/${fileName}`;
    get(url).then((res) => console.log({ res }));
  };

  const renderVideos = (item) => {
    return (
      <>
        <div id={`div-${item.fileName}`}>
          <img
            onClick={(e) => setVideoDiv(e.currentTarget.alt)}
            src={item.image}
            className="image"
            id={`img-${item.fileName}`}
            alt={item.fileName}
          ></img>

          <div className="row">
            <p>{item.timestamp}</p>
            &nbsp; &nbsp;
            <button onClick={() => deleteVideo(item.fileName)}>Delete</button>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="videosContainer">
      <h1>Videos - {ip}</h1>

      <br />
      <FlatList
        renderWhenEmpty={() => <div>No Videos</div>}
        list={records}
        renderItem={(item) => renderVideos(item)}
      />
    </div>
  );
};

export default Videos;
