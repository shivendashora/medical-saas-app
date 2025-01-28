import React, { useState, useEffect, useRef } from "react";
import { Stage, Layer, Rect, Circle, Line, Text, Image as KonvaImage } from "react-konva";
import {
  FaSave,
  FaCircle,
  FaSquare,
  FaRulerCombined,
  FaArrowLeft,
  FaSearchPlus,
  FaSearchMinus,
  FaTimes,
  FaAngleDoubleRight,
  FaCrop,
} from "react-icons/fa";

const PIXELS_TO_MM = 3.7795275591; // Conversion factor from pixels to millimeters

const ImageAnnotator = ({ image, onBack, onSave }) => {
  const [annotations, setAnnotations] = useState([]);
  const [newAnnotation, setNewAnnotation] = useState(null);
  const [loadedImage, setLoadedImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [selectedShape, setSelectedShape] = useState(null);
  const [anglePoints, setAnglePoints] = useState([]);
  const [brightness, setBrightness] = useState(1);
  const [hoveredIcon, setHoveredIcon] = useState(null);
  const [cropRect, setCropRect] = useState(null);

  const stageRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      setLoadedImage(img);
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, [image]);

  useEffect(() => {
    if (imageRef.current) {
      imageRef.current.cache();
      imageRef.current.filters([Konva.Filters.Brighten]);
      imageRef.current.brightness(brightness - 1);
      imageRef.current.getLayer().batchDraw();
    }
  }, [brightness]);

  const handleMouseDown = (event) => {
    if (!selectedShape) return;
    const { offsetX, offsetY } = event.evt;
    if (selectedShape === "angle") {
      setAnglePoints((prev) => [...prev, { x: offsetX / scale, y: offsetY / scale }]);
    } else if (selectedShape === "crop") {
      setCropRect({
        x: offsetX / scale,
        y: offsetY / scale,
        width: 0,
        height: 0,
      });
    } else {
      setNewAnnotation({
        x: offsetX / scale,
        y: offsetY / scale,
        width: 0,
        height: 0,
        points: [],
      });
    }
  };

  const handleMouseMove = (event) => {
    if (!newAnnotation && !cropRect) return;

    const { offsetX, offsetY } = event.evt;
    const endX = offsetX / scale;
    const endY = offsetY / scale;

    if (selectedShape === "rectangle") {
      const rectX = Math.min(newAnnotation.x, endX);
      const rectY = Math.min(newAnnotation.y, endY);
      const rectWidth = Math.abs(endX - newAnnotation.x);
      const rectHeight = Math.abs(endY - newAnnotation.y);
      setNewAnnotation({ ...newAnnotation, x: rectX, y: rectY, width: rectWidth, height: rectHeight });
    } else if (selectedShape === "circle") {
      const radius = Math.sqrt(Math.pow(endX - newAnnotation.x, 2) + Math.pow(endY - newAnnotation.y, 2));
      setNewAnnotation({ ...newAnnotation, width: radius * 2 });
    } else if (selectedShape === "line") {
      setNewAnnotation({ ...newAnnotation, points: [newAnnotation.x, newAnnotation.y, endX, endY] });
    } else if (selectedShape === "crop") {
      const rectX = Math.min(cropRect.x, endX);
      const rectY = Math.min(cropRect.y, endY);
      const rectWidth = Math.abs(endX - cropRect.x);
      const rectHeight = Math.abs(endY - cropRect.y);
      setCropRect({ ...cropRect, x: rectX, y: rectY, width: rectWidth, height: rectHeight });
    }
  };

  const handleMouseUp = () => {
    if (newAnnotation) {
      let annotation = {
        ...newAnnotation,
        shape: selectedShape,
      };

      // Calculate area/length based on shape type
      if (selectedShape === "rectangle") {
        const areaInPx = annotation.width * annotation.height;
        const areaInMm = (areaInPx / Math.pow(PIXELS_TO_MM, 2)).toFixed(2);
        annotation.text = `Area: ${areaInMm} mm²`;
        annotation.color = "yellow";
      } else if (selectedShape === "circle") {
        const radiusInPx = annotation.width / 2;
        const radiusInMm = radiusInPx / PIXELS_TO_MM;
        const areaInMm = (Math.PI * Math.pow(radiusInMm, 2)).toFixed(2);
        annotation.text = `Area: ${areaInMm} mm²`;
        annotation.color = "orange";
      } else if (selectedShape === "line") {
        const [x1, y1, x2, y2] = annotation.points;
        const lengthInPx = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        const lengthInMm = (lengthInPx / PIXELS_TO_MM).toFixed(2);
        annotation.text = `Length: ${lengthInMm} mm`;
        annotation.color = "cyan";
      }

      setAnnotations((prev) => [...prev, annotation]);
      setNewAnnotation(null);
    }

    if (selectedShape === "angle" && anglePoints.length === 3) {
      const [p1, p2, p3] = anglePoints;
      const angle = calculateAngle(p1, p2, p3).toFixed(2);
      const annotation = {
        shape: "angle",
        points: [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y],
        text: `Angle: ${angle}°`,
        color: "magenta",
      };
      setAnnotations((prev) => [...prev, annotation]);
      setAnglePoints([]);
    }

    if (selectedShape === "crop" && cropRect) {
      cropImage(cropRect);
      setCropRect(null);
    }
  };

  const calculateAngle = (p1, p2, p3) => {
    const angle1 = Math.atan2(p1.y - p2.y, p1.x - p2.x);
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x);
    let angle = ((angle2 - angle1) * 180) / Math.PI;
    if (angle < 0) angle += 360;
    return angle;
  };

  const smoothZoom = (targetScale) => {
    let frame = 0;
    const totalFrames = 20;
    const initialScale = scale;
    const step = (targetScale - initialScale) / totalFrames;
  
    const animateZoom = () => {
      if (frame < totalFrames) {
        setScale((prev) => prev + step);
        frame++;
        requestAnimationFrame(animateZoom);
      } else {
        setScale(targetScale);
      }
    };
  
    animateZoom();
  };
  
  const handleZoomIn = () => {
    smoothZoom(Math.min(scale * 1.2, 5));
  };
  
  const handleZoomOut = () => {
    smoothZoom(Math.max(scale / 1.2, 0.2));
  };

  const handleSave = () => {
    const uri = stageRef.current.toDataURL();
    const link = document.createElement('a');
    link.download = 'annotated-image.png';
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBrightnessChange = (event) => {
    setBrightness(event.target.value);
  };

  const cropImage = (cropRect) => {
    const stage = stageRef.current;
    const layer = stage.getLayers()[0];
    const image = layer.findOne('Image');
    const cropX = cropRect.x;
    const cropY = cropRect.y;
    const cropWidth = cropRect.width;
    const cropHeight = cropRect.height;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = cropWidth;
    croppedCanvas.height = cropHeight;
    const croppedCtx = croppedCanvas.getContext('2d');

    croppedCtx.drawImage(
      image.image(),
      cropX * scale,
      cropY * scale,
      cropWidth * scale,
      cropHeight * scale,
      0,
      0,
      cropWidth,
      cropHeight
    );

    const croppedImage = new Image();
    croppedImage.src = croppedCanvas.toDataURL();
    croppedImage.onload = () => {
      setLoadedImage(croppedImage);
      setImageDimensions({ width: cropWidth, height: cropHeight });
      setScale(1.2); // Slightly magnify the cropped image
    };
  };

  const iconButtons = [
    { onClick: () => setSelectedShape("circle"), icon: <FaCircle />, name: "Circle" },
    { onClick: () => setSelectedShape("rectangle"), icon: <FaSquare />, name: "Rectangle" },
    { onClick: () => setSelectedShape("line"), icon: <FaRulerCombined />, name: "Line" },
    { onClick: () => setSelectedShape("angle"), icon: <FaAngleDoubleRight />, name: "Angle" },
    { onClick: () => setSelectedShape("crop"), icon: <FaCrop />, name: "Crop" },
    { onClick: handleSave, icon: <FaSave />, name: "Save" },
    { onClick: onBack, icon: <FaArrowLeft />, name: "Back" },
    { onClick: handleZoomIn, icon: <FaSearchPlus />, name: "Zoom In" },
    { onClick: handleZoomOut, icon: <FaSearchMinus />, name: "Zoom Out" },
    { onClick: () => setAnnotations([]), icon: <FaTimes />, name: "Clear" },
  ];

  return (
    <div>
    <h2 style={{ color: "black", marginBottom: "20px", textAlign: "center",fontWeight:'400',marginLeft:'60px',marginTop:'60px' }}>
      Workspace for Annotating is below 
    </h2>
      <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        gap: "10px",
        backgroundColor: "black",
        padding: "10px",
        minHeight: "100vh",
        borderRadius:"20px",
        cursor: selectedShape ? 'crosshair' : 'default', // Change cursor based on selected shape
        
      }}
    >
      <div
        style={{
          
          position: "relative",
          width: imageDimensions.width * scale,
          height: imageDimensions.height * scale,
          border: "1px solid black",
          borderRadius: "15px", // Add rounded border
          overflow: "hidden",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transition: "transform 0.5s ease-in-out", // Add transition for smooth zoom effect
          
        }}
      >
        <Stage
          ref={stageRef}
          width={imageDimensions.width * scale}
          height={imageDimensions.height * scale}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          scaleX={scale}
          scaleY={scale}
        >
          <Layer>
            {loadedImage && (
              <KonvaImage
                image={loadedImage}
                width={imageDimensions.width}
                height={imageDimensions.height}
                x={0}
                y={0}
                ref={imageRef}
              />
            )}
            {annotations.map((annotation, i) => (
              <React.Fragment key={i}>
                {annotation.shape === "rectangle" && (
                  <>
                    <Rect
                      x={annotation.x}
                      y={annotation.y}
                      width={annotation.width}
                      height={annotation.height}
                      stroke="green"
                      strokeWidth={2}
                    />
                    <Text
                      x={annotation.x}
                      y={annotation.y - 15}
                      text={annotation.text}
                      fontSize={5}
                      fill={annotation.color}
                    />
                  </>
                )}
                {annotation.shape === "circle" && (
                  <>
                    <Circle
                      x={annotation.x}
                      y={annotation.y}
                      radius={annotation.width / 2}
                      stroke="blue"
                      strokeWidth={1}
                    />
                    <Text
                      x={annotation.x - annotation.width / 2}
                      y={annotation.y - annotation.width / 2 - 15}
                      text={annotation.text}
                      fontSize={5}
                      fill={annotation.color}
                    />
                  </>
                )}
                {annotation.shape === "line" && (
                  <>
                    <Line points={annotation.points} stroke="cyan" strokeWidth={1} />
                    <Text
                      x={(annotation.points[0] + annotation.points[2]) / 2}
                      y={(annotation.points[1] + annotation.points[3]) / 2}
                      text={annotation.text}
                      fontSize={5}
                      fill="yellow"
                      rotation={Math.atan2(annotation.points[3] - annotation.points[1], annotation.points[2] - annotation.points[0]) * 180 / Math.PI}
                    />
                  </>
                )}
                {annotation.shape === "angle" && (
                  <>
                    <Line points={annotation.points.slice(0, 4)} stroke="purple" strokeWidth={1} />
                    <Line points={annotation.points.slice(2)} stroke="cyan" strokeWidth={1} />
                    <Text
                      x={(annotation.points[0] + annotation.points[4]) / 2}
                      y={(annotation.points[1] + annotation.points[5]) / 2}
                      text={annotation.text}
                      fontSize={5}
                      fill="yellow"
                    />
                  </>
                )}
              </React.Fragment>
            ))}
            {newAnnotation && selectedShape === "rectangle" && (
              <Rect
                x={newAnnotation.x}
                y={newAnnotation.y}
                width={newAnnotation.width}
                height={newAnnotation.height}
                stroke="red"
                strokeWidth={1}
              />
            )}
            {newAnnotation && selectedShape === "circle" && (
              <Circle
                x={newAnnotation.x}
                y={newAnnotation.y}
                radius={newAnnotation.width / 2}
                stroke="red"
                strokeWidth={1}
              />
            )}
            {newAnnotation && selectedShape === "line" && (
              <Line points={newAnnotation.points} stroke="red" strokeWidth={1} />
            )}
            {cropRect && (
              <Rect
                x={cropRect.x}
                y={cropRect.y}
                width={cropRect.width}
                height={cropRect.height}
                stroke="red"
                strokeWidth={1}
              />
            )}
            {anglePoints.length > 0 && anglePoints.map((point, i) => (
              <Circle key={i} x={point.x} y={point.y} radius={3} fill="red" />
            ))}
          </Layer>
        </Stage>
      </div>

      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {iconButtons.map(({ onClick, icon, name }, idx) => (
          <div key={idx} style={{ position: "relative" }}>
            <button
              onClick={onClick}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                backgroundColor: "black",
                color: "white",
                border: "none",
                cursor: "pointer",
                margin: "1px 0",
                transition: "background-color 1s, border 1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.border = "1px solid black";
                e.currentTarget.style.color = "black";
                setHoveredIcon(name);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.border = "none";
                e.currentTarget.style.color = "white";
                setHoveredIcon(null);
              }}
            >
              {icon}
            </button>
            {hoveredIcon === name && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-100px",
                  transform: "translateY(-50%)",
                  color: "white",
                  whiteSpace: "nowrap",
                  transition: "opacity 1s",
                }}
              >
                {name}
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <input
          type="range"
          min="0"
          max="2"
          step="0.01"
          value={brightness}
          onChange={handleBrightnessChange}
          style={{ width: "200px", transform: "rotate(-90deg)" }}
        />
      </div>
    </div>

    </div>
    
  );
};

export default ImageAnnotator;
