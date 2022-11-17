import ProgressCache from "../../ServerLib/ProgressCache";
import ProgressEntity from "../../ServerLib/ProgressEntity";
import crypto from "crypto";

export default function handler(req, res) {
    // const fileName: string = req.query.fileName;
    const fileName: string = 'baba'
    const progressEntity = new ProgressEntity();
    progressEntity.fileName = fileName;
    progressEntity.hash = crypto.createHash('md5').update(fileName).digest("hex");
    progressEntity.progress = 21;
    ProgressCache.updateProgress(progressEntity);
    res.status(200).json();

}