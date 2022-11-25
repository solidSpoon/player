import BaseCacheEntity from "../basecache/BaseCacheEntity";
import {BaseCacheConfig} from "../basecache/CacheConfig";

export default class TransCacheEntity extends BaseCacheEntity<TransCacheEntity> {
    text: string;
    translate: string;

    constructor(text) {
        super(text);
        this.text = text.trim();
    }

}