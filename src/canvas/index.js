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
  const imgRef = useRef(null);

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
    //get base64 uri of the canvas
    const dataUri = stageRef.current.toDataURL();

    //setting img tag src to dataUri

    imgRef.current.src = dataUri;
    console.log(dataUri);
  };

  const checkDeselect = (e) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <div className="canvasWrapper">
      <div
        onClick={() => {
          downloadCanvas();
        }}
        className="downloadBtn"
      >
        Download
      </div>
      <div className="canvasBlock">
        <Stage
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
