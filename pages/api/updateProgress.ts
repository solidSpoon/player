import ProgressCache from "../../ServerLib/ProgressCache";
import ProgressEntity from "../../ServerLib/entity/ProgressEntity";

/**
 * 更新播放进度
 * @param req
 * @param res
 */
export default async function handler(req, res) {
    const fileName: string = req.query.fileName;
    const progress: number = req.query.progress;
    const progressEntity = new ProgressEntity(fileName);
    progressEntity.progress = progress;
    await ProgressCache.updateProgress(progressEntity);
    res.status(200).json('success');
}