import React, { useState } from "react";
import fileDialog from "file-dialog";
import "./dropZon.css";
import imageIcon from "../../assets/cloud.svg";
import { Spin } from "antd";

function DropZon({ onChange, loading = false }) {
  const [isDrag, setIsDrag] = useState(false);

  function convertImageToBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      //setImage(reader.result);
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
  }

  return (
    <div className="drop-file-glass">
      <Spin spinning={loading}>
        <div
          className="drop-file"
          style={{ borderColor: isDrag ? "#2c24ff" : "#eee" }}
          onDrop={(ev) => {
            ev.preventDefault();
            var file = ev.dataTransfer.items[0].getAsFile();
            setIsDrag(false);
            convertImageToBase64(file);
            onChange(file);
          }}
          onDragOver={(ev) => {
            ev.preventDefault();
          }}
          onDragEnter={(ev) => {
            ev.preventDefault();
            setIsDrag(true);
          }}
          onDragLeave={(ev) => {
            ev.preventDefault();
            //setIsDrag(false);
          }}
        >
          <div
            onDragEnter={(ev) => {
              ev.preventDefault();
              setIsDrag(true);
            }}
          >
            <img src={imageIcon} style={{ width: 40 }} />
            <br />
            <p>
              Drop file here or{" "}
              <a
                onClick={() => {
                  fileDialog().then((files) => {
                    onChange(files[0]);
                    setIsDrag(false);
                    convertImageToBase64(files[0]);
                  });
                }}
              >
                browse
              </a>
            </p>
          </div>
        </div>
      </Spin>
    </div>
  );
}

export default DropZon;
