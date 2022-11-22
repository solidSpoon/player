import {Component} from "react";
import Keyevent from "react-keyevent";

export enum JumpPosition {
    BEFORE = 0,
    AFTER = 1,
    CURRENT = 2
}

interface ReactParam {
    children?: React.ReactNode;
}

interface GlobalShortCutParam extends ReactParam {
    onJumpTo: (position: JumpPosition) => void;
    onSpace: () => void;
}

export default class GlobalShortCut extends Component<GlobalShortCutParam, any> {
    constructor(props) {
        super(props);
    }

    public onA = () => {
        this.props.onJumpTo(JumpPosition.BEFORE);
    }

    public onD = () => {
        this.props.onJumpTo(JumpPosition.AFTER);
    }

    public onS = () => {
        this.props.onJumpTo(JumpPosition.CURRENT);
    }

    public onLeft = () => {
        this.props.onJumpTo(JumpPosition.BEFORE);
    }

    public onRight = () => {
        this.props.onJumpTo(JumpPosition.AFTER);
    }

    public onDown = () => {
        this.props.onJumpTo(JumpPosition.CURRENT);
    }

    public onSpace = () => {
        this.props.onSpace();
    }

    public onUp = () => {
        this.props.onSpace();
    }

    public onW = () => {
        this.props.onSpace();
    }

    render() {
        return (
            <Keyevent
                className="TopSide"
                events={{
                    onA: this.onA,
                    onD: this.onD,
                    onS: this.onS,
                    onLeft: this.onLeft,
                    onRight: this.onRight,
                    onDown: this.onDown,
                    onSpace: this.onSpace,
                    onUp: this.onUp,
                    onW: this.onW
                }}
                needFocusing={true}
            >
                {this.props.children}
            </Keyevent>

        )
    }
}