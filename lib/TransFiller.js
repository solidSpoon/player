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
        this.subtitles.forEach((item, index) => {
            item.text = item.text ? item.text : '';
            if (buffer.canAdd(item.text.length)) {
                const delay = buffer["delay"];
                this.delayTrans(buffer);
                buffer = new Buf(index);
                buffer["delay"] = delay;
            }
            buffer.add(item["text"]);
        })
        this.delayTrans(buffer);
    }


    delayTrans(buf) {
        if (buf.size === 0) {
            return;
        }
        setTimeout(() => this.doFillTranslate(buf.startIndex, buf.strs), buf.delay * 300);
    }

    doFillTranslate(start, str) {
        axios
            .post('/api/translate', {
                str: str
            })
            .then((response) => {
                this.processTransResponse(response, start);
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
    }

    canAdd(str) {
        return this.size + str.length < this.max;
    }

    add(str) {
        if (!this.canAdd(str)) {
            throw 'too large';
        }
        this.strs.push(str);
        this.size += str.length;
    }
}


export default TransFiller;