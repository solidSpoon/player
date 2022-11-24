// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Trans from "../../ServerLib/Trans";
import Cache from "../../ServerLib/Cache";
import CacheEntity from "../../ServerLib/CacheEntity";
import cacheEntity from "../../ServerLib/CacheEntity";

interface TranslateParam {
    body: {
        str: string[]
    }
}

export default function handler(req: TranslateParam, res) {
    const c = new Cache();
    const trans = new Trans();

    let sourceArr: cacheEntity[] = req.body.str.map(item => new CacheEntity(item));
    sourceArr.forEach(item => item.hash = c.hash(item.text));
    const process = async (sourceArr: cacheEntity[]): Promise<CacheEntity[]> => {
        const dbDocs: CacheEntity[] = await c.getCache(sourceArr.map(item => item.text))
            .then(dbDoc => dbDoc.filter(item => item.translate !== undefined));

        dbDocs.forEach((doc) => {
            const finds: CacheEntity[] = sourceArr.filter((item) => item.hash === doc.hash);
            finds.forEach(find => find.translate = doc.translate);
        })
        const retryDoc: CacheEntity[] = sourceArr.filter((doc) => doc.translate === undefined);
        if (retryDoc.length === 0) {
            return sourceArr;
        }
        const transResult: CacheEntity[] = await trans.batchTrans2(retryDoc);
        await c.insert(transResult);
        return sourceArr;
    }
    process(sourceArr)
        .then(docs => {
            res.status(200).json({
                success: true,
                strs: docs.map(doc => doc.translate)
            });
        });
}

