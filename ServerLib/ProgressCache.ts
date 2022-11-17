import CacheEntity from "./CacheEntity";
import ProgressEntity from "./ProgressEntity";
import NeDB from "nedb";

class ProgressCache {
    private static db: NeDB<ProgressEntity>;
    static {
        this.db = new NeDB(
            {
                filename: './db/progress.db',
                autoload: true,
            }
        )
    }

    public static updateProgress(progress: ProgressEntity): void {
        const tdb = this.db;
        tdb.find({
            hash: progress.hash
        }, function (error, docs) {
            progress.updateDate = Date.now();
            if (docs.length === 0) {
                tdb.insert(progress);
            } else {
                if (docs.length > 1) {
                    console.log("progress length bigger than one")
                }
                tdb.update(progress, {
                    hash: progress.hash
                })
            }
        })
    }

    public static queryProcess(progress: ProgressEntity, callback: () => void) {
        this.db.find({
            hash: progress.hash
        }, function (err, docs) {
            if (docs.length === 0) {
                progress.progress = 0;
                progress.updateDate = Date.now();
            } else {
                if (docs.length > 1) {
                    console.log("progress length bigger than one")
                }
                progress.progress = docs[0].progress;
                progress.updateDate = docs[0].updateDate;
            }
            callback();

        })
    }

}

export default ProgressCache;