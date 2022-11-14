class Cache {
    constructor() {
        const NeDB = require('nedb');
        this.db = new NeDB({
            filename: './db/user3.db',
            autoload: true,
        });
    }

    insert(arr, callback) {
        this.db.insert(arr, function (err, doc) {
            callback(doc);
        })
    }

    batchQuery(arr, callback) {
        this.db.find({
            hash: {
                $in: arr,
            },
        }, function (err, docs) {
            callback(docs);
        })
    }
}
export default Cache;