import {MutableRefObject, ReactElement} from "react";

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
    subtleEle: MutableRefObject<ReactElement>;
    public getPrevItem = (): SentenceT => {
        return this.prevItem;
    }
    public getNestItem = (): SentenceT => {
        return this.nextItem;
    }

    constructor() {
    }
}

export default SentenceT;