import { Panel } from './panel';
import { PauseControl } from './pause-control';
import { ToggleFullscreen } from './toggle-fullscreen';
import { VolumeControl } from './volume-control';

export const createBottomPanel = () => {
	return new Panel('bottom-panel dynamic-panel', [PauseControl, VolumeControl, ToggleFullscreen]);
};

export function setup(video, container, uiElements, params): void {
	uiElements.forEach((element) => {
		if (element) {
			element.add(video, container, params);
		}
	});
}
