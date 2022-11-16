import style from './Subtitle.module.css'
import {useEffect} from "react";
import {isVisible} from "../lib/isVisible";
import searchSubtitle from "../lib/searchSubtitle";
import SentenceT from "../lib/SentenceT";

const Subtitle = ({
                      playerRef,
                      subtitlesState,
                      currentTimeState,
                      currentSubtleState,
                      jumpTimeState,
                      pushTimeState,
                      jumpTextState
                  }) => {
    const [currentTime] = currentTimeState;
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;
    const [subtitles] = subtitlesState;
    const [jumpTime, setJumpTime] = jumpTimeState;
    const [pushTime, setPushTime] = pushTimeState;
    const [jumpText, setJumpText] = jumpTextState;
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
                onClick={() => {
                    if (playerRef.current === undefined) {
                        return;
                    }
                    console.log("jt" + item.timeStart)
                    setPushTime(Date.now());
                    setJumpTime(item.timeStart);
                    setJumpText(item);
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
        console.log("inin")
        const subtitle = currentSubtitle;
        const find: SentenceT = Date.now() - pushTime > 600 ? searchSubtitle(subtitles, currentTime, subtitle) : jumpText;
        if (find === undefined || find === subtitle) {
            return;
        }
        if (find.subtleDiv === undefined) {
            find.subtleDiv = document.getElementById("Subtitle-subt" + find.key);
        }
        const child = find.subtleDiv;
        const icon = child.querySelector<HTMLElement>('.' + style.subtitleItemIcon);
        icon.style.visibility = "visible";
        if (subtitle !== undefined) {
            subtitle.subtleDiv
                .getElementsByClassName(style.subtitleItemIcon)[0]
                .style.visibility = "hidden";
        }
        setCurrentSubtitle(find)
        const parent = document.getElementById("Subtitle-subt");
        if (!isVisible(child)) {
            parent.scrollTo({
                top: child.offsetTop - 50,
                behavior: "smooth"
            })
        }

    }, [currentTime, jumpTime]);
    return (
        <div className={style.subtitleBox} id={"Subtitle-subt"}>
            {subtitleItems}
        </div>
    )

}

export default Subtitle;