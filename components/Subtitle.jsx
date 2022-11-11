import style from './Subtitle.module.css'
import {useEffect, useRef} from "react";
import useSmoothScroll from 'react-smooth-scroll-hook';

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
            {item.text}
        </div>
    );


    const [currentTime, setCurrentTime] = currentTimeState;
    useEffect(() => {
        for (const v of subtitles) {
            const child = document.getElementById("Subtitle-subt" + v.key);
            if (currentTime > v.timeStart && currentTime < v.timeEnd) {
                const parent = document.getElementById("Subtitle-subt");
                parent.scrollTo(0, child.offsetTop - 300)
                child.style.backgroundColor = 'yellow'
            } else {
                child.style.backgroundColor = 'white'
            }
        }

    }, [currentTime]);
    return (
        <div className={style.subtitleBox} id={"Subtitle-subt"} ref={boxRef}>
            {subtitleItems}
        </div>
    )

}

export default Subtitle;