import applescript from 'applescript';

/**
 * 调用 Bob 翻译
 * @param req
 * @param res
 */
export default function handler(req, res) {
    if (process.platform !== "darwin") {
        res.status(200).json();
        return;
    }

    let word: string = req.query.str;
    word = word.replace('"', ' ');
    let script: string = 'tell application "Bob"\n' +
        "launch\n" +
        `translate "${word}"\n` +
        "end tell";

    applescript.execString(script, (err, rtn) => {
        if (err) {
            console.log("run apple script error:", err);
        }
    });
    res.status(200).json();
}