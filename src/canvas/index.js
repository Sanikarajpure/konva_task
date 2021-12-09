import React, { useState, useRef, useEffect, Fragment } from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import "./canvas.css";

const Rectangle = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // attaching transformer
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        fill="transparent"
        stroke="black"
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          // transformer is changing scale
          // to match the data resetting scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            // set min value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </Fragment>
  );
};

const Canvas_Board = () => {
  const [isNowDrawing, setIsNowDrawing] = useState([]);
  const [rectangles, setRectangles] = useState([]);
  const [isdragging, setIsdragging] = useState(false);
  var rectToDraw = [...rectangles, ...isNowDrawing];
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);

  const mousedownHandler = (event) => {
    console.log(isdragging);
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
  const mousemoveHandler = (e) => {
    if (!isdragging) {
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
            key: "0",
          },
        ]);
      }
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

        <img src="" alt="" ref={imgRef} className="pngCanvas" />
      </div>
    </div>
  );
};
export default Canvas_Board;
