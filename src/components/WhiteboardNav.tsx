import {useShapeStore} from "../stores/shapeStore.ts";

const WhiteboardNav = () => {
    const {setSelectedShapeTool, undo, redo} = useShapeStore(state => state);
    return (
        <div className="whiteboard-nav">
            <div className="whiteboard-nav-items">
                <button className="whiteboard-nav-btn" onClick={undo}>Undo</button>
                <button className="whiteboard-nav-btn" onClick={redo}>Redo</button>
                <button className="whiteboard-nav-btn">Clear</button>

                <button className="whiteboard-nav-btn" onClick={() => setSelectedShapeTool('rect')}>Add Rect
                </button>
            </div>
        </div>
    );
};
export default WhiteboardNav;