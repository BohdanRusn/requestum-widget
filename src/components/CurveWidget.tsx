import React from "react";
import { Image as KonvaImage, Layer, Stage } from "react-konva";
import CurvedLine from "./CurvedLine";

interface LineData {
    points: number[][];
    selectedPoint: number | null;
}

const CurveWidget: React.FC = () => {
    const stageRef = React.useRef<any>(null);
    const [image, setImage] = React.useState<HTMLImageElement | null>(null);
    const [lines, setLines] = React.useState<LineData[]>([]);

    React.useEffect(() => {
        const img = new Image();
        img.onload = () => {
            setImage(img);
        };
        img.src = "img.png";
    }, [lines])

    const handleStageClick = (e: any) => {
        const {offsetX, offsetY} = e.evt;
        const newLines = [...lines];
        const lastLine = newLines[newLines.length - 1];

        if (!lastLine || lastLine.points.length === 0) {
            newLines.push({points: [[offsetX, offsetY]], selectedPoint: null});
        } else if (lastLine.points.length === 1) {
            lastLine.points.push([offsetX, offsetY]);
        } else {
            newLines.push({points: [[offsetX, offsetY]], selectedPoint: null});
        }

        setLines(newLines);
    };

    React.useEffect(() => {
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.points.length === 2) {
                const midPoint = generateMidPoint(line.points[0], line.points[1]);
                line.points.splice(1, 0, midPoint);
            }
        }
    }, [lines]);

    const generateMidPoint = (startPoint: number[], endPoint: number[]) => {
        const midPointX = (startPoint[0] + endPoint[0]) / 2;
        const midPointY = (startPoint[1] + endPoint[1]) / 2;
        return [midPointX, midPointY];
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
                        <CurvedLine
                            key={ lineIndex }
                            lineIndex={ lineIndex }
                            line={ line }
                            setLines={ setLines }
                            lines={ lines }

                        />
                    )) }
                </Layer>
            </Stage>
        </div>
    );
};

export default CurveWidget;
