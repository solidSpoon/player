import ProgressBar from "@ramonak/react-progress-bar";
import {ReactElement, useEffect, useRef, useState} from "react";
import s from './BorderProgressBar.module.css';

const BorderProgressBar = ({
                               currentTime=0,
                               totalTime=0
                           }): ReactElement => {

    const percentage = () => {
        if (currentTime === undefined || totalTime === undefined) {
            return 0;
        }
        return (((currentTime / totalTime) * 100));
    }
    return <>
        <div className={s.processBar}>
            < ProgressBar
                completed={percentage()}
                transitionDuration={'0.2s'}
                isLabelVisible={false}
                height={'8px'}
                width={'100%'}
            />
        </div>
    </>
}
export default BorderProgressBar;