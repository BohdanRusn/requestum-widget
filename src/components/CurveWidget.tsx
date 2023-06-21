import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Circle, Image as KonvaImage, Layer, Line, Stage } from 'react-konva';
import { KonvaEventObject } from "konva/lib/Node";

interface LineData {
  points: number[][];
  selectedPoint: number | null;
}

const CurveWidget: React.FC = () => {
  const stageRef = useRef<any>(null);
  const [ image, setImage ] = useState<HTMLImageElement | null>(null);
  const [ lines, setLines ] = useState<LineData[]>([]);

  const img = new Image();
  img.onload = () => {
    setImage(img);
  };
  img.src = "img.png";


  const handleStageClick = (e: any) => {
    const { offsetX, offsetY } = e.evt;
    const newLines = [ ...lines ];
    const lastLine = newLines[newLines.length - 1];

    if ( !lastLine || lastLine.points.length === 0 ) {
      newLines.push({ points: [ [ offsetX, offsetY ] ], selectedPoint: null });
    } else if ( lastLine.points.length === 1 ) {
      lastLine.points.push([ offsetX, offsetY ]);
    } else {
      newLines.push({ points: [ [ offsetX, offsetY ] ], selectedPoint: null });
    }

    setLines(newLines);
  };

  const handlePointDragStart = (lineIndex: number, pointIndex: number) => {
    const newLines = [ ...lines ];
    newLines[lineIndex].selectedPoint = pointIndex;
    setLines(newLines);
  };

  const handlePointDragMove = (lineIndex: number, pointIndex: number, e:  KonvaEventObject<DragEvent>) => {
    const { offsetX, offsetY } = e.evt;
    const newLines = [ ...lines ];
    newLines[lineIndex].points[pointIndex] = [ offsetX, offsetY ];
    setLines(newLines);
  };

  const handlePointDragEnd = (lineIndex: number) => {
    const newLines = [ ...lines ];
    newLines[lineIndex].selectedPoint = null;
    setLines(newLines);
  };

  const newLineAdd = useCallback(() => {
      const newLines = [ ...lines ];
      for ( let i = 0; i < newLines.length; i++ ) {
        const line = newLines[i];
        if ( line.points.length === 2 ) {
          const midPoint = generateMidPoint(line.points[0], line.points[1]);
          line.points.splice(1, 0, midPoint);
        }
      }
      setLines(newLines);
    }
    , [ lines ])

  useEffect(() => {
    newLineAdd()
  }, [ lines ]);

  const generateMidPoint = (startPoint: number[], endPoint: number[]) => {
    const midPointX = (startPoint[0] + endPoint[0]) / 2;
    const midPointY = (startPoint[1] + endPoint[1]) / 2;
    return [ midPointX, midPointY ];
  };

  return (
    <div>
      <Stage width={ 800 } height={ 600 } ref={ stageRef } onClick={ handleStageClick }>
        <Layer>
          { image && (
            <KonvaImage
              image={ image }
              width={ 800 }
              height={ 600 }
            />
          ) }

          { lines.map((line, lineIndex) => (
            <React.Fragment key={ lineIndex }>
              <Line
                points={ line.points.flat() }
                stroke="red"
                strokeWidth={ 2 }
              />
              { line.points.map((point, pointIndex) => (
                <Circle
                  key={ pointIndex }
                  x={ point[0] }
                  y={ point[1] }
                  radius={ 6 }
                  fill={ pointIndex === line.selectedPoint ? 'green' : 'blue' }
                  draggable
                  onDragStart={ () => handlePointDragStart(lineIndex, pointIndex) }
                  onDragMove={ (e) => handlePointDragMove(lineIndex, pointIndex, e) }
                  onDragEnd={ () => handlePointDragEnd(lineIndex) }
                />
              )) }
            </React.Fragment>
          )) }
        </Layer>
      </Stage>
    </div>
  );
};

export default CurveWidget;
