// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import getConfig from 'next/config'
export default function handler(req, res) {
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()
    const tencentcloud = require("tencentcloud-sdk-nodejs")
    const TmtClient = tencentcloud.tmt.v20180321.Client;
    const clientConfig = {
        credential: {
            secretId: serverRuntimeConfig["secretId"],
            secretKey: serverRuntimeConfig["secretKey"],
        },
        region: "ap-shanghai",
    }
    const client = new TmtClient(clientConfig)
    client.TextTranslateBatch({
            Source: 'en',
            Target: 'zh',
            ProjectId: 0,
            SourceTextList: req.body.str
        }
    ).then(
        (data) => {
            res.status(200).json({
                success: true,
                strs: data.TargetTextList
            })
        },
        (err) => {
            res.status(500).json({
                success: false,
                err: err
            })
        }
    )
}
