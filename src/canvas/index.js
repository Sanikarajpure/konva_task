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

          // reset it back
          node.scaleX(1);
          node.scaleY(1);
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

const initialRectangles = [
  {
    x: 30,
    y: 30,
    width: 100,
    height: 100,
    fill: "orange",
    id: "rect1",
  },
  {
    x: 60,
    y: 50,
    width: 100,
    height: 100,
    fill: "red",
    id: "rect2",
  },
  {
    x: 40,
    y: 80,
    width: 100,
    height: 100,
    fill: "yellow",
    id: "rect3",
  },
];

const Canvas_Board = () => {
  const [rectangles, setRectangles] = useState(initialRectangles);
  const [selectedId, selectShape] = useState(null);
  const stageRef = useRef(null);
  const imgRef = useRef(null);

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
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {rectangles.map((rect, i) => {
              return (
                <Rectangle
                  key={i}
                  shapeProps={rect}
                  isSelected={rect.id === selectedId}
                  onSelect={() => {
                    selectShape(rect.id);
                  }}
                  onChange={(newAttrs) => {
                    const rects = rectangles.slice();
                    rects[i] = newAttrs;
                    setRectangles(rects);
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
