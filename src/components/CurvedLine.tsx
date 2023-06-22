import React from "react";
import { Circle, Line } from "react-konva";
import { KonvaEventObject } from "konva/lib/Node";

function CurvedLine({setLines, lineIndex, line, lines}: any) {
    const handlePointDragStart = (lineIndex: number, pointIndex: number) => {
        const newLines = [...lines];
        newLines[lineIndex].selectedPoint = pointIndex;
        setLines(newLines);
    };
    const handlePointDragMove = (lineIndex: number, pointIndex: number, e: KonvaEventObject<DragEvent>) => {
        const {offsetX, offsetY} = e.evt;
        const newLines = [...lines];
        newLines[lineIndex].points[pointIndex] = [offsetX, offsetY];
        setLines(newLines);
    };
    const handlePointDragEnd = (lineIndex: number) => {
        const newLines = [...lines];
        newLines[lineIndex].selectedPoint = null;
        setLines(newLines);
    };

    return (
        <>
            <Line
                points={ line.points.flat() }
                stroke="red"
                imageSmoothingEnabled
                strokeWidth={ 2 }
            />
            { line.points.map((point: number[], pointIndex: number) => (
                <Circle
                    key={ pointIndex }
                    x={ point[0] }
                    y={ point[1] }
                    radius={ 6 }
                    fill={ pointIndex === line.selectedPoint ? "green" : "blue" }
                    draggable
                    onDragStart={ () => handlePointDragStart(lineIndex, pointIndex) }
                    onDragMove={ (e) => handlePointDragMove(lineIndex, pointIndex, e) }
                    onDragEnd={ () => handlePointDragEnd(lineIndex) }
                />
            )) }
        </>
    );
}

export default CurvedLine;
