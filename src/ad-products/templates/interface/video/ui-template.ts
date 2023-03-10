import { PorvataSettings } from '../../../video/porvata/porvata-settings';
import { UapParams, UapVideoSettings } from '../../uap';
import { CloseButton } from './close-button';
import { DynamicReveal } from './dynamic-reveal';
import { Floating } from './floating';
import { LearnMore } from './learn-more';
import { Panel } from './panel';
import { PauseControl } from './pause-control';
import { PauseOverlay } from './pause-overlay';
import { PlayerOverlay } from './player-overlay';
import { ProgressBar } from './progress-bar';
import { ToggleAnimation } from './toggle-animation';
import { ToggleFullscreen } from './toggle-fullscreen';
import { ToggleThumbnail } from './toggle-thumbnail';
import { ToggleUI } from './toggle-ui';
import { ToggleVideo } from './toggle-video';
import { VolumeControl } from './volume-control';

export const createBottomPanel = ({ fullscreenAllowed = true, theme = null }) => {
	const isHiVi = theme === 'hivi';
	let panelClassName = 'bottom-panel';

	if (isHiVi) {
		panelClassName += ' dynamic-panel';
	}

	return new Panel(panelClassName, [
		isHiVi ? PauseControl : null,
		VolumeControl,
		isHiVi && fullscreenAllowed ? ToggleFullscreen : null,
	]);
};

const getTemplates = (params, videoSettings?: PorvataSettings | UapVideoSettings) => {
	const isAutoPlay: boolean = videoSettings ? videoSettings.isAutoPlay() : params.isAutoPlay;

	return {
		'auto-play': [ProgressBar, PauseOverlay, createBottomPanel(params), ToggleAnimation],
		default: [ProgressBar, PauseOverlay, createBottomPanel(params), CloseButton, ToggleAnimation],
		'split-left': [
			ProgressBar,
			PauseOverlay,
			createBottomPanel(params),
			ToggleVideo,
			PlayerOverlay,
			!isAutoPlay ? CloseButton : null,
		],
		'split-right': [
			ProgressBar,
			PauseOverlay,
			createBottomPanel(params),
			ToggleVideo,
			PlayerOverlay,
			!isAutoPlay ? CloseButton : null,
		],
		hivi: [
			ProgressBar,
			createBottomPanel(params),
			params.videoPlaceholderElement ? ToggleVideo : ToggleAnimation,
			ToggleThumbnail,
			ToggleUI,
			LearnMore,
			params.videoPlaceholderElement ? PlayerOverlay : null,
		],
		'outstream-incontent': [DynamicReveal, Floating, ProgressBar, VolumeControl],
	};
};

export function selectTemplate(
	videoSettings: PorvataSettings | UapVideoSettings,
	params?: Partial<UapParams>,
): [any] {
	const videoParams = params || videoSettings.getParams();
	const templates = getTemplates(videoParams, videoSettings);
	let template = 'default';

	if (videoParams.type && videoParams.type.indexOf('porvata') === 0) {
		template = 'outstream-incontent';
	} else if (videoParams.theme === 'hivi') {
		template = 'hivi';
	} else if ((videoSettings as UapVideoSettings).isSplitLayout()) {
		template = videoParams.splitLayoutVideoPosition === 'right' ? 'split-right' : 'split-left';
	} else if (videoSettings.isAutoPlay()) {
		template = 'auto-play';
	}

	return templates[template];
}
