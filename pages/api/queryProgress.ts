import ProgressCache from "../../ServerLib/ProgressCache";
import ProgressEntity from "../../ServerLib/ProgressEntity";
import crypto from "crypto";

export default function handler(req, res) {
    const fileName: string = req.query.fileName;
    const progressEntity = new ProgressEntity();
    progressEntity.fileName = fileName;
    progressEntity.hash = crypto.createHash('md5').update(fileName).digest("hex");
    ProgressCache.queryProcess(progressEntity, handleQueryResult);

    function handleQueryResult() {
        res.status(200).json(progressEntity);
    }

}