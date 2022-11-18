import ReactPlayer from 'react-player'
import React from 'react'
import style from './Player.module.css'
import PlayerParam from "../lib/param/PlayerParam";
import axios from "axios";

const Player = (param: PlayerParam) => {
    const [, setCurrentTime] = param.currentTimeState;
    const [, setPlaying] = param.playingState
    const [, setTotalTime] = param.totalTmeState
    const videoFile = param.videoFile;
    const [isReady, setIsReady] = React.useState(false);
    const onReady = React.useCallback(() => {
        if (isReady) {
            return;
        }
        axios.get('/api/queryProgress', {
            params:
                {
                    fileName: videoFile.fileName
                }
        }).then((response)=>{
            console.log(response);
            param.playerRef.current.seekTo(response.data.progress, "seconds");
        });
        setIsReady(true);
    }, [isReady]);

    return (

        <>
            <ReactPlayer
                id="react-player-id"
                ref={param.playerRef}
                url={videoFile.objectUrl ? videoFile.objectUrl : ""}
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
                onReady={onReady}
            />
        </>

    )

}
export default Player