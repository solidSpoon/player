import axios from "axios";
import SentenceT from "./param/SentenceT";

class TransFiller {
    private readonly subtitles: Array<SentenceT>;

    constructor(subtitles: Array<SentenceT>) {
        this.subtitles = subtitles ? subtitles : [];
    }

    /**
     * public
     */
    fillTranslate(): void {
        let buffer = new Buf(0);
        const root = buffer;
        this.subtitles.forEach((item, index) => {
            item.text = item.text ? item.text : '';
            if (!buffer.canAdd(item.text)) {
                buffer.next = new Buf(index);
                buffer = buffer.next;
                buffer.delay = 1;
            }
            buffer.add(item.text);
        })
        this.delayTrans(root);
    }


    delayTrans(buf: Buf): void {
        if (buf.isEmpty()) {
            return;
        }
        setTimeout(() => this.doFillTranslate(buf), 500);
    }

    doFillTranslate(buf: Buf): void {
        const start = buf.startIndex;
        const str = buf.strs;
        axios
            .post('/api/translate', {
                str: str
            })
            .then((response) => {
                this.processTransResponse(response, start);
                if (buf["next"] !== undefined) {
                    this.delayTrans(buf["next"]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    processTransResponse(response, start: number): void {
        if (response["data"]["success"] === false) {
            return;
        }
        response["data"]["strs"].forEach((item, i) => {
            const index = start + i;
            this.subtitles[index]["msTranslate"] = item;
        })
    }
}

class Buf {
    startIndex: number;
    delay: number;
    strs: string[];
    private size: number;
    private readonly max: number;
    next: Buf;

    constructor(startIndex) {
        this.startIndex = startIndex;
        this.delay = 0;
        this.strs = [];
        this.size = 0;
        this.max = 2000;
        this.next = undefined;
    }

    canAdd(str: string): boolean {
        const b = this.size + str.length < this.max;
        if (!b) {
            if (this.size === 0) {
                throw 'translate buf: max too small-' + str.length;
            }
        }
        return b;
    }

    add(str: string): void {
        if (!this.canAdd(str)) {
            throw 'translate buf: too large';
        }
        this.strs.push(str);
        this.size += str.length;
    }

    isEmpty(): boolean {
        return this.size === 0;
    }
}


export default TransFiller;