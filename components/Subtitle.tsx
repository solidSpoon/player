import style from './Subtitle.module.css'
import React, {Component, ReactElement} from "react";
import searchSubtitle from "../lib/searchSubtitle";
import SentenceT from "../lib/param/SentenceT";
import FileT from "../lib/param/FileT";
import axios from "axios";
import parseSrtSubtitles from "../lib/parseSrt";
import TransFiller from "../lib/TransFiller";
import SideSentence from "./SideSentence";
import scrollIntoView from "scroll-into-view"
import {isVisible} from "../lib/isVisible";

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
    private currentSentenceUpdateTime: number;
    private parentRef: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.state = {
            subtitles: undefined
        }
        this.currentSentence = undefined;
        this.currentSentenceUpdateTime = Date.now();
        this.parentRef = React.createRef<HTMLDivElement>();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.subtitleFile === this.props.subtitleFile) {
            return;
        }
        this.initSubtitles();
    }

    componentDidMount() {
        this.initSubtitles();
        this.timer = setInterval(() => this.interval(this.intervalParam), 50);
    }

    public jumpNext(): void {
        let target = this.getCurrentSentence().getNestItem();
        if (target === undefined) {
            target = this.getCurrentSentence();
        }
        this.jumpTo(target)
    }

    public jumpPrev(): void {
        let target = this.getCurrentSentence().getPrevItem();
        if (target === undefined) {
            target = this.getCurrentSentence();
        }
        this.jumpTo(target);
    }

    public repeat() {
        this.jumpTo(this.getCurrentSentence());
    }

    private jumpTo(sentence: SentenceT) {
        if (sentence === undefined) {
            return;
        }
        this.updateTo(sentence);
        this.currentSentenceUpdateTime = Date.now();
        this.props.seekTo(sentence.timeStart);
    }

    private updateTo(sentence: SentenceT) {
        if (sentence === undefined || sentence === this.currentSentence) {
            return;
        }

        if (!isVisible(sentence.divElement.current)) {
            this.parentRef.current.scrollTo({
                top: sentence.divElement.current.offsetTop - 50,
                behavior: "smooth"
            })
        }
        sentence.element.current.show();
        if (this.currentSentence !== undefined) {
            this.currentSentence.element.current.hide();
        }
        this.currentSentence = sentence;
        this.props.onCurrentSentenceChange(sentence);
    }

    private intervalParam: IntervalParam = {
        getCurrentTime: () => this.props.getCurrentTime(),
        sentences: () => this.state.subtitles
    }

    private interval(intervalParam: IntervalParam) {
        console.log('interval')
        if (intervalParam.sentences() === undefined) {
            return;
        }
        const find: SentenceT = this.getCurrentSentence();
        if (find === this.currentSentence) {
            return;
        }
        this.updateTo(find);
    }

    private initSubtitles() {
        console.log('initmethod')
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
        let lastSubtitle: SentenceT;
        srtSubtitles.forEach(item => {
            if (lastSubtitle !== undefined) {
                lastSubtitle.nextItem = item;
                item.prevItem = lastSubtitle;
            }
            lastSubtitle = item;
        })
        new TransFiller(srtSubtitles).fillTranslate();
        this.setState({
            subtitles: srtSubtitles
        });
    };

    componentWillUnmount() {
        clearInterval(this.timer);
    }


    private subtitleItems(): ReactElement[] {
        const sentences = this.state.subtitles;
        if (sentences === undefined) {
            return;
        }
        return sentences.map((item, index) => {
                const ref = React.createRef<SideSentence>();
                item.element = ref;
                const divRef = React.createRef<HTMLDivElement>();
                item.divElement = divRef;
                return <div key={index} ref={divRef}>
                    <SideSentence
                        ref={ref}
                        sentence={item}
                        onClick={(sentence) => this.jumpTo(sentence)}
                        key={index.toString()}/>
                </div>
            }
        );
    }

    private getCurrentSentence(): SentenceT {
        const isOverdue = Date.now() - this.currentSentenceUpdateTime > 600;
        if (isOverdue || this.currentSentence === undefined) {
            const searchRes = searchSubtitle(this.state.subtitles, this.props.getCurrentTime(), this.currentSentence);
            if (searchRes !== undefined) {
                return searchRes;
            }
            return this.currentSentence;
        }
        return this.currentSentence;
    }


    render() {
        console.log('Subtitle render')
        return <div className={style.subtitleBox} ref={this.parentRef}>
            {this.subtitleItems()}
        </div>
    }


}
