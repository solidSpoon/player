import axios from "axios";

export default function fillTranslate(subtitles) {
    if (subtitles === undefined) {
        return;
    }

    function doFillTranslate(start, str) {
        axios
            .post('/api/translate', {
                str: str
            })
            .then(function (response) {
                if (response["data"]["success"] === false) {
                    return;
                }
                response["data"]["strs"].forEach((item, i) => {
                    const index = start + i;
                    subtitles[index]["msTranslate"] = item;
                    console.log(subtitles[index]);
                    // updateSubtitle(subtitles);
                })

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    let buffer = {
        delay: 0,
        totalLength: 0,
        start: 0,
        str: []
    }

    function delayTrans(b) {
        setTimeout(function () {
            doFillTranslate(b.start, b.str);
        }, b.delay * 300);
    }

    subtitles.forEach((item, index) => {
        item.text = item.text ? item.text : '';
        if (buffer["totalLength"] + item.text.length > 2000) {
            const delay = buffer["delay"];
            delayTrans(buffer);
            buffer = {
                delay: delay + 1,
                totalLength: 0,
                start: index,
                str: []
            }
        }
        buffer["str"].push(item["text"]);
        buffer["totalLength"] += item["text"].length;
    })


    if (buffer["str"].length > 0) {
        delayTrans(buffer);
    }
}
