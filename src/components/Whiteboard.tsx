import WhiteboardNav from "./WhiteboardNav.tsx";
import WhiteboardCanvas from "./WhiteboardCanvas.tsx";

const Whiteboard = () => {
    return (
        <div className="whiteboard-layout">
            <WhiteboardNav/>
            <WhiteboardCanvas/>
        </div>
    );
}

export default Whiteboard;