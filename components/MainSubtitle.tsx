import style from './MainSubt.module.css'
import React, {Component, ReactElement} from 'react';
import SentenceT from "../lib/param/SentenceT";
import TranslatableLine from "./TranslatableLine";

interface MainSubtitleState {
    sentence: SentenceT
}

export default class MainSubtitle extends Component<any, MainSubtitleState> {
    constructor(props) {
        super(props);
        this.state = {
            sentence: undefined
        }
    }


    ele(): ReactElement[] {
        if (this.state.sentence === undefined) {
            return;
        }
        const elements: ReactElement[] = [];
        elements.push(<TranslatableLine key={1} text={this.state.sentence.text} className={style.source}/>
        )
        if (this.state.sentence.msTranslate !== undefined) {
            elements.push(<div key={2} className={style.destM}>{this.state.sentence.msTranslate}</div>)
        }
        if (this.state.sentence.textZH !== undefined) {
            elements.push(<div key={3} className={style.destH}>{this.state.sentence.textZH}</div>)
        }
        return elements;
    }


    render() {
        return (
            <div className={style.mainSubtitleContainer}>
                {this.ele()}
            </div>
        )
    }
}
