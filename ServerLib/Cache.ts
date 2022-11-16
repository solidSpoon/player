import CacheEntity from "./CacheEntity";

class Cache {
    private db: any;

    constructor() {
        const NeDB = require('nedb');
        this.db = new NeDB({
            filename: './db/sentence.db',
            autoload: true,
        });
    }

    insert(arr: CacheEntity[], callback: () => void) {
        if (arr == undefined || arr.length === 0) {
            return;
        }
        arr.forEach(item => item.addDate = Date.now());
        this.db.insert(arr, function () {
            callback();
        })
    }

    batchQuery(arr: string[], callback: (entities: CacheEntity[]) => void) {
        this.db.find({
            hash: {
                $in: arr,
            },
        }, function (err, docs) {
            const entities: CacheEntity[] = docs.map(doc => Cache.mapToEntity(doc));
            callback(entities);
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