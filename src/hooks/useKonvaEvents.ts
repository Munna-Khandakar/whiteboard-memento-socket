import {useRef} from "react";
import {Shape} from "../type/Shape.ts";
import {useShapeStore} from "../stores/shapeStore.ts";
import Konva from "konva";
import {v4 as uuidv4} from "uuid";
import socket from "../Socket.ts";

export const useKonvaEvents = () => {
    const currentShapeId = useRef();

    const {
        shapes,
        addShape,
        updateShapes,
        selectedShapeTool,
        setSelectedShapeTool,
        updateHistory,
        isPainting,
        updateIsPainting
    } = useShapeStore(state => state);

    const updateShapePosition = (positionX: number, positionY: number, id: string) => {
        const updatedPosition: Shape[] = shapes.map((rectangle) => {
            if (rectangle.id === id) {
                return {
                    ...rectangle,
                    x: positionX,
                    y: positionY,
                };
            }
            return rectangle;
        });

        updateShapes(updatedPosition)
    }

    const publishShapes = () => {
        console.log('publishing shapes')
        socket.emit('shapes', shapes)
    }

    const onPointerDown = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (selectedShapeTool == '') return;

        updateIsPainting(true)

        const stage = e.target.getStage();
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
        publishShapes();
    }

    const onPointerMove = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (!isPainting) return;

        const stage = e.target.getStage();

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
        publishShapes();
    }

    const onPointerUp = (e: Konva.KonvaEventObject<PointerEvent>) => {
        if (!isPainting) return;

        updateHistory();
        publishShapes();
        setSelectedShapeTool('');
        updateIsPainting(false);
    }

    const onDragMove = (e: Konva.KonvaEventObject<PointerEvent>, shapeId: string) => {
        const positionX = e.target.x();
        const positionY = e.target.y();
        updateShapePosition(positionX, positionY, shapeId);
        publishShapes();
    }

    const onDragEnd = (e: Konva.KonvaEventObject<PointerEvent>, shapeId: string) => {
        const positionX = e.target.x();
        const positionY = e.target.y();
        updateShapePosition(positionX, positionY, shapeId);
        updateHistory();
        publishShapes();
    }

    return {
        onPointerDown,
        onPointerMove,
        onPointerUp,
        onDragMove,
        onDragEnd
    }
}