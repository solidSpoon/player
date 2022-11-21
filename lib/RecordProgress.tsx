import {Component, useEffect, useRef} from "react";
import axios from "axios";
import FileT from "./param/FileT";

interface RecordProgressParam {
    getCurrentProgress: () => number;
    getCurrentVideoFile: () => FileT;
}

const RecordProgress = (props: RecordProgressParam) => {
    useEffect(() => {
        function method() {
            if (props.getCurrentVideoFile() === undefined || props.getCurrentProgress() === undefined) {
                return;
            }
            const fileName = props.getCurrentVideoFile().fileName;
            const progress = props.getCurrentProgress();
            console.log(fileName, progress)
            axios.get('/api/updateProgress', {
                params:
                    {
                        fileName: fileName,
                        progress: progress
                    }
            });
        }

        const interval = setInterval(method,1000);
        return () => {
            clearInterval(interval);
        }
    }, []);

};
export default RecordProgress;

