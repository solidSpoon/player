import style from './Subtitle.module.css'
import {useEffect} from "react";
import {isVisible} from "../lib/isVisible";
import searchSubtitle from "../lib/searchSubtitle";

const Subtitle = ({playerRef, subtitlesState, currentTimeState, currentSubtleState}) => {
    const [currentTime, setCurrentTime] = currentTimeState;
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    const [subtitles, setSubtitles] = subtitlesState;
    let lastSubtitle;
    const subtitleItems = subtitles.map((item) => {
            if (lastSubtitle !== undefined) {
                lastSubtitle.nextItem = item;
                item.prevItem = lastSubtitle;
            }
            lastSubtitle = item;
            return <div
                key={"Subtitle-subt" + item.key}
                id={"Subtitle-subt" + item.key}
                className={style.subtitleItem}
                onClick={(event) => {
                    playerRef.current.seekTo(item.timeStart, 'seconds');
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
                subtitles[i - 1].nextItem = subtitles[i];
                subtitles[i].prevItem = subtitles[i - 1];
            }
            subtitles[i].subtleDiv = document.getElementById("Subtitle-subt" + subtitles[i].key);
        }
    }, [])
    useEffect(() => {
        const parent = document.getElementById("Subtitle-subt");
        const subtitle = currentSubtitle;
        const find = searchSubtitle(subtitles, currentTime, subtitle);
        if (find === undefined || find === subtitle) {
            return;
        }
        if (find.subtleDiv === undefined) {
            find.subtleDiv = document.getElementById("Subtitle-subt" + find.key);
        }
        const child = find.subtleDiv;
        const icon = child.getElementsByClassName(style.subtitleItemIcon)[0];
        icon.style.visibility = "visible";
        if (subtitle !== undefined) {
            subtitle.subtleDiv
                .getElementsByClassName(style.subtitleItemIcon)[0]
                .style.visibility = "hidden";
        }
        setCurrentSubtitle(find)
        if (!isVisible(child)) {
            parent.scrollTo(0, child.offsetTop - 50)
        }

    }, [currentTime]);
    return (
        <div className={style.subtitleBox} id={"Subtitle-subt"}>
            {subtitleItems}
        </div>
    )

}

export default Subtitle;