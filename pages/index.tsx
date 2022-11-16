import React, {useEffect, useRef, useState} from 'react'
import Player from "../components/Player";
import Subtitle from "../components/Subtitle";
import MainSubtitle from "../components/MainSubt";
import Keyevent from "react-keyevent";
import UploadPhoto from "../components/UplodeButton";
import {createRoot} from 'react-dom/client';
import parseSrtSubtitles from "../lib/parseSrt";
import axios from "axios";
import TransFiller from "../lib/TransFiller";
import SentenceT from "../lib/SentenceT";
import ReactPlayer from "react-player";
import KeyListener from "../lib/KeyListener";

export default function Home() {
    const playerRef = useRef<ReactPlayer>()
    const currentTimeState = useState(0);
    const currentSubtleState = useState<SentenceT>();
    const videoFileState = useState<string>();
    const [videoFile] = videoFileState;
    const playingState = useState<boolean>(true);
    const srcState = useState<string>();
    const [srcUrl] = srcState;
    const subtitleState = useState<SentenceT[]>([]);
    const [subtitles, setSubtitles] = subtitleState;

    const pushTimeState = useState<number>(Date.now);
    const jumpTextState = useState<SentenceT>();
    const jumpTimeState = useState<number>();
    useEffect(() => {
        if (videoFile !== undefined) {
            const newEle =
                <Player
                    playerRef={playerRef}
                    currentTimeState={currentTimeState}
                    videoFile={videoFile}
                    playingState={playingState}
                />;
            const container = document.getElementById("player-id");
            const root = createRoot(container); // createRoot(container!) if you use TypeScript
            root.render(newEle);
        }
    }, [videoFile])


    useEffect(() => {
        if (srcUrl !== undefined) {

            axios
                .get(srcUrl)
                .then(function (response) {
                    updateSubtitle(response.data, srcUrl)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [srcUrl]);

    const updateSubtitle = (str: string, fileUrl: string): void => {
        const srtSubtitles = parseSrtSubtitles(str);
        srtSubtitles.forEach(item => item.fileUrl = fileUrl)
        new TransFiller(srtSubtitles).fillTranslate();
        setSubtitles(srtSubtitles);
    };

    const [subtitleRoot, setSubtitleRoot] = useState(null);
    const keyListener = new KeyListener(
        currentSubtleState,
        pushTimeState,
        jumpTextState,
        jumpTimeState,
        playerRef,
        playingState
    );
    useEffect(() => {
        if (subtitles === undefined) {
            return;
        }
        let root = subtitleRoot;
        if (root === null) {
            const container = document.getElementById("subtitle-id");
            root = createRoot(container);
            setSubtitleRoot(root);
        }
        const newEle =
            <Subtitle
                playerRef={playerRef}
                subtitlesState={subtitleState}
                currentTimeState={currentTimeState}
                currentSubtleState={currentSubtleState}
                pushTimeState={pushTimeState}
                jumpTimeState={jumpTimeState}
                jumpTextState={jumpTextState}
            />
        root.render(newEle);
    }, [subtitles]);

    const uploadPhotoParams = {
        fileState: videoFileState,
        srcState: srcState
    }
    return (
        <Keyevent
            className="TopSide"
            events={keyListener.getObj()}
            needFocusing={true}
        >
            <div className='container'>
                <div className='player' id={"player-id"}>
                    {/*<Player*/}
                    {/*    playerRef={playerRef}*/}
                    {/*    currentTimeState={currentTimeState}*/}
                    {/*    videoFile={videoFile}*/}
                    {/*    playingState={playingState}*/}
                    {/*/>*/}
                </div>
                <div className='subtitle' id={"subtitle-id"}>
                    <Subtitle
                        playerRef={playerRef}
                        subtitlesState={subtitleState}
                        currentTimeState={currentTimeState}
                        currentSubtleState={currentSubtleState}
                        jumpTimeState={jumpTimeState}
                        pushTimeState={pushTimeState}
                        jumpTextState={jumpTextState}
                    />
                </div>
                <div className='underline-subtitle'>
                    <MainSubtitle currentSubtleState={currentSubtleState}/>
                    <UploadPhoto {...uploadPhotoParams}/>
                </div>
            </div>
        </Keyevent>
    )
}
