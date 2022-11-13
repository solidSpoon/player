import React, {useEffect, useRef, useState} from 'react'
import Player from "../components/Player";
import Subtitle from "../components/Subtitle";
import MainSubtitle from "../components/MainSubt";
import Keyevent from "react-keyevent";
import UploadPhoto from "../components/UplodeButton";
import {createRoot} from 'react-dom/client';
import parseSrtSubtitles from "../lib/parseSrt";
import axios from "axios";

export default function Home() {
    const playerRef = useRef(null)
    const currentTimeState = useState(0);
    const currentSubtleState = useState();
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    const videoFileState = useState();
    const [videoFile, setVideoFile] = videoFileState;
    const playingState = useState(true);
    const [playing, setPlaying] = playingState;
    const srcState = useState();
    const [srcUrl, setSrcUrl] = srcState;

    const subtitleState = useState([]);
    const [subtitles, setSubtitles] = subtitleState;
    const [time, setTime] = useState(Date.now)
    const [text, setText] = useState()

    const onLeft = () => {
        onA()
    }
    const onA = () => {
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        const prev = current.prevItem ? current.prevItem : current;
        setTime(Date.now)
        setText(prev)
        playerRef.current.seekTo(prev.timeStart, 'seconds');

    }
    const onRight = () => {
        onD()
    }
    const onD = () => {
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        const next = current.nextItem ? current.nextItem : current;
        setTime(Date.now)
        setText(next)
        playerRef.current.seekTo(next.timeStart, 'seconds');
    }
    const onDown = () => {
        onS();
    }
    const onS = () => {
        const current = Date.now() - time > 1000 ? currentSubtitle : text;
        setTime(Date.now)
        playerRef.current.seekTo(current.timeStart, 'seconds');
    }
    const onW = () => {
        onSpace();
    }
    const onUp = () => {
        onSpace();
    }
    const onSpace = () => {
        if (playing) {
            document.querySelector('video').pause();
        } else {
            document.querySelector('video').play();
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
                    updateSubtitle(response.data)
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [srcUrl]);

    const updateSubtitle = (str) => {
        const srtSubtitles = parseSrtSubtitles(str);
        srtSubtitles.forEach((v) => {
            console.log(v);
        })
        setSubtitles(srtSubtitles)
    };

    useEffect(() => {
        const newEle =
            <Subtitle
                playerRef={playerRef}
                subtitlesState={subtitleState}
                currentTimeState={currentTimeState}
                currentSubtleState={currentSubtleState}
                id={Date.now()}
            />
        const container = document.getElementById("subtitle-id");
        const root = createRoot(container); // createRoot(container!) if you use TypeScript
        root.render(newEle);
    }, [subtitles]);
    return (
        <Keyevent
            className="TopSide"
            events={{
                onA, onD, onS, onLeft, onRight, onDown, onSpace, onUp, onW
            }}
            needFocusing={false}
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
                        currentSubtleState={currentSubtleState}/>
                </div>
                <div className='underline-subtitle'>
                    <MainSubtitle currentSubtleState={currentSubtleState}/>
                    <div className={'menu'}>
                        <UploadPhoto fileState={videoFileState} srcState={srcState}/>
                    </div>
                </div>
            </div>
        </Keyevent>
    )
}
