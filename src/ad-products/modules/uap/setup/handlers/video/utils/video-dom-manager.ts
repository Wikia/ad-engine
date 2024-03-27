// @ts-strict-ignore
import { DomManipulator } from '../../manipulators/dom-manipulator';
import { UapParams } from "../../../../utils/universal-ad-package";
import { PorvataPlayer } from "../porvata/porvata-player";
import { UapVideoSize, VideoDomReader } from "./video-dom-reader";

export class VideoDomManager {
    constructor(
        private params: UapParams,
        private manipulator: DomManipulator,
        private reader: VideoDomReader,
    ) {}

    setVideoSizeResolved(video: PorvataPlayer): void {
        if (video.isFullscreen()) {
            return;
        }

        return this.setVideoSize(video, this.reader.getVideoSizeResolved());
    }

    setVideoSizeImpact(video: PorvataPlayer): void {
        if (video.isFullscreen()) {
            return;
        }

        return this.setVideoSize(video, this.reader.getVideoSizeImpact());
    }

    setVideoSizeImpactToResolved(video: PorvataPlayer): void {
        if (video.isFullscreen()) {
            return;
        }

        return this.setVideoSize(video, this.reader.getVideoSizeImpactToResolved());
    }

    private setVideoSize(video: PorvataPlayer, props: UapVideoSize): void {
        video.resize(props.width, props.height);

        const videoOverlay = video.dom.getPlayerContainer().parentElement;
        const thumbnail = this.params.thumbnail;

        this.setProperties(videoOverlay, props);
        this.setProperties(thumbnail, props);
    }

    private setProperties(
        element: HTMLElement,
        { width, height, top, right, bottom }: UapVideoSize,
    ): void {
        this.manipulator.element(element).setProperty('width', `${width}px`);
        this.manipulator.element(element).setProperty('height', `${height}px`);
        if (typeof top === 'number') {
            this.manipulator.element(element).setProperty('top', `${top}%`);
        }
        if (typeof right === 'number') {
            this.manipulator.element(element).setProperty('right', `${right}%`);
        }
        if (typeof bottom === 'number') {
            this.manipulator.element(element).setProperty('bottom', `${bottom}%`);
        }
    }
}
