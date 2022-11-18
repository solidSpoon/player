import style from './MainSubt.module.css'
import React, {useEffect, useState} from 'react';
import TransableSubtLine from "./TransableSubtLine";
import ReactDOM from 'react-dom/client'
import SentenceT from "../lib/param/SentenceT";

interface MainSubtitleParam {
    currentSubtleState: [SentenceT, React.Dispatch<React.SetStateAction<SentenceT>>]
}

const MainSubtitle = (p: MainSubtitleParam) => {
    const [currentSubtitle, setCurrentSubtitle] = p.currentSubtleState;
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
        const eles = [];
        eles.push(<div
            className={style.source}>{TransableSubtLine(currentSubtitle.text, style.msWord, style.msNotWord)}</div>)
        if (currentSubtitle.msTranslate !== undefined) {
            eles.push(<div className={style.destM}>{currentSubtitle ? currentSubtitle.msTranslate : ''}</div>)
        }
        if (currentSubtitle.textZH !== undefined) {
            console.log("aaa"+currentSubtitle.textZH);
            eles.push(<div className={style.destH}>{currentSubtitle ? currentSubtitle.textZH : ''}</div>)
        }
        if (r !== undefined) {
            // @ts-ignore
            r.render(eles);
        }


    }, [currentSubtitle]);
    return (
        <div className={style.mainSubtitleContainer} ref={(e) => {
            ref = e
        }}>
        </div>
    )
}
export default MainSubtitle;