const searchSubtitle = (subtitles, currentTime, currentSubtitle) => {
    if (currentSubtitle === undefined) {
        return subtitles.find(v => current(v, currentTime));
    }

    if (current(currentSubtitle, currentTime)) {
        return currentSubtitle;
    }

    if (currentSubtitle.prev !== undefined) {
        if (current(currentSubtitle.prev, currentTime)) {
            return currentSubtitle.prev;
        }
    }
    if (currentSubtitle.next !== undefined) {
        if (current(currentSubtitle.next, currentTime)) {
            return currentSubtitle.next;
        }
    }
    return subtitles.find(v => current(v, currentTime));
}
const current = (s, currentTime) => {
    return currentTime >= s.timeStart && currentTime <= s.timeEnd;
}
export default searchSubtitle;