import React, { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Rectangle from "./reactangle";
import "./canvas.css";

const Canvas_Board = () => {
  const [isNowDrawing, setIsNowDrawing] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  var rectToDraw = [...rectangles, ...isNowDrawing];
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef(null);
  const fileRef = useRef(null);
  var reader = new FileReader();

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
    var canvasContents = stageRef.current.toDataURL(); // a data URL of the current canvas image
    var data = { image: canvasContents, date: Date.now() };
    var string = JSON.stringify(data);

    // create a blob object representing the data as a JSON string
    var file = new Blob([string], {
      type: "application/json",
    });

    // trigger a click event on an <a> tag to open the file explorer
    var a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "data.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };
  const loadCanvas = (file) => {
    console.log(file);
    if (file) {
      // read the contents of the first file in the <input type="file">
      reader.readAsText(file);
    }
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
          onClick={(e) => {
            loadCanvas(e.target.files[0]);
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
