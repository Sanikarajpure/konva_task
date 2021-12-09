import React, { useState, useRef } from "react";
import { Stage, Layer } from "react-konva";
import Rectangle from "./reactangle";
import { useCookies } from "react-cookie";
import "./canvas.css";
const Canvas_Board = () => {
  const [isNowDrawing, setIsNowDrawing] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [cookies, setCookie] = useCookies(["Stage"]);
  const [isdragging, setIsdragging] = useState(false);
  var rectToDraw = cookies.canvas
    ? cookies.canvas
    : [...rectangles, ...isNowDrawing];
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef(null);
  const mousedownHandler = (event) => {
    if (!isdragging) {
      if (rectangles.length === 0) {
        const { x, y } = event.target.getStage().getPointerPosition();
        setRectangles([{ x, y, width: 0, height: 0, key: 0 }]);
      }
    }
  };
  const mouseupHandler = (e) => {
    if (!isdragging) {
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
    }
    setIsdragging(false);
  };
  const downloadCanvas = () => {
    setCookie("canvas", rectToDraw, { path: "/" });
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
        Save
      </div>
      <div className="canvasBlock">
        <Stage
          className="canvasStage"
          width={800}
          height={600}
          onMouseDown={(checkDeselect, mousedownHandler)}
          onMouseUp={mouseupHandler}
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
                    setIsdragging(true);
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
