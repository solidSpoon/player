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

export default function Home() {
    const playerRef = useRef(null)
    const currentTimeState = useState(0);
    const currentSubtleState = useState<SentenceT>();
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    const videoFileState = useState<string>();
    const [videoFile, setVideoFile] = videoFileState;
    const playingState = useState<boolean>(true);
    const [playing, setPlaying] = playingState;
    const srcState = useState<string>();
    const [srcUrl, setSrcUrl] = srcState;
    const subtitleState = useState<SentenceT[]>([]);
    const [subtitles, setSubtitles] = subtitleState;

    const pushTimeState = useState<number>(Date.now);
    const [time, setTime] = pushTimeState;
    const jumpTextState = useState<SentenceT>();
    const [text, setText] = jumpTextState;
    const jumpTimeState = useState<number>();
    const [jumpTime, setJumpTime] = jumpTimeState;

    const onLeft = () => {
        onA();
    }
    const onA = () => {
        if (currentSubtitle === undefined) {
            return;
        }
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        const prev = current.prevItem ? current.prevItem : current;
        setTime(Date.now);
        setText(prev);
        setJumpTime(prev.timeStart);
        playerRef.current.seekTo(prev.timeStart, 'seconds');

    }
    const onRight = () => {
        onD()
    }
    const onD = () => {
        if (currentSubtitle === undefined) {
            return;
        }
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        const next = current.nextItem ? current.nextItem : current;
        setTime(Date.now);
        setText(next);
        setJumpTime(next.timeStart);
        playerRef.current.seekTo(next.timeStart, 'seconds');
    }
    const onDown = () => {
        onS();
    }
    const onS = () => {
        if (currentSubtitle === undefined) {
            return;
        }
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        setTime(Date.now)
        setJumpTime(current.timeStart)
        playerRef.current.seekTo(current.timeStart, 'seconds');
    }
    const onW = () => {
        onSpace();
    }
    const onUp = () => {
        onSpace();
    }
    const onSpace = () => {
        const htmlVideoElement = document.querySelector('video');
        if (htmlVideoElement === null) {
            return;
        }
        if (playing) {
            htmlVideoElement.pause();
        } else {
            htmlVideoElement.play();
        }
    }
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
                // id={Date.now()}
                pushTimeState={pushTimeState}
                jumpTimeState={jumpTimeState}
                jumpTextState={jumpTextState}
            />
        root.render(newEle);
    }, [subtitles]);
    // @ts-ignore
    return (
        <Keyevent
            className="TopSide"
            events={{
                onA, onD, onS, onLeft, onRight, onDown, onSpace, onUp, onW
            }}
            needFocusing={true}
        >
            <div className='container'>
                <div className='player' id={"player-id"}>
                    <Player
                        playerRef={playerRef}
                        currentTimeState={currentTimeState}
                        videoFile={videoFile}
                        playingState={playingState}
                    />
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
                    {/*todo*/}
                    {/*@ts-ignore*/}
                    <UploadPhoto fileState={videoFileState} srcState={srcState}/>
                </div>
            </div>
        </Keyevent>
    )
}
