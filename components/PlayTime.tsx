import {Component, ReactElement, useEffect, useRef, useState} from "react";
import s from './PlayTime.module.css'

interface PlayTimeParam {
    getProgress: () => number,
    getTotalTime: () => number
}

interface PlayerTimeState {
    totalTime: string,
    progress: string
}

export default class PlayTime extends Component<PlayTimeParam, PlayerTimeState> {
    private interval: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.state = {
            totalTime: "",
            progress: ""
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.task, 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    private task = () => {
        this.setState({
            totalTime: this.secondToDate(this.props.getTotalTime()),
            progress: this.secondToDate(this.props.getProgress())
        })
    }

    private secondToDate(seconds: number = 0) {
        if (seconds === undefined) {
            return "00:00:00"
        }
        let h: number = Math.floor(seconds / 60 / 60 % 24)
        let hs = h < 10 ? '0' + h : h
        let m = Math.floor(seconds / 60 % 60)
        let ms = m < 10 ? '0' + m : m
        let s = Math.floor(seconds % 60)
        let ss = s < 10 ? '0' + s : s
        return hs + ":" + ms + ":" + ss + "";
    }

    render() {
        return <>
            <div className={s.timeContainer}>
                <div className={s.time}>
                    <span className={s.timeText}>{this.state.progress}</span>
                    &nbsp;/&nbsp;
                    <span className={s.timeText}>{this.state.totalTime}</span>
                </div>
            </div>
        </>
    }

}