import ReactPlayer from 'react-player'
import React, {useEffect, useRef, useState} from 'react'
import style from './Player.module.css'


const Player = ({playerRef, currentTimeState}) => {
    const [player, setPlayer] = useState()
    const [currentTime, setCurrentTime] = currentTimeState;
    let reactPlayer = <>
        <ReactPlayer
            ref={playerRef}
            url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
            className={"react-player" + style.player}
            playing
            controls
            width="100%"
            height="100%"
            onProgress={(progress) => {
                setCurrentTime(progress.playedSeconds);
            }}
        />
    </>;

    useEffect(() => setPlayer(reactPlayer), [])
    return (
        <>
            {player}
        </>
    )

}
export default Player