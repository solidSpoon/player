import ReactPlayer from 'react-player'
import React, {ReactElement, useEffect, useState} from 'react'
import style from './Player.module.css'


const Player = ({playerRef, currentTimeState, videoFile, playingState, totalTmeState}) => {
    const [, setCurrentTime] = currentTimeState;
    const [, setPlaying] = playingState
    const [, setTotalTime] = totalTmeState

    return (

            <>
                <ReactPlayer
                    id="react-player-id"
                    ref={playerRef}
                    url={videoFile ? videoFile : ""}
                    className={"react-player" + style.player}
                    playing={true}
                    controls={false}
                    width="100%"
                    height="100%"
                    progressInterval={50}
                    onProgress={(progress) => {
                        setCurrentTime(progress.playedSeconds);
                    }}
                    onDuration={duration => {
                        setTotalTime(duration);
                    }}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                />
            </>

    )

}
export default Player