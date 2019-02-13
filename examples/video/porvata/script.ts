import {
	AdSlot,
	context,
	events,
	Porvata,
	scrollListener,
	slotService,
	utils,
} from '@wikia/ad-engine';
import { porvataTracker } from '@wikia/ad-products';
import adContext from '../../context';

const blockOutOfViewportPausing = utils.queryString.get('block_pausing') === '1';
const container = document.getElementById('player');
const params = {
	adProduct: 'test-video',
	autoPlay: utils.queryString.get('autoplay') !== '0',
	blockOutOfViewportPausing,
	container,
	width: 300,
	height: 250,
	slotName: 'outstream',
};
const playerCloseButton = document.getElementById('player-close');
const playerFullscreenButton = document.getElementById('player-fullscreen');
const playerMuteButton = document.getElementById('player-mute');
const playerResumePlayButton = document.getElementById('player-play-pause');
const playerUnmuteButton = document.getElementById('player-unmute');

if (blockOutOfViewportPausing) {
	console.warn('🎬 Block out of viewport pausing enabled');
}

context.extend(adContext);
context.set('targeting.artid', 292);
context.set('targeting.vertical', 'games');
context.set('targeting.wpage', '100% Orange Juice');
context.set('custom.device', utils.client.getDeviceType());
context.set('custom.adLayout', 'article');

slotService.add(new AdSlot({ id: 'outstream' }));

context.set('options.tracking.kikimora.player', true);
porvataTracker.register();

events.on(events.VIDEO_PLAYER_TRACKING_EVENT, (eventInfo) => {
	const request = new window.XMLHttpRequest();
	const queryUrl = Object.keys(eventInfo)
		.map((key) => `${key}=${eventInfo[key]}`)
		.join('&');

	request.open('GET', `http://example.com?${queryUrl}`);
	request.send();
});

scrollListener.init();
Porvata.inject(params).then((_video) => {
	const player = document.querySelector('.video-player');

	_video.addEventListener('loaded', () => {
		player.classList.remove('hide');
		document.querySelector('.controls').classList.remove('hide');
		if (_video.params.autoPlay) {
			playerMuteButton.classList.add('hide');
			playerUnmuteButton.classList.remove('hide');
		} else {
			playerMuteButton.classList.remove('hide');
			playerUnmuteButton.classList.add('hide');
		}
	});
	_video.addEventListener('wikiaAdCompleted', () => {
		player.classList.add('hide');
		document.querySelector('.controls').classList.add('hide');
		_video.reload();
	});
	container.addEventListener('click', () => {
		_video.play();
	});
	playerCloseButton.addEventListener('click', () => {
		_video.stop();
	});
	playerUnmuteButton.addEventListener('click', () => {
		_video.unmute();
		playerMuteButton.classList.remove('hide');
		playerUnmuteButton.classList.add('hide');
	});
	playerMuteButton.addEventListener('click', () => {
		_video.mute();
		playerMuteButton.classList.add('hide');
		playerUnmuteButton.classList.remove('hide');
	});
	playerFullscreenButton.addEventListener('click', () => {
		_video.toggleFullscreen();
	});
	playerResumePlayButton.addEventListener('click', () => {
		if (_video.isPlaying()) {
			_video.pause();
		} else {
			_video.resume();
		}
	});
});
