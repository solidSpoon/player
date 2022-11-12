import React, {useEffect, useRef, useState} from 'react'
import Player from "../components/Player";
import Subtitle from "../components/Subtitle";
import MainSubtitle from "../components/MainSubt";
import Keyevent from "react-keyevent";

export default function Home() {
    const textInput = useRef(null)
    const currentTimeState = useState(0);
    const currentSubtleState = useState();
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    const subtitles = [];
    for (let i = 0; i < 200; i++) {
        subtitles[i] = {
            key: i,
            timeStart: i,
            timeEnd: (i + 1),
            text: "hello world " + i
        }
    }
    let tc;
    let time = Date.now();
    // useEffect(() => tc = currentSubtitle, [currentSubtitle])
    const onA = () => {
        textInput.current.seekTo(currentSubtitle.prev.timeStart);

    }
    const onD = () => {
        textInput.current.seekTo(currentSubtitle.next.timeStart);
    }
    return (
        <Keyevent
            className="TopSide"
            events={{
                onA, onD,
            }}
            needFocusing={false}
        >
            <div className='container'>
                <div className='player'>
                    <Player
                        playerRef={textInput}
                        currentTimeState={currentTimeState}/>
                </div>
                <div className='subtitle'>
                    <Subtitle
                        playerRef={textInput}
                        subtitles={subtitles}
                        currentTimeState={currentTimeState}
                        currentSubtleState={currentSubtleState}/>
                </div>
                <div className='underline-subtitle'>
                    <MainSubtitle currentSubtleState={currentSubtleState}/>
                </div>
            </div>
        </Keyevent>
    )
}
