class SentenceT {
    key: string;
    /**
     * 字幕序号
     */
    sn: string;
    timeStart: number;
    timeEnd: number;
    /**
     * 字幕英文原文
     */
    text: string;
    /**
     * 字幕中文原文
     */
    textZH: string;
    /**
     * 字幕机器翻译
     */
    fileUrl: string;
    msTranslate: string;
    nextItem: SentenceT;
    prevItem: SentenceT;
    subtleDiv: HTMLElement;

    constructor() {
    }
}

export default SentenceT;