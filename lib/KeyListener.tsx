import {Dispatch, MutableRefObject, ReactElement, SetStateAction, useState} from "react";
import SentenceT from "./SentenceT";
import ReactPlayer from "react-player";

class KeyListener {
    private currentSubtitle: SentenceT;
    private time: number;
    private setTime: Dispatch<SetStateAction<number>>;
    private text: SentenceT;
    private setText: Dispatch<SetStateAction<SentenceT>>;
    private setJumpTime: Dispatch<SetStateAction<number>>;
    private playing: boolean;
    private playerRef: React.MutableRefObject<ReactPlayer>;

    constructor(
        currentSubtleState: [SentenceT, Dispatch<SetStateAction<SentenceT>>],
        pushTimeState: [number, Dispatch<SetStateAction<number>>],
        jumpTextState: [SentenceT, Dispatch<SetStateAction<SentenceT>>],
        jumpTimeState: [number, Dispatch<SetStateAction<number>>],
        playerRef: MutableRefObject<ReactPlayer>,
        playingState: [boolean, Dispatch<SetStateAction<boolean>>]
    ) {
        [this.currentSubtitle,] = currentSubtleState;
        [this.time, this.setTime] = pushTimeState;
        [this.text, this.setText] = jumpTextState;
        [, this.setJumpTime] = jumpTimeState;
        [this.playing,] = playingState;
        this.playerRef = playerRef;
    }

    private onD = () => {
        this.jumpIfPresent(this.currentSubtitle.getNestItem);
    }
    private onA = () => {
        this.jumpIfPresent(this.currentSubtitle.getPrevItem);
    }

    private onS = () => {
        if (this.currentSubtitle === undefined) {
            return;
        }
        const current: SentenceT = Date.now() - this.time > 1000 ? this.currentSubtitle : this.text;
        this.jump(current);
    }

    public onSpace = () => {
        const htmlVideoElement = document.querySelector('video');
        if (htmlVideoElement === null) {
            return;
        }
        if (this.playing) {
            htmlVideoElement.pause();
        } else {
            htmlVideoElement.play();
        }
    }

    private jumpIfPresent(supplier: () => SentenceT) {
        if (this.currentSubtitle === undefined) {
            return;
        }
        const current = Date.now() - this.time > 1000 ? this.currentSubtitle : this.text;
        const nestItem = supplier();
        const target = nestItem ? nestItem : current;
        this.jump(target);
    }

    private jump(target: SentenceT) {
        this.setTime(Date.now);
        this.setText(target);
        this.setJumpTime(target.timeStart);
        this.playerRef.current.seekTo(target.timeStart, 'seconds');
    }

    public getObj(): { [key: string]: (e: KeyboardEvent) => void } {
        return {
            onA: this.onA,
            onD: this.onD,
            onS: this.onS,
            onLeft: this.onA,
            onRight: this.onD,
            onDown: this.onS,
            onSpace: this.onSpace,
            onUp: this.onSpace,
            onW: this.onSpace
        }

    }
}

export default KeyListener;