// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Trans from "../../ServerLib/Trans";
import Cache from "../../ServerLib/Cache";

export default function handler(req, res) {
    const crypto = require('crypto');
    let sourceArr = req.body.str.map(item => {
        item = item.trim();
        return {
            text: item,
            hash: crypto.createHash('md5').update(item).digest("hex"),
            translate: undefined,
        }
    });

    const c = new Cache();
    c.batchQuery(sourceArr.map((item) => item["hash"]), processQueryResult)

    function processQueryResult(dbDocs) {
        dbDocs.forEach((doc) => {
            const find = sourceArr.find((item) => item["hash"] === doc["hash"]);
            find["translate"] = doc["translate"];
        })

        const retryDoc = sourceArr.filter((doc) => doc.translate === undefined);
        if (retryDoc.length === 0) {
            res.status(200).json({
                success: true,
                strs: sourceArr.map(doc => doc.translate)
            });
            return;
        }
        const trans = new Trans();
        trans.batchTrans(retryDoc, () => processTransResult(retryDoc));
    }

    function processTransResult(retryDoc) {
        c.insert(retryDoc, processResult)
    }

    function processResult() {
        res.status(200).json({
            success: true,
            strs: sourceArr.map(doc => doc.translate)
        });
    }
}

