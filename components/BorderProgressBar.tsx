import ProgressBar from "@ramonak/react-progress-bar";
import {ReactElement, useEffect, useRef, useState} from "react";
import s from './BorderProgressBar.module.css';

const BorderProgressBar = ({
                               currentTimeState,
                               totalTimeState
                           }): ReactElement => {
    const [time] = currentTimeState;
    const [totalTime] = totalTimeState;
    const ref = useRef<ReactElement>();
    useEffect(() => {
        console.log(time, "==", totalTime);
        if (time === undefined || totalTime === undefined) {
            return;
        }

        function calculatePercentage() {
            return Math.floor((time / totalTime) * 100);
        }

        setPercentage(calculatePercentage);
    }, [time, totalTime])
    const [percentage, setPercentage] = useState(0);
    return <div className={s.processBar}>
        <ProgressBar completed={percentage}
                     isLabelVisible={false}
        />
    </div>;

}
export default BorderProgressBar;