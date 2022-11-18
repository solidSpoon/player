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
import BorderProgressBar from "../components/BorderProgressBar";
import PlayTime from "../components/PlayTime";
import FileT from "../lib/FileT";
import UploadPhotoParam from "../lib/UploadPhotoParam";
import RecordProgress from '../lib/RecordProgress';

export default function Home() {
    const playerRef = useRef<ReactPlayer>()
    const currentTimeState = useState(0);
    const currentSubtleState = useState<SentenceT>();
    const videoFileState = useState<FileT>();
    const [videoFile] = videoFileState;
    const playingState = useState<boolean>(true);
    const srcState = useState<FileT>();
    const [srcFile] = srcState;
    const subtitleState = useState<SentenceT[]>([]);
    const [subtitles, setSubtitles] = subtitleState;
    const totalTmeState = useState<number>();
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
                    totalTmeState={totalTmeState}
                />;
            const container = document.getElementById("player-id");
            const root = createRoot(container); // createRoot(container!) if you use TypeScript
            root.render(newEle);
        }
    }, [videoFile])


    useEffect(() => {
        if (srcFile !== undefined) {

            axios
                .get(srcFile.objectUrl)
                .then(function (response) {
                    updateSubtitle(response.data, srcFile)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [srcFile]);

    const updateSubtitle = (str: string, fileUrl: FileT): void => {
        const srtSubtitles = parseSrtSubtitles(str);
        srtSubtitles.forEach(item => item.fileUrl = fileUrl.objectUrl)
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
    RecordProgress(currentTimeState, videoFileState);
    const uploadPhotoParams = new UploadPhotoParam();
    uploadPhotoParams.videoFileState = videoFileState;
    uploadPhotoParams.srcFileState = srcState;
    return (
        <>
            <Keyevent
                className="TopSide"
                events={keyListener.getObj()}
                needFocusing={true}
            >
                <div className='container'
                     onKeyDown={event => {
                         console.log(event.key)
                     }}
                >
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
                    <div className={'menu'}>
                        <PlayTime currentTimeState={currentTimeState} totalTimeState={totalTmeState}/>
                    </div>
                    <div className='underline-subtitle'>
                        <MainSubtitle currentSubtleState={currentSubtleState}/>
                        <UploadPhoto {...uploadPhotoParams}/>
                    </div>
                </div>
                <BorderProgressBar currentTimeState={currentTimeState} totalTimeState={totalTmeState}/>
            </Keyevent>
        </>
    )
}
