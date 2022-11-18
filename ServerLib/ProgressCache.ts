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
        progress.updateDate = Date.now();
        const tdb = this.db;
        console.log(progress)
        tdb.update({
            hash: progress.hash
        }, progress, {upsert: true, multi: true}, (err, num) => {
            console.log(num)
            if (num > 1) {
                console.log(">1")
                tdb.remove({
                    hash: progress.hash
                }, {multi: true}, function (error, docs) {
                    console.log(error)
                    console.log(docs)
                    tdb.insert(progress);
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