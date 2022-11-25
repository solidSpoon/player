import CacheEntity from "./CacheEntity";
import ProgressEntity from "./ProgressEntity";
import NeDB from "nedb";
import {string} from "prop-types";
import crypto from "crypto";

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

    public static async queryProcess(progress: ProgressEntity): Promise<void> {
        const progressEntities: ProgressEntity[] = await this.findProgress(progress.fileName);
        if (progressEntities.length === 0) {
            progress.progress = 0;
            progress.updateDate = Date.now();
        } else {
            if (progressEntities.length > 1) {
                console.log("progress length bigger than one")
            }
            progress.progress = progressEntities[0].progress;
            progress.updateDate = progressEntities[0].updateDate;
        }
    }

    private static async findProgress(fileName: string): Promise<ProgressEntity[]> {
        const query = {
            hash: this.hash(fileName)
        }
        return new Promise<ProgressEntity[]>((resolve, reject) => {
            this.db.find(query, (err, docs: ProgressEntity[]) => {
                resolve(docs);
            })
        });
    }

    public static hash(str: string): string {
        str = str.trim();
        return crypto.createHash('md5').update(str).digest("hex");
    }

}

export default ProgressCache;