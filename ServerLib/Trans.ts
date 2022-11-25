// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getConfig from 'next/config'
import * as tencentcloud from "tencentcloud-sdk-nodejs";
import {Client} from "tencentcloud-sdk-nodejs/tencentcloud/services/tmt/v20180321/tmt_client";
import CacheEntity from "./CacheEntity";

class Trans {
    private static client: Client;

    static {
        const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
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

    public static async batchTrans(source: CacheEntity[]): Promise<CacheEntity[]> {
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

}

export default Trans;
