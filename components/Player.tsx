import ReactPlayer from 'react-player'
import React, {ReactElement, useEffect, useState} from 'react'
import style from './Player.module.css'


const Player = ({playerRef, currentTimeState, videoFile, playingState}) => {
    const [player, setPlayer] = useState<ReactElement>()
    const [, setCurrentTime] = currentTimeState;
    const [playing, setPlaying] = playingState
    let reactPlayer = <>
        <ReactPlayer
            id="react-player-id"
            ref={playerRef}
            url={videoFile ? videoFile : ""}
            className={"react-player" + style.player}
            playing={playing}
            controls={false}
            width="100%"
            height="100%"
            onProgress={(progress) => {
                setCurrentTime(progress.playedSeconds.toFixed(3));
            }}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
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