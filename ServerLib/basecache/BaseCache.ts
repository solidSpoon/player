import Nedb from "nedb";
import BaseCacheEntity from "./BaseCacheEntity";
import {BaseCacheConfig} from "./CacheConfig";


export default class BaseCache<E extends BaseCacheEntity<E>> {
    private db: Nedb<E>;

    constructor(config: BaseCacheConfig) {
        this.db = new Nedb<E>({
            filename: config.filename,
            autoload: true,
        });
    }

    /**
     * 插入或新增
     * @param entity
     * @private
     */
    public insertOrUpdate(entity: E): Promise<number> {
        if (entity === undefined) {
            throw 'can not insert or update undefined'
        }
        const query = {
            hash: entity.hash
        }
        const options: Nedb.UpdateOptions = {
            upsert: true,
            multi: true
        }
        return new Promise((resolve, reject) => {
            this.db.update(query, entity, options, (error, num) => {
                if (error !== null) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(`insert or update ${entity}, count: ${num}`);
                    resolve(num);
                }
            })
        });
    }

    /**
     * 删除
     * @param entity
     * @private
     */
    public delete(entity: E): Promise<number> {
        return new Promise((resolve, reject) => {
            this.db.remove({
                hash: entity.hash
            }, {multi: true}, function (error, count) {
                if (error !== null) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log(`delete ${entity}, count: ${count}`);
                    resolve(count)
                }
            })
        })

    }

    public deleteBatch(entities: E[]): Promise<number> {
        if (entities === undefined || entities.length === 0) {
            throw `can not batch delete ${entities}`;
        }
        const query = {
            hash: {
                $in: entities.map(item => item.hash),
            }
        }
        const option: Nedb.RemoveOptions = {
            multi: true
        }
        return new Promise((resolve, reject) => {
            this.db.remove(query, option, (err, count) => {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log(`batch delete ${entities}, count: ${count}`)
                    resolve(count);
                }
            })
        })
    }

    /**
     * 用缓存填充对象
     * @param entity
     */
    public loadCache(entity: E): Promise<E[]> {
        const query = {
            hash: entity.hash
        }
        return new Promise<E[]>((resolve, reject) => {
            this.db.find(query, (err, docs: E[]) => {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve(docs);
                }

            })
        });
    }

    public loadBatch(entities: E[]): Promise<E[]> {
        if (entities === undefined || entities.length === 0) {
            throw `can not batch query ${entities}`
        }
        const query = {
            hash: {
                $in: entities.map(entity => entity.hash),
            }
        }
        return new Promise<E[]>((resolve, reject) => {
            this.db.find(query, (err, docs) => {
                if (err !== null) {
                    console.log(err)
                    reject(err);
                } else {
                    console.log(`batch load ${entities}`);
                    resolve(docs);
                }
            })
        });
    }

    public insertBatch(entities: E[]): Promise<E[]> {
        if (entities === undefined || entities.length === 0) {
            throw `can not batch insert: ${entities}`
        }
        return new Promise((resolve, reject) =>
            this.db.insert(entities, (err, documents) => {
                if (err !== null) {
                    console.log(err);
                    reject(err);
                } else {
                    console.log('insert batch:', entities);
                    resolve(documents);
                }
            }));
    }
}

