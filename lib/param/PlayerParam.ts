import FileT from "./FileT";
import {MutableRefObject} from "react";
import ReactPlayer from "react-player";

class PlayerParam {
    playerRef: MutableRefObject<ReactPlayer>
    currentTimeState: [number, React.Dispatch<React.SetStateAction<number>>];
    videoFile: FileT;
    playingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
    totalTmeState: [number, React.Dispatch<React.SetStateAction<number>>];
}
export default PlayerParam;