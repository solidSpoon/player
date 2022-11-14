import React, {Component, Fragment} from 'react';
import style from './UplodeButtom.module.css'

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
            const isSrt = file.name.endsWith("srt");
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
                    multiple
                    ref={this.fileInputEl}    //挂载ref
                    accept=".mp4,.srt"    //限制文件类型
                    hidden    //隐藏input
                    onChange={(event) => this.handlePhoto(event)}
                />
                <a className={style.button}
                   onClick={() => {
                       this.fileInputEl.current.click()		//当点击a标签的时候触发事件
                   }}
                >

                    <svg t="1668387683085" className="icon" viewBox="0 0 1024 1024" version="1.1"
                         xmlns="http://www.w3.org/2000/svg" p-id="5254" width="200" height="200">
                        <path
                            d="M511.5 957.9C264.9 957.9 65 758.2 65 511.9s199.9-446 446.5-446S958 265.6 958 511.9c0.1 246.3-199.8 446-446.5 446zM509 149.1c-200.4 0-355.8 162.2-355.8 362.3 0 200.1 155.4 356.8 355.8 356.8s362.9-156.7 362.9-356.8c0-200.1-162.5-362.3-362.9-362.3zM690.5 556h-134v133.8c0 24.6-20 44.6-44.6 44.6h-0.1c-24.6 0-44.6-19.9-44.6-44.6V556h-134c-24.7 0-44.6-19.9-44.6-44.5v-0.1c0-24.6 20-44.6 44.6-44.6h134V333c0-24.6 20-44.6 44.6-44.6h0.1c24.7 0 44.6 19.9 44.6 44.6v133.8h134c24.7 0 44.6 19.9 44.6 44.6v0.1c0 24.6-19.9 44.5-44.6 44.5z m0 0"
                            p-id="5255" fill="#6e834c"></path>
                    </svg>

                </a>
            </Fragment>
        )
    }
}