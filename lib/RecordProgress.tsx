import {useEffect, useRef} from "react";
import axios from "axios";
import FileT from "./param/FileT";

const RecordProgress = (
    currentTimeState: [number, React.Dispatch<React.SetStateAction<number>>],
    currentVideoFileState: [FileT, React.Dispatch<React.SetStateAction<FileT>>]
) => {
    const [currentVideoFile] = currentVideoFileState;
    const [currentTime] = currentTimeState;
    const lastTime = useRef<number>(0);
    useEffect(() => {
        const now = Date.now() / 1000;
        if ((now - lastTime.current) < 1) {
            return;
        }
        if (currentTime === undefined || currentVideoFile === undefined) {
            return;
        }
        axios.get('/api/updateProgress', {
            params:
                {
                    fileName: currentVideoFile.fileName,
                    progress: currentTime
                }
        });
        lastTime.current = now;
    }, [currentTime]);

};
export default RecordProgress;

