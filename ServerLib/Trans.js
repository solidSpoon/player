// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getConfig from 'next/config'
import NeDB from "nedb";

class Trans {

    constructor() {
        const {serverRuntimeConfig, publicRuntimeConfig} = getConfig();
        const tencentcloud = require("tencentcloud-sdk-nodejs");
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


    static batchTransExample = {
        test: undefined,
        translate: undefined
    }

    batchTrans(source, callback) {
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
