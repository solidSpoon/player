import axios from "axios";

class TransFiller {
    constructor(subtitles) {
        this.subtitles = subtitles ? subtitles : [];
    }

    /**
     * public
     */
    fillTranslate() {
        let buffer = new Buf(0);
        const root = buffer;
        this.subtitles.forEach((item, index) => {
            item.text = item.text ? item.text : '';
            if (!buffer.canAdd(item.text)) {
                buffer["next"] = new Buf(index);
                buffer = buffer["next"];
                buffer["delay"] = 1;
            }
            buffer.add(item["text"]);
        })
        this.delayTrans(root);
    }


    delayTrans(buf) {
        if (buf.size === 0) {
            return;
        }
        setTimeout(() => this.doFillTranslate(buf), buf.delay * 1000);
    }

    doFillTranslate(buf) {
        const start = buf["startIndex"];
        const str = buf["strs"];
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

    processTransResponse(response, start) {
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
    constructor(startIndex) {
        this.startIndex = startIndex;
        this.delay = 0;
        this.strs = [];
        this.size = 0;
        this.max = 2000;
        this.next = undefined;
    }

    canAdd(str) {
        const b = this.size + str.length < this.max;
        console.log('str', str);
        if (!b) {
            if (this.size === 0) {
                throw 'translate buf: max too small-' + str.length;
            }
        }
        return b;
    }

    add(str) {
        if (!this.canAdd(str)) {
            throw 'translate buf: too large';
        }
        this.strs.push(str);
        this.size += str.length;
    }
}


export default TransFiller;