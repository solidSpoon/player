export default function handler(req, res) {
    if (process.platform !== "darwin") {
        res.status(200).json();
        return;
    }
    const applescript = require('applescript');
    let word: string = req.query.str;
    word = word.replace('"', ' ');
    let script: string = "tell application \"Bob\"\n" +
        "launch\n" +
        "translate \"{word}\"\n" +
        "end tell";
    script = script.replace('{word}', word);
    applescript.execString(script, (err, rtn) => {
        if (err) {
            console.log("run apple script error:", err);
        }
    });
    res.status(200).json();
}