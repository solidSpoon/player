import style from './Subtitle.module.css'
import {useEffect, useRef, useState} from "react";
import useSmoothScroll from 'react-smooth-scroll-hook';
import {isVisible} from "../lib/isVisible";

const Subtitle = ({playerRef, subtitles, currentTimeState}) => {
    const boxRef = useRef();
    // const scrollTo = useSmoothScroll({
    //     boxRef,
    // });
    const subtitleItems = subtitles.map((item) =>
        <div
            key={"Subtitle-subt" + item.key}
            id={"Subtitle-subt" + item.key}
            className={style.subtitleItem}
            onClick={() => playerRef.current.seekTo(item.timeStart)}>
            <div className={style.subtitleItemIcon}>
                👺
            </div>
            <div className={style.subtitleItemText}>
                {item.text}
            </div>
        </div>
    );


    const [currentTime, setCurrentTime] = currentTimeState;
    const [lastSubtitleIcon, setLastSubtitleIcon] = useState(null)
    useEffect(() => {
        const find = subtitles.find(v => currentTime > v.timeStart && currentTime < v.timeEnd);
        if (find === undefined) {
            return;
        }
        const parent = document.getElementById("Subtitle-subt");
        const child = document.getElementById("Subtitle-subt" + find.key);
        const icon = child.getElementsByClassName(style.subtitleItemIcon)[0];
        if (icon === lastSubtitleIcon) {
            return;
        }
        icon.style.visibility = "visible";
        if (lastSubtitleIcon !== null) {
            lastSubtitleIcon.style.visibility = "hidden";
        }
        setLastSubtitleIcon(icon)
        if (!isVisible(child)) {
            console.log("invisiable")
            parent.scrollTo(0, child.offsetTop - 100)
        }
        // for (const v of subtitles) {
        //     const child = document.getElementById("Subtitle-subt" + v.key);
        //     if (currentTime > v.timeStart && currentTime < v.timeEnd) {
        //         const parent = document.getElementById("Subtitle-subt");
        //         // parent.scrollTo(0, child.offsetTop - 300)
        //         // child.style.backgroundColor = 'yellow'
        //         const icon = child.getElementsByClassName(style.subtitleItemIcon)[0];
        //         icon.style.visibility = "visible";
        //     } else {
        //         const icon = child.getElementsByClassName(style.subtitleItemIcon)[0];
        //         icon.style.visibility = "hidden";
        //     }
        // }

    }, [currentTime]);
    return (
        <div className={style.subtitleBox} id={"Subtitle-subt"} ref={boxRef}>
            {subtitleItems}
        </div>
    )

}

export default Subtitle;