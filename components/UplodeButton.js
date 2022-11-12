import React, {Component, Fragment} from 'react';

export default class UploadPhoto extends Component {
    constructor(props) {
        super(props)
        this.state = {
            submitLoading: false,
        }
        this.fileInputEl = React.createRef();
        [this.fileState, this.setFileState] = props.fileState;
    }

    handlePhoto = async (event) => {
        const files = [...event.target.files];
        if (files.length === 0) return;
        await this.setState({submitLoading: true})
        let result = await Promise.all(
            files.map(file => {
                console.log(file)
                let url = null;
                if (window.createObjectURL !== undefined) {
                    url = window.createObjectURL(file)
                } else if (window.URL !== undefined) {
                    url = window.URL.createObjectURL(file)
                } else if (window.webkitURL !== undefined) {
                    url = window.webkitURL.createObjectURL(file)
                }
                return url;
            })
        );
        this.setFileState(result[0])  //现在你就可以根据这个结果做你想做的事了，通过上面的createObjectURL方法处理过，这个result里面的url你是可以直接放到img标签里面的src属性上了，就可以展示出来了。
    }

    render() {
        return (
            <Fragment>
                <input
                    type="file"
                    ref={this.fileInputEl}    //挂载ref
                    accept=".mp4,.jpeg,.png"    //限制文件类型
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