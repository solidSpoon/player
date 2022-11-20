import ReactPlayer from 'react-player'
import React from 'react'
import style from './Player.module.css'
import PlayerParam, {playState} from "../lib/param/PlayerParam";
import axios from "axios";

const Player = (param: PlayerParam) => {
    let isReady = false;
    const onReady = () => {
        if (isReady) {
            return;
        }
        console.log('isready')
        axios.get('/api/queryProgress', {
            params:
                {
                    fileName: param.videoFile.fileName
                }
        }).then((response) => {
            console.log(response);
            param.playerRef.current.seekTo(response.data.progress, "seconds");
        });
        isReady = true;
    };

    return (
        <ReactPlayer
            id="react-player-id"
            ref={param.playerRef}
            url={param.videoFile.objectUrl ? param.videoFile.objectUrl : ""}
            className={"react-player" + style.player}
            playing={true}
            controls={false}
            width="100%"
            height="100%"
            progressInterval={50}
            onProgress={(progress) => {
                param.onProgress(progress.playedSeconds);
            }}
            onDuration={duration => {
               param.onTotalTimeChange(duration)
            }}
            onPlay={() => param.onPlayingStateChange(playState.play)}
            onPause={() => param.onPlayingStateChange(playState.pause)}
            onReady={onReady}
        />

    )

}
export default Player