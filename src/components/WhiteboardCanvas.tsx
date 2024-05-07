import {useEffect, useRef} from "react";
import {Layer, Rect, Stage} from "react-konva";
import socket from "../Socket.ts";
import {useKonvaEvents} from "../hooks/useKonvaEvents.ts";
import {useShapeStore} from "../stores/shapeStore.ts";

const width = window.innerWidth;
const height = window.innerHeight;

const WhiteboardCanvas = () => {

    const stageRef = useRef(null);

    const {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onDragMove,
        onDragEnd
    } = useKonvaEvents();

    const {
        shapes,
        updateShapes,
        selectedShapeTool,
    } = useShapeStore(state => state);

    const isPaining = useShapeStore(state => state.isPainting);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.on('update_shapes', (shapes) => {
            console.log('received shapes', shapes);
            updateShapes(shapes);
        });

    }, [socket]);

    useEffect(() => {
        const stage = stageRef.current;
        if (selectedShapeTool !== '') {
            stage.container().style.cursor = 'crosshair';
        } else {
            stage.container().style.cursor = 'default';
        }
    }, [stageRef, selectedShapeTool]);


    return (
        <div className="whiteboard-canvas">
            <Stage
                ref={stageRef}
                width={width}
                height={height}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                listening={!isPaining}
            >
                <Layer>
                    {
                        shapes.map((shape, index) => (
                            <Rect
                                key={index}
                                x={shape.x}
                                y={shape.y}
                                width={shape.width}
                                height={shape.height}
                                fill="red"
                                draggable
                                onDragMove={(e) => onDragMove(e, shape.id)}
                                onDragEnd={(e) => onDragEnd(e, shape.id)}
                                shadowBlur={10}
                            />
                        ))
                    }
                </Layer>
            </Stage>
        </div>
    )
}

export default WhiteboardCanvas;