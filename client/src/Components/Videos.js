import React, { useEffect, useState } from "react";
import FlatList from "flatlist-react";
import { get } from "axios";

const Videos = () => {
  const [records, setRecords] = useState([]);
  const [ip, setIp] = useState(null);

  const setVideoDiv = async (fileName) => {
    let div = document.getElementById(`div-${fileName}`);
    let img = document.getElementById(`img-${fileName}`);
    div.removeChild(img);

    var videoElement = document.createElement("video");

    videoElement.src = `http://localhost:8000/video/${fileName}`;
    videoElement.autoplay = true;
    videoElement.controls = true;

    div.appendChild(videoElement);

    div.insertBefore(videoElement, div.children[0]);
  };

  useEffect(() => {
    const getIp = async () => {
      // let ip = await publicIp.v4();
      let ip = "59.94.95.165"; //todo
      setIp(ip);
      return ip;
    };
    const getRecords = async () => {
      let ip = await getIp();
      let url = `http://localhost:8000/videos/${ip}`;
      console.log({ url });
      get(url)
        .then((res) => setRecords(res.data))
        .catch((err) => console.error(err));
    };
    getRecords();
    getIp();
  }, []);

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

          <p>{item.timestamp}</p>
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
