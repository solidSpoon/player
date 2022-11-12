import React, {Component, Fragment} from 'react';

export default class UploadPhoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitLoading: false,
        }
        this.fileInputEl = React.createRef();
        [this.fileState, this.setFileState] = props.fileState;
        [this.srcUrl, this.setSrcUrl] = props.srcState;
    }

    handlePhoto = async (event) => {
        const files = [...event.target.files];
        if (files.length === 0) return;
        await this.setState({submitLoading: true})

        files.forEach((file, i) => {
            console.log(file);
            const isSrt = file.name.endsWith("srt");
            console.log(file.name + isSrt);
            let url = this.getFileUrl(file);
            if (isSrt) {
                this.setSrcUrl(url);
            } else {
                this.setFileState(url);
            }
        })
    }

    getFileUrl(file) {
        let url = null;
        if (window.createObjectURL !== undefined) {
            url = window.createObjectURL(file)
        } else if (window.URL !== undefined) {
            url = window.URL.createObjectURL(file)
        } else if (window.webkitURL !== undefined) {
            url = window.webkitURL.createObjectURL(file)
        }
        return url;
    }

    render() {
        return (
            <Fragment>
                <input
                    type="file"
                    ref={this.fileInputEl}    //挂载ref
                    accept=".mp4,.srt,.png"    //限制文件类型
                    hidden    //隐藏input
                    onChange={(event) => this.handlePhoto(event)}
                />
                <a
                    onClick={() => {
                        this.fileInputEl.current.click()		//当点击a标签的时候触发事件
                    }}
                    //自己看心情改样式吧
                    style={{
                        height: '39px',
                        lineHeight: '39px',
                    }}
                >上传照片
                </a>
            </Fragment>
        )
    }
}