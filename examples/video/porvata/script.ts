import {
	AdSlot,
	context,
	eventService,
	playerEvents,
	Porvata,
	porvataTracker,
	scrollListener,
	slotService,
	utils,
} from '@wikia/ad-engine';
import adContext from '../../context';
import '../../styles.scss';

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

if (blockOutOfViewportPausing) {
	console.warn('🎬 Block out of viewport pausing enabled');
}

context.extend(adContext);
context.set(
	'options.video.iasTracking.enabled',
	utils.queryString.get('enable_IAS_tracking') === '1',
);
context.set('targeting.artid', 292);
context.set('targeting.vertical', 'games');
context.set('targeting.wpage', '100% Orange Juice');
context.set('custom.device', utils.client.getDeviceType());
context.set('custom.adLayout', 'article');
context.set('options.tracking.kikimora.player', true);

slotService.add(new AdSlot({ id: 'outstream' }));

porvataTracker.register();

eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, (eventInfo) => {
	const request = new window.XMLHttpRequest();
	const queryUrl = Object.keys(eventInfo)
		.map((key) => `${key}=${eventInfo[key]}`)
		.join('&');

	request.open('GET', `http://example.com?${queryUrl}`);
	request.send();
});

scrollListener.init();
Porvata.inject(params as any).then((player) => {
	(window as any).porvataPlayer = player;

	player.dom.getInterfaceContainer().innerHTML = document.getElementById(
		'controls-template',
	).innerHTML;

	const playerCloseButton = document.getElementById('player-close');
	const playerFullscreenButton = document.getElementById('player-fullscreen');
	const playerMuteButton = document.getElementById('player-mute');
	const playerResumePlayButton = document.getElementById('player-play-pause');
	const playerUnmuteButton = document.getElementById('player-unmute');

	player.addEventListener('loaded', () => {
		player.dom.getVideoContainer().classList.remove('hide');
		if (player.settings.isAutoPlay()) {
			playerMuteButton.classList.add('hide');
			playerUnmuteButton.classList.remove('hide');
		} else {
			playerMuteButton.classList.remove('hide');
			playerUnmuteButton.classList.add('hide');
		}
	});
	player.addEventListener('wikiaAdCompleted', () => {
		player.dom.getVideoContainer().classList.add('hide');
		player.reload();
	});

	container.addEventListener('click', () => {
		if (player.dom.getVideoContainer().classList.contains('hide')) {
			player.play();
		}
	});
	playerCloseButton.addEventListener('click', () => {
		player.stop();
	});
	playerUnmuteButton.addEventListener('click', () => {
		player.unmute();
		playerMuteButton.classList.remove('hide');
		playerUnmuteButton.classList.add('hide');
	});
	playerMuteButton.addEventListener('click', () => {
		player.mute();
		playerMuteButton.classList.add('hide');
		playerUnmuteButton.classList.remove('hide');
	});
	playerFullscreenButton.addEventListener('click', () => {
		player.toggleFullscreen();
	});
	playerResumePlayButton.addEventListener('click', () => {
		if (player.isPlaying()) {
			player.pause();
		} else {
			player.resume();
		}
	});
});
