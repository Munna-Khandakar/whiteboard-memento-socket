import Konva from "konva";
import {useRef} from "react";
import {Layer, Rect, Stage} from "react-konva";
import {v4 as uuidv4} from "uuid";
import {useShapeStore} from "../stores/shapeStore.ts";
import {Shape} from "../type/Shape.ts";

const WhiteboardCanvas = () => {

    const stageRef = useRef(null);
    const currentShapeId = useRef();

    const {
        shapes,
        addShape,
        updateShapes,
        selectedShapeTool,
        setSelectedShapeTool,
        updateHistory
    } = useShapeStore(state => state);

    const isPaining = useShapeStore(state => state.isPainting);

    const updateIsPainting = useShapeStore(state => state.updateIsPainting);

    const updateShapePosition = (id: string) => {

        const updatedPosition: Shape[] = shapes.map((rectangle) => {
            if (rectangle.id === id) {
                return {
                    ...rectangle,
                    x: rectangle.x,
                    y: rectangle.y,
                };
            }
            return rectangle;
        });

        updateShapes(updatedPosition)
    }

    const onPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (selectedShapeTool == '') return;

        updateIsPainting(true)

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();
        const id = uuidv4();

        currentShapeId.current = id;

        const newShape = {
            id,
            x,
            y,
            fill: '#444',
            draggable: true,
            rotation: 0,
            width: 0,
            height: 0,
            type: 'rect',
        }

        addShape(newShape)
    }

    const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {

        if (!isPaining) return;

        const stage = stageRef.current;
        const {x, y} = stage.getPointerPosition();

        const updatedShapes: Shape[] = shapes.map((rectangle) => {
            if (rectangle.id == currentShapeId.current) {
                return {
                    ...rectangle,
                    width: x - rectangle.x,
                    height: y - rectangle.y,
                };
            }
            return rectangle;
        });

        updateShapes(updatedShapes)
    }

    const onPointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
        updateHistory();
        setSelectedShapeTool('');
        updateIsPainting(false);
    }

    const onDragEnd = (shapeId: string) => {
        updateShapePosition(shapeId)
        updateHistory()
    }

    return (
        <div className="whiteboard-canvas">
            <Stage
                ref={stageRef}
                width={1000}
                height={800}
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
                                onDragEnd={() => onDragEnd(shape.id)}
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