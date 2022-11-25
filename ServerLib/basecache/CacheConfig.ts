export interface BaseCacheConfig {
    filename: string,
}

export default class CacheConfig {
    public static transConfig: BaseCacheConfig = {
        filename: './db/sentence.db'
    }
    public static progressConfig: BaseCacheConfig = {
        filename: './db/progress.db'
    }
}