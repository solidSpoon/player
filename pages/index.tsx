import React, {Component, ReactElement, useEffect, useRef, useState} from 'react'
import Player, {playState} from "../components/Player";
import Subtitle from "../components/Subtitle";
import MainSubtitle from "../components/MainSubt";
import Keyevent from "react-keyevent";
import UploadPhoto from "../components/UplodeButton";
import ReactDOM, {createRoot} from 'react-dom/client';
import parseSrtSubtitles from "../lib/parseSrt";
import axios from "axios";
import TransFiller from "../lib/TransFiller";
import SentenceT from "../lib/param/SentenceT";
import KeyListener from "../lib/KeyListener";
import BorderProgressBar from "../components/BorderProgressBar";
import PlayTime from "../components/PlayTime";
import FileT, {FileType} from "../lib/param/FileT";
import RecordProgress from '../lib/RecordProgress';

/**
 *     const playerRef = useRef<Player>()
 *     const currentTimeState = useState(0);
 *     const [ct] = currentTimeState;
 *     const currentSubtleState = useState<SentenceT>();
 *     const videoFileState = useState<FileT>();
 *     const [videoFile] = videoFileState;
 *     const playingState = useState<boolean>(true);
 *     const srcState = useState<FileT>();
 *     const [srcFile] = srcState;
 *     const subtitleState = useState<SentenceT[]>([]);
 *     const [subtitles, setSubtitles] = subtitleState;
 *     const totalTmeState = useState<number>();
 */

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
     * 当前字幕行
     * @private
     */
    private currentSentence: SentenceT;
    /**
     * 是否在播放
     * @private
     */
    private isPlaying: boolean;
    /**
     * 视频时长
     * @private
     */
    private totalTime: number;


    constructor(props) {
        super(props);
        this.progress = 0;
        this.totalTime = 0;
        this.playerRef = React.createRef<Player>();
        this.currentSentence = undefined;
        this.isPlaying = undefined;
        this.state = {
            videoFile: undefined,
            subtitleFile: undefined
        }
    }

    playerEle = (): ReactElement => {
        let ele = <Player
            ref={this.playerRef}
            videoFile={this.state.videoFile}
            onProgress={(time) => this.progress = time}
            onPlayingStateChange={
                (state) => {
                    if (playState.play === state) {
                        this.isPlaying = true;
                    }
                    if (playState.pause === state) {
                        this.isPlaying = false;
                    }
                }
            }
            onTotalTimeChange={
                (time) => {
                    this.totalTime = time;
                }
            }/>;
        return ele;
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
        this.playerRef.current.seekTo(time)
    }

    render() {
        return (
            <>
                <div className='container'
                     onKeyDown={event => {
                         console.log(event.key)
                     }}
                >
                    <div className='player' id={"player-id"}>
                        {this.playerEle()}
                    </div>
                    <div className='subtitle' id={"subtitle-id"}>
                        <Subtitle
                            getCurrentTime={() => this.progress}
                            onCurrentSentenceChange={(currentSentence) => this.currentSentence = currentSentence}
                            seekTo={(time) => this.seekTo(time)}
                            subtitleFile={this.state.subtitleFile}
                        />
                    </div>
                    <div className={'menu'}>
                        {/*<PlayTime currentTimeState={this.c} totalTimeState={totalTmeState}/>*/}
                    </div>
                    <div className='underline-subtitle'>
                        {/*<MainSubtitle currentSubtleState={currentSubtleState}/>*/}
                        <UploadPhoto onFileChange={this.onFileChange}/>
                    </div>
                </div>
                <div id={'progressBarRef'}>
                    <BorderProgressBar/>
                </div>
            </>
        )
    }
}

// function Home1() {
//     useEffect(() => {
//         if (videoFile !== undefined) {
//             const newEle =
//                 <Player
//                     videoFile={videoFile}
//                     onProgress={(time) => currentTimeState[1](time)}
//                     onPlayingStateChange={
//                         (state) => {
//                             if (playState.play === state) {
//                                 playingState[1](true);
//                             }
//                             if (playState.pause === state) {
//                                 playingState[1](false);
//                             }
//                         }
//                     }
//                     onTotalTimeChange={
//                         (time) => {
//                             totalTmeState[1](time);
//                         }
//                     }/>;
//             const container = document.getElementById("player-id");
//             const root = createRoot(container); // createRoot(container!) if you use TypeScript
//             root.render(newEle);
//         }
//     }, [videoFile])
//
//
//     useEffect(() => {
//         if (srcFile !== undefined) {
//
//             axios
//                 .get(srcFile.objectUrl)
//                 .then(function (response) {
//                     updateSubtitle(response.data, srcFile)
//                 })
//                 .catch(function (error) {
//                     console.log(error);
//                 });
//         }
//     }, [srcFile]);
//
//     const updateSubtitle = (str: string, fileUrl: FileT): void => {
//         const srtSubtitles = parseSrtSubtitles(str);
//         srtSubtitles.forEach(item => item.fileUrl = fileUrl.objectUrl)
//         new TransFiller(srtSubtitles).fillTranslate();
//         setSubtitles(srtSubtitles);
//     };
//
//     const [subtitleRoot, setSubtitleRoot] = useState(null);
//     // const keyListener = new KeyListener(
//     //     currentSubtleState,
//     //     pushTimeState,
//     //     jumpTextState,
//     //     jumpTimeState,
//     //     // playerRef,
//     //     playingState
//     // );
//     useEffect(() => {
//         if (subtitles === undefined) {
//             return;
//         }
//         let root = subtitleRoot;
//         if (root === null) {
//             const container = document.getElementById("subtitle-id");
//             root = createRoot(container);
//             setSubtitleRoot(root);
//         }
//         const newEle =
//             <Subtitle
//                 getCurrentTime={() => ct}
//                 onCurrentSentenceChange={(currentSentence) => currentSubtleState[1](currentSentence)}
//                 seekTo={(time) => playerRef.current.seekTo(time)}
//                 subtitleFile={srcFile}
//             />
//         const element = subtitleRef.current.render();
//         console.log(element)
//         root.render(element);
//         console.log('update')
//
//     }, [subtitles]);
//
//     RecordProgress({
//         getCurrentProgress: () => ctr.current,
//         getCurrentVideoFile: () => vfr.current
//
//     });
//     const ctr = useRef<number>();
//     const vfr = useRef<FileT>();
//     useEffect(() => {
//         ctr.current = ct;
//         vfr.current = videoFile;
//     }, [ct, videoFile])
//
//
//     const progressRoot = useRef();
//     useEffect(() => {
//         if (progressRoot.current === undefined) {
//             const ele = document.getElementById('progressBarRef')
//             progressRoot.current = ReactDOM.createRoot(ele);
//         }
//
//         // @ts-ignore
//         progressRoot.current.render(
//             <BorderProgressBar currentTime={ct} totalTime={totalTmeState[0]}/>
//         )
//     }, [ct])
//
//
//     const subtitleRef = useRef<Subtitle>()
//
// }
