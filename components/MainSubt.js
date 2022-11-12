import style from './MainSubt.module.css'

const MainSubtitle = ({currentSubtleState}) => {
    const [currentSubtitle, setCurrentSubtitle] = currentSubtleState;

    return (
        <div className={style.mainSubtitleContainer}>
            <div className={style.blank}></div>
            <div className={style.source}>{currentSubtitle ? currentSubtitle.text : ''}</div>
            <div className={style.dest}>{currentSubtitle ? currentSubtitle.text : ''}</div>
        </div>
    )
}
export default MainSubtitle;