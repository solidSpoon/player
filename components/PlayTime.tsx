import {ReactElement, useEffect, useRef, useState} from "react";
import s from './PlayTime.module.css'

const PlayTime = ({
                      currentTimeState,
                      totalTimeState
                  }): ReactElement => {
    const [currentTime] = currentTimeState;
    const [totalTime] = totalTimeState;
    const nowR = useRef<HTMLElement>();
    const totalR = useRef<HTMLElement>();
    useEffect(() => {
        nowR.current.innerText = secondToDate(currentTime);
        totalR.current.innerText = secondToDate(totalTime)
    }, [currentTime, totalTime])

    function secondToDate(seconds: number = 0) {
        let h: number = Math.floor(seconds / 60 / 60 % 24)
        let hs = h < 10 ? '0' + h : h
        let m = Math.floor(seconds / 60 % 60)
        let ms = m < 10 ? '0' + m : m
        let s = Math.floor(seconds % 60)
        let ss = s < 10 ? '0' + s : s
        return hs + ":" + ms + ":" + ss + "";
    }


    return <>
        <div className={s.timeContainer} >
            <div className={s.time}>
                <span ref={nowR} className={s.timeText}></span> / <span ref={totalR} className={s.timeText}></span>
            </div>
        </div>
    </>
}
export default PlayTime;