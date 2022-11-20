import FileT from "./FileT";
import {MutableRefObject} from "react";
import ReactPlayer from "react-player";

export enum playState {
    play = 1,
    pause = 0
}

class PlayerParam {
    playerRef: MutableRefObject<ReactPlayer>
    videoFile: FileT;
    onProgress: (time: number) => void;
    onPlayingStateChange: (state: playState) => void;
    onTotalTimeChange:(time:number)=>void;
}

export default PlayerParam;