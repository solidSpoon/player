import SentenceT from "./SentenceT";

const searchSubtitle = (subtitles: SentenceT[], currentTime: number, currentSubtitle: SentenceT) => {
    if (currentSubtitle === undefined) {
        return subtitles.find(v => current(v, currentTime));
    }

    if (current(currentSubtitle, currentTime)) {
        return currentSubtitle;
    }

    if (currentSubtitle.prevItem !== undefined) {
        if (current(currentSubtitle.prevItem, currentTime)) {
            return currentSubtitle.prevItem;
        }
    }
    if (currentSubtitle.nextItem !== undefined) {
        if (current(currentSubtitle.nextItem, currentTime)) {
            return currentSubtitle.nextItem;
        }
    }
    return subtitles.find(v => current(v, currentTime));
}
const current = (s: SentenceT, currentTime: number): boolean => {
    let timeEnd: number = s.timeEnd;
    if (s.nextItem !== undefined) {
        timeEnd = s.nextItem.timeStart;
    }
    return currentTime >= s.timeStart - 0.2 && currentTime <= timeEnd;
}
export default searchSubtitle;