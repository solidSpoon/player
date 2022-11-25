import crypto from "crypto";

export default abstract class BaseCacheEntity<T> {
    readonly hash: string;
    readonly updateTime: number;

    protected constructor(keyProperty: string) {
        this.updateTime = Date.now();
        this.hash = this.calcHash(keyProperty);
    }

    private calcHash(str: string): string {
        return crypto.createHash('md5')
            .update(str.trim())
            .digest("hex");
    }
}