// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TransApi from "../../ServerLib/TransApi";
import TranslateCache from "../../ServerLib/TranslateCache";
import TransCacheEntity from "../../ServerLib/entity/TransCacheEntity";
import cacheEntity from "../../ServerLib/entity/TransCacheEntity";

interface TranslateParam {
    body: {
        str: string[]
    }
}

export default async function handler(req: TranslateParam, res) {

    let sourceArr: cacheEntity[] = req.body.str.map(item => new TransCacheEntity(item));

    const dbDocs: TransCacheEntity[] = await TranslateCache.loadCache(sourceArr)
        .then(dbDoc => dbDoc.filter(item => item.translate !== undefined));

    dbDocs.forEach((doc) => {
        const finds: TransCacheEntity[] = sourceArr.filter((item) => item.hash === doc.hash);
        finds.forEach(find => find.translate = doc.translate);
    })
    const retryDoc: TransCacheEntity[] = sourceArr.filter((doc) => doc.translate === undefined);
    if (retryDoc.length === 0) {
        return res.status(200).json({
            success: true,
            strs: sourceArr.map(doc => doc.translate)
        });
    }
    const transResult: TransCacheEntity[] = await TransApi.batchTrans(retryDoc);
    await TranslateCache.insertBatch(transResult);
    return res.status(200).json({
        success: true,
        strs: sourceArr.map(doc => doc.translate)
    });

}

