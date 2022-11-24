// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getConfig from 'next/config'
import NeDB from "nedb";
import * as tencentcloud from "tencentcloud-sdk-nodejs";
import {Client} from "tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client";
import {TextTranslateBatchRequest} from "tencentcloud-sdk-nodejs/src/services/tmt/v20180321/tmt_models";
import CacheEntity from "./CacheEntity";

class Trans {
    private client: Client;

    constructor() {
        const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
        // const tencentcloud = require("tencentcloud-sdk-nodejs");
        const TmtClient = tencentcloud.tmt.v20180321.Client;
        const clientConfig = {
            credential: {
                secretId: serverRuntimeConfig["secretId"],
                secretKey: serverRuntimeConfig["secretKey"],
            },
            region: "ap-shanghai",
        }
        this.client = new TmtClient(clientConfig);
    }

    public async batchTrans2(source: CacheEntity[]): Promise<CacheEntity[]> {
        const param = {
            Source: 'en',
            Target: 'zh',
            ProjectId: 0,
            SourceTextList: source.map(item => item.text)
        };
        console.log('do-trans:', param.SourceTextList);

        function fillToSource(data): CacheEntity[] {
            source.forEach((item, index) => {
                item.translate = data.TargetTextList[index];
            })
            return source;
        }

        return this.client.TextTranslateBatch(param)
            .then((data) => fillToSource(data));
    }

    batchTrans(source: CacheEntity[], callback: () => void) {
        console.log('do-trans');
        this.client.TextTranslateBatch({
                Source: 'en',
                Target: 'zh',
                ProjectId: 0,
                SourceTextList: source.map(item => item.text)
            }
        ).then(
            (data) => {
                source.forEach((item, index) => {
                    item.translate = data.TargetTextList[index];
                })
                callback();
            },
            (err) => {
                console.log(err);
            }
        )
    }

}

export default Trans;
