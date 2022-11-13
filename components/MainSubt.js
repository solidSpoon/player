import style from './MainSubt.module.css'
import React, {Component, Fragment, useRef} from 'react';

const MainSubtitle = ({currentSubtleState}) => {
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;

    return (
        <div className={style.mainSubtitleContainer}>
            <div className={style.source}>{currentSubtitle ? currentSubtitle.text : ''}</div>
            <div className={style.dest}>{currentSubtitle ? currentSubtitle.text : ''}</div>
        </div>
    )
}
export default MainSubtitle;