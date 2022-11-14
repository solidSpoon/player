export default function handler(req, res) {
    if (!process.platform === "darwin") {
        res.status(200).json();
    }
    const applescript = require('applescript');
    const word = req.query.str;
    word.replace('"', ' ');
    let script = "tell application \"Bob\"\n" +
        "launch\n" +
        "translate \"{word}\"\n" +
        "end tell";
    word.replace('{word}', word);
    applescript.execString(script, (err, rtn) => {
        if (err) {
            console.log("run apple script error:", err);
        }
        // if (Array.isArray(rtn)) {
        //     for (const songName of rtn) {
        //         console.log(songName);
        //     }
        // }
    });
    res.status(200).json();
}