import style from './Subtitle.module.css'
import {useEffect, useRef, useState} from "react";
import {isVisible} from "../lib/isVisible";
import searchSubtitle from "../lib/searchSubtitle";

const Subtitle = ({playerRef, subtitles, currentTimeState, currentSubtleState}) => {
    const [currentTime, setCurrentTime] = currentTimeState;
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    let lastSubtitle;
    const subtitleItems = subtitles.map((item) => {
            if (lastSubtitle !== undefined) {
                lastSubtitle.next = item;
                item.prev = lastSubtitle;
            }
            lastSubtitle = item;
            return <div
                key={"Subtitle-subt" + item.key}
                id={"Subtitle-subt" + item.key}
                className={style.subtitleItem}
                onClick={(event) => {
                    const target = event.currentTarget;
                    const icon = target.getElementsByClassName(style.subtitleItemIcon)[0];
                    console.log(currentSubtitle )
                    const lastIcon = currentSubtitle.subtleDiv.getElementsByClassName(style.subtitleItemIcon)[0];
                    icon.style.visibility = "visible";
                    lastIcon.style.visibility = "hidden"
                    setCurrentSubtitle(searchSubtitle(subtitles, item.timeStart))
                    playerRef.current.seekTo(item.timeStart);
                }
                }>
                <div className={style.subtitleItemIcon}>
                    👺
                </div>
                <div className={style.subtitleItemText}>
                    {item.text}
                </div>
            </div>;
        }
    );
    useEffect(() => {
        for (let i = 0; i < subtitles.length; ++i) {
            if (i > 1) {
                subtitles[i - 1].next = subtitles[i];
                subtitles[i].prev = subtitles[i - 1];
            }
            subtitles[i].subtleDiv = document.getElementById("Subtitle-subt" + subtitles[i].key);
        }
    }, [])
    useEffect(() => {
        const parent = document.getElementById("Subtitle-subt");
        const find = searchSubtitle(subtitles, currentTime, currentSubtitle);
        if (find === undefined || find === currentSubtitle) {
            return;
        }
        if (find.subtleDiv === undefined) {
            find.subtleDiv = document.getElementById("Subtitle-subt" + find.key);
        }
        const child = find.subtleDiv;
        const icon = child.getElementsByClassName(style.subtitleItemIcon)[0];
        icon.style.visibility = "visible";
        if (currentSubtitle !== undefined) {
            currentSubtitle.subtleDiv
                .getElementsByClassName(style.subtitleItemIcon)[0]
                .style.visibility = "hidden";
        }
        setCurrentSubtitle(find)
        if (!isVisible(child)) {
            parent.scrollTo(0, child.offsetTop - 100)
        }

    }, [currentTime]);
    return (
        <div className={style.subtitleBox} id={"Subtitle-subt"}>
            {subtitleItems}
        </div>
    )

}

export default Subtitle;