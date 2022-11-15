import axios from "axios";

const TransableSubtLine = (sentense, classNameWord, classNameNotWord) => {
    if (sentense === undefined) {
        return <></>;
    }
    let keyIndex = 0;
    const trans = (str) => {
        axios.get('/api/appleTrans', {params: {str: str}});
    }
    const notWord = (str) => {
        return <span className={classNameNotWord} key={"TransableSubtLine" + (keyIndex++)}>{str}</span>;
    }
    const word = (str) => {
        const t = () => trans(str);
        return <>
            <span
                className={classNameWord}
                key={"TransableSubtLine" + (keyIndex++)}
                onClick={t}
            >
                {str}
            </span>
        </>
    }
    const isWord = (str) => {
        const noWordRegex = /[^A-Za-z0-9\-]/;
        return !noWordRegex.test(str);
    }
    const words = sentense.split(/((?<=.)(?=[^A-Za-z0-9\-]))|((?<=[^A-Za-z0-9\-])(?=.))/);
    return words.map(w => {
        if (isWord(w)) {
            return word(w);
        } else {
            return notWord(w);
        }
    })
}

export default TransableSubtLine;