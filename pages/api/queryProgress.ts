import ProgressCache from "../../ServerLib/ProgressCache";
import ProgressEntity from "../../ServerLib/entity/ProgressEntity";
import crypto from "crypto";

export default async function handler(req, res) {
    const fileName: string = req.query.fileName;
    const progressEntity = new ProgressEntity(fileName);
    const result = await ProgressCache.queryProcess(progressEntity);
    res.status(200).json(result);
}