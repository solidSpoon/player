import React, {Component} from "react";
import SentenceT from "../lib/param/SentenceT";
import style from "./Subtitle.module.css";

interface SideSentenceParam {
    sentence: SentenceT;
    onClick: (sentence: SentenceT) => void;
    key: string;
}

export default class SideSentence extends Component<SideSentenceParam, any> {
    private readonly iconRef: React.RefObject<HTMLDivElement>;

    constructor(props) {
        super(props);
        this.iconRef = React.createRef<HTMLDivElement>();
    }

    public show(): void {
        this.iconRef.current.style.visibility = "visible";
    }

    public hide(): void {
        this.iconRef.current.style.visibility = "hidden";
    }

    render() {
        return <div
            key={this.props.key}
            className={style.subtitleItem}
            onClick={() => {
                this.props.onClick(this.props.sentence)
            }
            }>
            <div className={style.subtitleItemIcon} ref={this.iconRef}>
                👺
            </div>
            <div className={style.subtitleItemText}>
                {this.props.sentence.text}
            </div>
        </div>;
    }
}