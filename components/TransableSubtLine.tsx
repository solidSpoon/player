import axios from "axios";
import {ReactElement} from "react";

const TransableSubtLine = (sentence: string, classNameWord: string, classNameNotWord: string) => {
    if (sentence === undefined) {
        return <></>;
    }
    let keyIndex = 0;
    const trans = (str: string): void => {
        axios.get('/api/appleTrans', {params: {str: str}});
    }
    const notWord = (str: string): ReactElement => {
        return <span className={classNameNotWord} key={"TransableSubtLine" + (keyIndex++)}>{str}</span>;
    }
    const word = (str: string): ReactElement => {
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
    const isWord = (str: string): boolean => {
        const noWordRegex = /[^A-Za-z0-9\-]/;
        return !noWordRegex.test(str);
    }
    const words: string[] = sentence.split(/((?<=.)(?=[^A-Za-z0-9\-]))|((?<=[^A-Za-z0-9\-])(?=.))/);
    return words.map(w => {
        if (isWord(w)) {
            return word(w);
        } else {
            return notWord(w);
        }
    })
}

export default TransableSubtLine;