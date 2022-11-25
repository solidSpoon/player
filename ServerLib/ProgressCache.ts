import ProgressEntity from "./ProgressEntity";
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

    /**
     * 更新视频进度
     * @param progress
     */
    public static async updateProgress(progress: ProgressEntity): Promise<void> {
        const updateNum = await this.insertOrUpdate(progress);
        if (updateNum === 1) {
            return;
        }
        console.log("update progress multi line:", updateNum);
        await this.deleteProgress(progress.hash);
        await this.insertOrUpdate(progress);

    }

    /**
     * 查询视频进度
     * @param progress
     */
    public static async queryProcess(progress: ProgressEntity): Promise<void> {
        progress.hash = this.hash(progress.fileName);
        const progressEntities: ProgressEntity[] = await this.findProgress(progress.hash);
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
    /**
     * 删除
     * @param hash
     * @private
     */
    private static async deleteProgress(hash: string): Promise<number> {

        return new Promise((resolve, reject) => {
            this.db.remove({
                hash: hash
            }, {multi: true}, function (error, count) {
                if (error !== null) {
                    console.log(error);
                }
                resolve(count)
            })
        })

    }

    /**
     * 插入或新增
     * @param progress
     * @private
     */
    private static async insertOrUpdate(progress: ProgressEntity): Promise<number> {
        progress.updateDate = Date.now();
        progress.hash = this.hash(progress.fileName);
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




    private static async findProgress(hash: string): Promise<ProgressEntity[]> {
        const query = {
            hash: hash
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