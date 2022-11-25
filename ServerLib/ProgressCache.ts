import CacheEntity from "./CacheEntity";
import ProgressEntity from "./ProgressEntity";
import {string} from "prop-types";
import crypto from "crypto";
import Nedb from "nedb";

class ProgressCache {
    private static db: Nedb<ProgressEntity>;
    static {
        this.db = new Nedb(
            {
                filename: './db/progress.db',
                autoload: true,
            }
        )
    }

    public static async updateProgress(progress: ProgressEntity): void {
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

       const updateNum = await this.updateOne(progress);
        if (updateNum > 1) {
            console.log(">1")
            tdb.remove({
                hash: progress.hash
            }, {multi: true}, function (error, docs) {
                console.log(error)
                console.log(docs)
                tdb.insert(progress);
            })
        }
    }

    private static async deleteProgress(fileName: string) {

    }

    private static async updateOne(progress: ProgressEntity): Promise<number> {
        progress.updateDate = Date.now();
        console.log("update progress", progress);
        const query = {
            hash: progress.hash
        }
        const options: Nedb.UpdateOptions = {
            upsert: true,
            multi: true
        }

        return new Promise((resolve, reject) => {
            this.db.update(query, progress, options, (error, num) => {
                console.log("update item", num);
                resolve(num);
            })
        });
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