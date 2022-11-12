/**
 * 把 SRT 格式的字幕文件解析为字幕的对象数组，格式为:
 * [
 *      {sn: "0", startTime: 0.89, endTime: 7.89, content: "这里是一系列与Hadoop↵有关的其他开源项目："},
 *      {sn: "1", startTime: 8.38, endTime: 14.85, content: "Eclipse是一个IBM贡献到开源社区里的集成开发环境（IDE）。"}
 * ]
 *
 * @param  string srt 字幕文件的内容
 * @return 字幕的对象数组
 */
export default function parseSrtSubtitles(srt) {
    var subtitles = [];
    var textSubtitles = srt.split(/\r?\n\r?\n/); // 每条字幕的信息，包含了序号，时间，字幕内容
    for (var i = 0; i < textSubtitles.length; ++i) {
        var textSubtitle = textSubtitles[i].split(/\r?\n/);

        if (textSubtitle.length >= 2) {
            var sn = textSubtitle[0]; // 字幕的序号
            var startTime = toSeconds(textSubtitle[1].split(' --> ')[0].trim()); // 字幕的开始时间
            var endTime = toSeconds(textSubtitle[1].split(' --> ')[1].trim()); // 字幕的结束时间
            var content = textSubtitle[2]; // 字幕的内容

            // 字幕可能有多行
            if (textSubtitle.length > 2) {
                for (var j = 3; j < textSubtitle.length; j++) {
                    content += '\n' + textSubtitle[j];
                }
            }

            // 字幕对象
            var subtitle = {
                key: sn,
                sn: sn,
                timeStart: startTime,
                timeEnd: endTime,
                text: content
            };

            subtitles.push(subtitle);
        }
    }

    return subtitles;
}

/**
 * 把字符串格式的字幕时间转换为浮点数
 *
 * @param  string t 字符串格式的时间
 * @return 浮点数格式的时间
 */
function toSeconds(t) {
    var s = 0.0;

    if (t) {
        var p = t.split(':');
        let i;
        for (i = 0; i < p.length; i++) {
            s = s * 60 + parseFloat(p[i].replace(',', '.'));
        }
    }

    return s;
}