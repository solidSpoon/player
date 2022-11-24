class CacheEntity {
    text: string;
    hash: string;
    translate: string;
    addDate: number;

    constructor(text: string = '') {
        this.text = text.trim();
    }
}

export default CacheEntity;
