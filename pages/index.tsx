import React, {Component, ReactElement, useEffect, useRef, useState} from 'react'
import Player from "../components/Player";
import Subtitle from "../components/Subtitle";
import UploadPhoto from "../components/UplodeButton";
import SentenceT from "../lib/param/SentenceT";
import BorderProgressBar from "../components/BorderProgressBar";
import FileT, {FileType} from "../lib/param/FileT";
import GlobalShortCut, {JumpPosition} from "../components/GlobalShortCut";
import MainSubtitle from "../components/MainSubtitle";
import PlayTime from "../components/PlayTime";
import RecordProgress from "../lib/RecordProgress";

interface HomeState {
    /**
     * 视频文件
     * @private
     */
    videoFile: FileT;
    /**
     * 字幕文件
     * @private
     */
    subtitleFile: FileT;

}

export default class Home extends Component<any, HomeState> {
    /**
     * 当前播放时间
     * @private
     */
    private progress: number;
    /**
     * 播放器引用
     * @private
     */
    private playerRef: React.RefObject<Player>;
    /**
     * 视频时长
     * @private
     */
    private totalTime: number;
    /**
     * 侧边字幕组件引用
     * @private
     */
    private subtitleRef: React.RefObject<Subtitle>;
    /**
     * 主字幕组件引用
     * @private
     */
    private mainSubtitleRef: React.RefObject<MainSubtitle>;


    constructor(props) {
        super(props);
        this.progress = 0;
        this.totalTime = 0;
        this.playerRef = React.createRef<Player>();
        this.subtitleRef = React.createRef<Subtitle>();
        this.mainSubtitleRef = React.createRef<MainSubtitle>();
        this.state = {
            videoFile: undefined,
            subtitleFile: undefined,
        }
    }

    private onFileChange = (file: FileT) => {
        if (FileType.VIDEO === file.fileType) {
            this.setState({
                videoFile: file
            })
        }
        if (FileType.SUBTITLE === file.fileType) {
            this.setState({
                subtitleFile: file
            })
        }
    }

    private seekTo = (time) => {
        this.playerRef.current.seekTo(time);
        this.playerRef.current.play();
    }

    private onSpace() {
        this.playerRef.current.change();
    }

    private onJumpTo(position: JumpPosition) {
        if (this.subtitleRef.current === undefined) {
            console.log("subtitleRef is empty, can not jump")
            return;
        }
        if (JumpPosition.BEFORE === position) {
            this.subtitleRef.current.jumpPrev();
        }
        if (JumpPosition.AFTER === position) {
            this.subtitleRef.current.jumpNext();
        }
        if (JumpPosition.CURRENT === position) {
            this.subtitleRef.current.repeat();
        }

    }

    private changeCurrentSentence(currentSentence: SentenceT) {
        if (this.mainSubtitleRef === undefined) {
            return;
        }
        this.mainSubtitleRef.current.setState({
            sentence: currentSentence
        })
    }

    render() {
        return (
            <>
                <GlobalShortCut
                    onJumpTo={(position) => this.onJumpTo(position)}
                    onSpace={() => this.onSpace()}>


                    <div className='container'
                         onKeyDown={event => {
                             console.log(event.key)
                         }}
                    >
                        <RecordProgress getCurrentProgress={() => this.progress}
                                        getCurrentVideoFile={() => this.state.videoFile}/>
                        <div className='player' id={"player-id"}>
                            <Player
                                ref={this.playerRef}
                                videoFile={this.state.videoFile}
                                onProgress={(time) => this.progress = time}
                                onTotalTimeChange={(time) => this.totalTime = time}
                            />
                        </div>
                        <div className='subtitle' id={"subtitle-id"}>
                            <Subtitle
                                ref={this.subtitleRef}
                                getCurrentTime={() => this.progress}
                                onCurrentSentenceChange={(currentSentence) => this.changeCurrentSentence(currentSentence)}
                                seekTo={(time) => this.seekTo(time)}
                                subtitleFile={this.state.subtitleFile}
                            />
                        </div>
                        <div className={'menu'}>
                            <PlayTime getTotalTime={() => this.totalTime} getProgress={() => this.progress}/>
                        </div>
                        <div className='underline-subtitle'>
                            <MainSubtitle ref={this.mainSubtitleRef}/>
                            <UploadPhoto onFileChange={this.onFileChange}/>
                        </div>
                    </div>
                    <div id={'progressBarRef'}>
                        <BorderProgressBar getCurrentTime={() => this.progress} getTotalTime={() => this.totalTime}/>
                    </div>
                </GlobalShortCut>
            </>
        )
    }
}
