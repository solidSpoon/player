import ProgressBar from "@ramonak/react-progress-bar";
import {ReactElement, useEffect, useRef, useState} from "react";
import s from './BorderProgressBar.module.css';
const BorderProgressBar = ({
                               currentTimeState,
                               totalTimeState
                           }): ReactElement => {
    const [time] = currentTimeState;
    const [totalTime] = totalTimeState;

    useEffect(() => {
        if (time === undefined || totalTime === undefined) {
            return;
        }
        setPercentage(((time / totalTime) * 100));
    }, [time, totalTime])
    const [percentage, setPercentage] = useState(0);
    return <>
        <div className={s.processBar}>
            < ProgressBar completed={percentage}
                          // baseBgColor={'#00000000'}
                          transitionDuration={'0.2s'}
                          isLabelVisible={false}
                          height={'8px'}
                          width={'100%'}
                // customLabel={state.label}
            />
        </div>
    </>
}
export default BorderProgressBar;