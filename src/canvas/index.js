import React, { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Rectangle from "./reactangle";
import "./canvas.css";

const Canvas_Board = () => {
  const [isNowDrawing, setIsNowDrawing] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedData, setLoadedData] = useState(null);
  var rectToDraw = loadedData
    ? [...loadedData, ...rectangles, ...isNowDrawing]
    : [...rectangles, ...isNowDrawing];
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef(null);
  const fileRef = useRef(null);

  const mousedownHandler = (event) => {
    if (!isDragging) {
      if (rectangles.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setRectangles([{ x, y, width: 0, height: 0, key: 0 }]);
      }
    } else {
      setRectangles([]);
    }
  };

  const mouseupHandler = (e) => {
    if (!isDragging) {
      if (rectangles.length === 1) {
        const sx = rectangles[0].x;
        const sy = rectangles[0].y;
        const { x, y } = e.target.getStage().getPointerPosition();
        const annotationToAdd = {
          x: sx,
          y: sy,
          width: x - sx,
          height: y - sy,
          key: isNowDrawing.length + 1,
        };
        isNowDrawing.push(annotationToAdd);
        setRectangles([]);
        setIsNowDrawing(isNowDrawing);
      }
    } else {
      setRectangles([]);
    }
    setIsDragging(false);
  };
  const mousemoveHandler = (e) => {
    if (!isDragging) {
      if (rectangles.length === 1) {
        const sx = rectangles[0].x;
        const sy = rectangles[0].y;
        const { x, y } = e.target.getStage().getPointerPosition();
        setRectangles([
          {
            x: sx,
            y: sy,
            width: x - sx,
            height: y - sy,
            key: 0,
          },
        ]);
      }
    } else {
      setRectangles([]);
    }
  };

  const downloadCanvas = () => {
    let canvasContents = JSON.stringify(rectToDraw);
    // create a blob object representing the data as a JSON string
    let file = new Blob([canvasContents], {
      type: "application/json",
    });
    // trigger a click event on an <a> tag to open the file explorer
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  function checkDeselect(e) {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  }

  const loadCanvas = async (e) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      let arr = JSON.parse(text);
      setLoadedData(arr);
    };
    reader.readAsText(e.target.files[0]);
  };

  return (
    <div className="canvasWrapper">
      <div>
        <button className="downloadBtn" onClick={downloadCanvas}>
          Save
        </button>
      </div>
      <div>
        Load:{" "}
        <input
          type="file"
          id="load"
          onChange={(e) => {
            loadCanvas(e);
          }}
          ref={fileRef}
        />
      </div>
      <div className="canvasBlock">
        <Stage
          id="canvas"
          className="canvasStage"
          width={800}
          height={600}
          onMouseDown={(checkDeselect, mousedownHandler)}
          onMouseUp={mouseupHandler}
          onMouseMove={mousemoveHandler}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {rectToDraw.map((rect, i) => {
              return (
                <Rectangle
                  key={rect.key}
                  shapeProps={rect}
                  isSelected={rect.key === selectedId}
                  onSelect={() => {
                    selectShape(rect.key);
                  }}
                  onChange={(newAttrs) => {
                    setIsDragging(true);
                    const rects = rectToDraw.slice();
                    rects[i] = newAttrs;
                    rectToDraw = rects;
                    selectShape(null);
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
export default Canvas_Board;
