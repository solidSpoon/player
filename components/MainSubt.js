import style from './MainSubt.module.css'
import React, {Component, Fragment, useEffect, useRef, useState} from 'react';
import TransableSubtLine from "./TransableSubtLine";
import ReactDOM from 'react-dom/client'

const MainSubtitle = ({currentSubtleState}) => {
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    let ref = undefined;
    const [root, setRoot] = useState();
    useEffect(() => {
        let r = root;
        if (currentSubtitle === undefined) {
            return;
        }
        if (r === undefined) {
            if (ref === undefined) {
                return;
            }

            r = ReactDOM.createRoot(ref);
            setRoot(r);
        }
        let ele = <>
            <div className={style.source}>{TransableSubtLine(currentSubtitle.text, style.msWord, style.msNotWord)}</div>
            <div className={style.destM}>{currentSubtitle ? currentSubtitle.msTranslate : ''}</div>
            <div className={style.destH}>{currentSubtitle ? currentSubtitle.textZH : ''}</div>
        </>
        r.render(ele);

    }, [currentSubtitle]);
    return (
        <div className={style.mainSubtitleContainer} ref={(e) => {
            ref = e
        }}>
        </div>
    )
}
export default MainSubtitle;