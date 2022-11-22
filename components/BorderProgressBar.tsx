import ProgressBar from "@ramonak/react-progress-bar";
import {Component} from "react";
import s from './BorderProgressBar.module.css';

interface BorderProgressBarParam {
    getCurrentTime: () => number,
    getTotalTime: () => number
}

interface BorderProgressBarState {
    completed: number

}

export default class BorderProgressBar extends Component<BorderProgressBarParam, BorderProgressBarState> {
    private interval: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.state = {
            completed: 100
        }
    }

    componentDidMount() {
        this.interval = setInterval(this.intervalTask, 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return <div className={s.processBar}>
            < ProgressBar
                completed={this.state.completed}
                transitionDuration={'0.2s'}
                isLabelVisible={false}
                height={'8px'}
                width={'100%'}
            />
        </div>
    }

    private intervalTask = () => {

        const currentTime = this.props.getCurrentTime();
        const totalTime = this.props.getTotalTime();
        if (currentTime === undefined || totalTime === undefined) {
            return 0;
        }
        this.setState({
            completed: (currentTime / totalTime) * 100
        })

    }
}
/*

 */