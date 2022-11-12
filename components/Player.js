import ReactPlayer from 'react-player'
import React, {useEffect, useRef, useState} from 'react'
import style from './Player.module.css'


const Player = ({playerRef, currentTimeState, videoFile}) => {
    const [player, setPlayer] = useState()
    const [currentTime, setCurrentTime] = currentTimeState;
    let reactPlayer = <>
        <ReactPlayer
            ref={playerRef}
            url={videoFile? videoFile:""}
            className={"react-player" + style.player}
            playing
            controls
            width="100%"
            height="100%"
            onProgress={(progress) => {
                setCurrentTime(progress.playedSeconds.toFixed(3));
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