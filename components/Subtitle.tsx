import style from './Subtitle.module.css'
import {Component, ReactElement, useEffect, useRef} from "react";
import {isVisible} from "../lib/isVisible";
import searchSubtitle from "../lib/searchSubtitle";
import SentenceT from "../lib/param/SentenceT";
import FileT from "../lib/param/FileT";
import axios from "axios";
import parseSrtSubtitles from "../lib/parseSrt";
import TransFiller from "../lib/TransFiller";
import {clearTimeout} from "timers";

interface SubtitleParam {
    subtitleFile: FileT,
    getCurrentTime: () => number
    seekTo: (time: number) => void
    onCurrentSentenceChange: (currentSentence: SentenceT) => void
}

interface SubtitleState {
    subtitles: SentenceT[]
}

interface IntervalParam {
    getCurrentTime: () => number;
    sentences: () => SentenceT[]
}

export default class Subtitle extends Component<SubtitleParam, SubtitleState> {
    private timer: NodeJS.Timer;
    private currentSentence: SentenceT;

    constructor(props) {
        super(props);
        this.state = {
            subtitles: undefined
        }
    }

    componentDidMount() {
        this.initSubtitles();
        this.timer = setInterval(()=>this.interval(this.intervalParam), 1000);
    }

    private intervalParam: IntervalParam = {
        getCurrentTime: () => this.props.getCurrentTime(),
        sentences: () => this.state.subtitles
    }
    // private getCurrentTime = () => this.props.getCurrentTime();
    // private sentences = () => this.state.subtitles;

    private interval(intervalParam: IntervalParam) {
        console.log('interval')
        if (intervalParam.sentences() === undefined) {
            return;
        }
        const currentTime = intervalParam.getCurrentTime();
        const jump = currentTime;

        const subtitle = this.currentSentence;
        // const find: SentenceT = Date.now() - pushTime > 600 ? searchSubtitle(subtitles, currentTime, subtitle) : jumpText;
        const find: SentenceT = searchSubtitle(intervalParam.sentences(), intervalParam.getCurrentTime(), subtitle)
        if (find === undefined || find === subtitle) {
            return;
        }
        if (find.subtleDiv === undefined) {
            find.subtleDiv = document.getElementById("Subtitle-subt" + find.key);
        }
        const child = find.subtleDiv;
        const icon = child.querySelector<HTMLElement>('.' + style.subtitleItemIcon);
        icon.style.visibility = "visible";
        if (subtitle !== undefined) {
            subtitle.subtleEle.current.props.visibility = "hidden"
            // .getElementsByClassName(style.subtitleItemIcon)[0]
            // .style.visibility = "hidden";
        }
        this.setCurrentSubtitle(find)
        const parent = document.getElementById("Subtitle-subt");
        if (!isVisible(child)) {
            parent.scrollTo({
                top: child.offsetTop - 50,
                behavior: "smooth"
            })
        }


    }

    private initSubtitles() {
        const srcFile = this.props.subtitleFile
        if (srcFile === undefined) {
            console.log('srcFileUndefind')
            return;
        }
        const updateSubtitle = this.updateSubtitle;
        axios
            .get(srcFile.objectUrl)
            .then(function (response) {
                updateSubtitle(response.data, srcFile)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    private updateSubtitle = (str: string, fileUrl: FileT): void => {
        const srtSubtitles = parseSrtSubtitles(str);
        srtSubtitles.forEach(item => item.fileUrl = fileUrl.objectUrl)
        new TransFiller(srtSubtitles).fillTranslate();
        this.setState({
            subtitles: srtSubtitles
        });
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }


    private subtitleItems(): ReactElement[] {
        const sentenceTS = this.state.subtitles;
        if (sentenceTS === undefined) {
            return;
        }
        let lastSubtitle: SentenceT;

        return sentenceTS.map((item) => {
                if (lastSubtitle !== undefined) {
                    lastSubtitle.nextItem = item;
                    item.prevItem = lastSubtitle;
                }
                lastSubtitle = item;
                const ref = useRef();
                item.subtleEle = ref;
                return <div
                    ref={ref}
                    key={"Subtitle-subt" + item.key}
                    id={"Subtitle-subt" + item.key}
                    className={style.subtitleItem}
                    onClick={() => {
                        this.props.seekTo(item.timeStart);
                        // if (playerRef.current === undefined) {
                        //     return;
                        // }
                        // setPushTime(Date.now());
                        // setJumpTime(item.timeStart);
                        // setJumpText(item);
                        // playerRef.current.seekTo(item.timeStart, 'seconds');
                    }
                    }>
                    <div className={style.subtitleItemIcon}>
                        👺
                    </div>
                    <div className={style.subtitleItemText}>
                        {item.text}
                    </div>
                </div>;
            }
        );
    }

    private setCurrentSubtitle(find: SentenceT) {
        this.props.onCurrentSentenceChange(find);
    }

    render() {
        console.log('Subtitle render')
        return <div className={style.subtitleBox} id={"Subtitle-subt"}>
            {this.subtitleItems()}
        </div>
    }

}
