import React, { useState } from "react";
import fileDialog from "file-dialog";

export function DropZon(props) {
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
      <div
        className="drop-file"
        style={{ borderColor: isDrag ? "#2c24ff" : "transparent" }}
        onDrop={(ev) => {
          ev.preventDefault();
          var file = ev.dataTransfer.items[0].getAsFile();
          setIsDrag(false);
          convertImageToBase64(file);
          props.onChange(file);
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
          <img src={require("../assets/cloud.svg")} style={{ width: 40 }} />
          <br />
          <p>
            Drop file here or{" "}
            <a
              onClick={() => {
                fileDialog().then((files) => {
                  props.onChange(files[0]);
                  setIsDrag(false);
                  convertImageToBase64(files[0]);
                });
              }}
            >
              browse
            </a>
          </p>
        </div>
      </div>{" "}
    </div>
  );
}
