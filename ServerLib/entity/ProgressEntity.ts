import BaseCacheEntity from "../basecache/BaseCacheEntity";

class ProgressEntity extends BaseCacheEntity<ProgressEntity> {
    fileName: string;
    progress: number;

    constructor(fileName: string) {
        super(fileName);
        this.fileName = fileName.trim();
    }
}

export default ProgressEntity;
