import FileT from "./FileT";

class UploadPhotoParam {
    videoFileState: [FileT, React.Dispatch<React.SetStateAction<FileT>>];
    srcFileState: [FileT, React.Dispatch<React.SetStateAction<FileT>>];
}
export default UploadPhotoParam;