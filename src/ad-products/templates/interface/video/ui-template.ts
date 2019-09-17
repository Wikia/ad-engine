import { VideoSettings } from '../../../video/player/porvata/video-settings';
import { UapVideoSettings } from '../../uap/uap-video-settings';
import CloseButton from './close-button';
import DynamicReveal from './dynamic-reveal';
import Floating from './floating';
import LearnMore from './learn-more';
import { Panel } from './panel';
import PauseControl from './pause-control';
import PauseOverlay from './pause-overlay';
import ProgressBar from './progress-bar';
import ReplayOverlay from './replay-overlay';
import ToggleAnimation from './toggle-animation';
import ToggleFullscreen from './toggle-fullscreen';
import ToggleThumbnail from './toggle-thumbnail';
import ToggleUI from './toggle-ui';
import ToggleVideo from './toggle-video';
import VolumeControl from './volume-control';

const createBottomPanel = ({ fullscreenAllowed = true, theme = null }) => {
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

const getTemplates = (params, videoSettings) => ({
	'auto-play': [ProgressBar, PauseOverlay, createBottomPanel(params), ToggleAnimation],
	default: [ProgressBar, PauseOverlay, createBottomPanel(params), CloseButton, ToggleAnimation],
	'split-left': [
		ProgressBar,
		PauseOverlay,
		createBottomPanel(params),
		ToggleVideo,
		ReplayOverlay,
		!videoSettings.isAutoPlay() ? CloseButton : null,
	],
	'split-right': [
		ProgressBar,
		PauseOverlay,
		createBottomPanel(params),
		ToggleVideo,
		ReplayOverlay,
		!videoSettings.isAutoPlay() ? CloseButton : null,
	],
	hivi: [
		ProgressBar,
		createBottomPanel(params),
		params.videoPlaceholderElement ? ToggleVideo : ToggleAnimation,
		ToggleThumbnail,
		ToggleUI,
		LearnMore,
		params.videoPlaceholderElement ? ReplayOverlay : null,
	],
	'outstream-incontent': [DynamicReveal, Floating, ProgressBar, VolumeControl],
});

export function selectTemplate(videoSettings: VideoSettings | UapVideoSettings) {
	const params = videoSettings.getParams();
	const templates = getTemplates(params, videoSettings);
	let template = 'default';

	if (params.type && params.type.indexOf('porvata') === 0) {
		template = 'outstream-incontent';
	} else if (params.theme === 'hivi') {
		template = 'hivi';
	} else if ((videoSettings as UapVideoSettings).isSplitLayout()) {
		template = params.splitLayoutVideoPosition === 'right' ? 'split-right' : 'split-left';
	} else if (videoSettings.isAutoPlay()) {
		template = 'auto-play';
	}

	return templates[template];
}
