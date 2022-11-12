import React, {useEffect, useRef, useState} from 'react'
import Player from "../components/Player";
import Subtitle from "../components/Subtitle";

export default function Home() {
    const textInput = useRef(null)
    const currentTimeState = useState(0);
    const subtitles = [];
    for (let i = 0; i < 200; i++) {
        subtitles[i] = {
            key: i,
            timeStart: i,
            timeEnd: (i + 1),
            text: "hello world " + i
        }
    }
    return (
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
                    currentTimeState={currentTimeState}/>
            </div>
            <div className='underline-subtitle'><p>3</p></div>
        </div>
    )
}
