import {create} from 'zustand';
import {Shape} from "../type/Shape.ts";

interface ShapeState {
    shapes: Shape[];
    addShape: (shape: Shape) => void;
    updateShapes: (shapes: Shape[]) => void;
    isPainting?: boolean;
    updateIsPainting: (isPaining: boolean) => void;
    selectedShapeTool?: string;
    setSelectedShapeTool: (tool: string) => void;
    history: string[];
    currentIdx: -1;
    undo: () => void;
    redo: () => void;
}

export const useShapeStore = create<ShapeState>((set, get) => ({

    shapes: [],

    history: [],

    selectedShapeTool: '',

    currentIdx: -1,

    setSelectedShapeTool: (toolName) => set({selectedShapeTool: toolName}),

    addShape: (newShape) => {
        const existingShapes = get().shapes;
        set({
            shapes: [...existingShapes, newShape],
        });
    },
    updateShapes: (shapes) => {
        set({shapes});
    },

    isPainting: false,

    updateIsPainting: (bool) => {
        set({isPainting: bool});
    },

    updateHistory: () => {
        const history = get().history;
        const shapes = get().shapes;
        const currentIdx = get().currentIdx;
        const newIdx = currentIdx + 1;
        const newHistory = [...history.slice(0, newIdx), JSON.stringify(shapes)];
        set({
            history: newHistory,
            currentIdx: newIdx
        });
    },

    undo: () => {
        const history = get().history;
        const currentIdx = get().currentIdx;
        if (currentIdx > 0) {
            const newIdx = currentIdx - 1;
            set({
                shapes: JSON.parse(history[newIdx]),
                currentIdx: newIdx
            });
        }
    },

    redo: () => {
        const history = get().history;
        const currentIdx = get().currentIdx;
        if (currentIdx < history.length - 1) {
            const newIdx = currentIdx + 1;
            set({
                shapes: JSON.parse(history[newIdx]),
                currentIdx: newIdx
            });
        }
    }
}));
