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

export default async function handler(req: TranslateParam, res) {

    let sourceArr: cacheEntity[] = req.body.str.map(item => new CacheEntity(item));
    sourceArr.forEach(item => item.hash = Cache.hash(item.text));

    const dbDocs: CacheEntity[] = await Cache.getCache(sourceArr.map(item => item.text))
        .then(dbDoc => dbDoc.filter(item => item.translate !== undefined));

    dbDocs.forEach((doc) => {
        const finds: CacheEntity[] = sourceArr.filter((item) => item.hash === doc.hash);
        finds.forEach(find => find.translate = doc.translate);
    })
    const retryDoc: CacheEntity[] = sourceArr.filter((doc) => doc.translate === undefined);
    if (retryDoc.length === 0) {
        return res.status(200).json({
            success: true,
            strs: sourceArr.map(doc => doc.translate)
        });
    }
    const transResult: CacheEntity[] = await Trans.batchTrans(retryDoc);
    await Cache.insert(transResult);
    return res.status(200).json({
        success: true,
        strs: sourceArr.map(doc => doc.translate)
    });

}

