import ProgressCache from "../../ServerLib/ProgressCache";
import ProgressEntity from "../../ServerLib/ProgressEntity";
import crypto from "crypto";

export default async function handler(req, res) {
    const fileName: string = req.query.fileName;
    const progress: number = req.query.progress;
    const progressEntity = new ProgressEntity();
    progressEntity.fileName = fileName;
    progressEntity.hash = crypto.createHash('md5').update(fileName).digest("hex");
    progressEntity.progress = progress;
    await ProgressCache.updateProgress(progressEntity);
    res.status(200).json();

}