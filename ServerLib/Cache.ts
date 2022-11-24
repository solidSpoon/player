import CacheEntity from "./CacheEntity";
import Nedb from "nedb"
import crypto from "crypto";
import {string} from "prop-types";

class Cache {
    private db: Nedb<CacheEntity>;

    constructor() {
        this.db = new Nedb<CacheEntity>({
            filename: './db/sentence.db',
            autoload: true,
        });
    }

    public hash(str: string): string {
        return crypto.createHash('md5').update(str).digest("hex");
    }

    public async insert(arr: CacheEntity[]): Promise<CacheEntity[]> {
        if (arr == undefined || arr.length === 0) {
            return [];
        }
        return await this.insertBatch(arr);
    }

    public async getCache(texts: string[]): Promise<CacheEntity[]> {
        if (texts === undefined || texts.length === 0) {
            return [];
        }
        const queryResult: CacheEntity[] = await this.queryBatch(texts);
        const repeat: CacheEntity[] = this.findRepeat(queryResult);
        if (repeat.length === 0) {
            return queryResult;
        }
        console.log('translate cache find repeat', repeat);
        await this.deleteBatch(repeat.map(item => item.hash));
        await this.insertBatch(repeat);
        return queryResult;
    }

    private findRepeat(queryResult: CacheEntity[]): CacheEntity[] {
        const map = new Map<string, number>();
        // queryResult.forEach(item => map.set(item.hash, 0));
        queryResult.forEach(item => map.set(item.hash, (map.get(item.hash) ?? 0) + 1));
        const toRemoveHash: string[] = [];
        // map.forEach((value, key) => console.log(key, value));
        map.forEach((value, key) => {
            if (value > 1) {
                console.log(key, value)
                toRemoveHash.push(key);
            }
        })
        return toRemoveHash.map(hash => queryResult.find(result => result.hash === hash));
    }

    private queryBatch(texts: string[]): Promise<CacheEntity[]> {
        if (texts === undefined || texts.length === 0) {
            return Promise.resolve([]);
        }
        const hashes = texts.map(text => this.hash(text))
        return new Promise<CacheEntity[]>((resolve, reject) => {
            this.db.find({
                hash: {
                    $in: hashes,
                }
            }, function (err, docs) {
                const entities: CacheEntity[] = docs.map(doc => Cache.mapToEntity(doc));
                resolve(entities);
            })
        });
    }

    private insertBatch(entities: CacheEntity[]): Promise<CacheEntity[]> {
        if (entities == undefined || entities.length === 0) {
            return Promise.resolve([]);
        }
        entities.forEach(item => {
            item.addDate = Date.now();
            item.hash = this.hash(item.text)
        });
        console.log('insert:', entities);
        return new Promise((resolve, reject) =>
            this.db.insert(entities, (err) => {
                if (err !== null) {
                    reject(err);
                } else {
                    console.log(err);
                    resolve(entities);
                }
            }));
    }

    private deleteBatch(hashes: string[]): Promise<number> {
        console.log('delete batch', hashes);
        const query = {
            hash: {
                $in: hashes,
            }
        }
        return new Promise((resolve, reject) => {
            this.db.remove(query, {
                multi:true
            },(err,n) => {
                console.log('删除数据',n);
                resolve(n);
            })
        })
    }

    static mapToEntity(doc: any): CacheEntity {
        const entity = new CacheEntity();
        entity.hash = doc["hash"];
        entity.translate = doc["translate"];
        entity.text = doc["text"];
        return entity;
    }
}

export default Cache;