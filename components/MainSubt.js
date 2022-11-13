import style from './MainSubt.module.css'
import React, {Component, Fragment, useEffect, useRef} from 'react';

const MainSubtitle = ({currentSubtleState}) => {
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    useEffect(() => console.log(currentSubtitle), [currentSubtitle]);
    return (
        <div className={style.mainSubtitleContainer}>
            <div className={style.source}>{currentSubtitle ? currentSubtitle.text : ''}</div>
            <div className={style.dest}>{currentSubtitle ? currentSubtitle.msTranslate : ''}</div>
        </div>
    )
}
export default MainSubtitle;