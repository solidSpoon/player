const searchSubtitle = (subtitles, currentTime, currentSubtitle) => {
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
const current = (s, currentTime) => {
    return currentTime >= s.timeStart && currentTime <= s.timeEnd;
}
export default searchSubtitle;