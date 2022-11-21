import ReactPlayer from 'react-player'
import React, {Component} from 'react'
import style from './Player.module.css'
import axios from "axios";
import FileT from "../lib/param/FileT";

interface PlayerParam {
    videoFile: FileT;
    onProgress: (time: number) => void;
    onPlayingStateChange: (state: playState) => void;
    onTotalTimeChange: (time: number) => void;
}

export enum playState {
    play = 1,
    pause = 0
}

interface PlayerState {

}

export default class Player extends Component<PlayerParam, PlayerState> {
    private readonly playerRef: React.MutableRefObject<ReactPlayer | undefined>;

    constructor(props) {
        super(props);
        this.playerRef = React.createRef<ReactPlayer>();
    }

    getPlayer = () => {
        return this.playerRef.current;
    }

    public seekTo(time: number) {
        const player = this.getPlayer();
        if (player === undefined) {
            console.log('player undefined, cannot seekTo')
        }
        if (time === undefined) {
            console.log('time undefined, cannot seekTo')
        }
        console.log('seek time>>> ', time)
        player.seekTo(time, "seconds");
    }

    private lastFile: FileT;
    private onReady = (file: FileT) => {
        console.log('onready', file.fileName)
        if (file === this.lastFile) {
            return;
        }
        console.log('isready')
        axios.get('/api/queryProgress', {
            params:
                {
                    fileName: this.props.videoFile.fileName
                }
        }).then((response) => {
            this.seekTo(response.data.progress);
        });
        this.lastFile = file;
    };

    render() {
        if (this.props.videoFile === undefined) {
            return;
        }
        return (
            <ReactPlayer
                id="react-player-id"
                ref={this.playerRef}
                url={this.props.videoFile.objectUrl ? this.props.videoFile.objectUrl : ""}
                className={"react-player" + style.player}
                playing={true}
                controls={false}
                width="100%"
                height="100%"
                progressInterval={50}
                onProgress={(progress) => {
                    this.props.onProgress(progress.playedSeconds);
                }}
                onDuration={duration => {
                    this.props.onTotalTimeChange(duration)
                }}
                onPlay={() => this.props.onPlayingStateChange(playState.play)}
                onPause={() => this.props.onPlayingStateChange(playState.pause)}
                onReady={() => this.onReady(this.props.videoFile)}
            />
        )
    }
}