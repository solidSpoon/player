// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    console.log(req);
// 导入对应产品模块的client models。
    const tencentcloud = require("tencentcloud-sdk-nodejs")
    const TmtClient = tencentcloud.tmt.v20180321.Client;
    const clientConfig = {
        credential: {
            secretId: "AKIDMaaKo34tVt3zg8LQCiz0nLejcIjvsZ0B",
            secretKey: "1oMglbCYgbIkxvd5Hn58vSjkUyFJ8i27",
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
