import {
	AdSlot,
	bidders,
	communicationService,
	context,
	events,
	eventService,
	JWPlayerManager,
	jwpReady,
	playerEvents,
	utils,
} from '@wikia/ad-engine';
// tslint:disable-next-line:no-submodule-imports
import 'jwplayer-fandom/dist/wikiajwplayer.js';
import adContext from '../../context';
import '../../styles.scss';
import * as videoData from './video-data.json';

new JWPlayerManager().manage();

const f15sVideoId = utils.queryString.get('f15s');

context.extend(adContext);
context.set('targeting.artid', utils.queryString.get('force-ad-error') === '1' ? 528 : 355);
context.set('targeting.skin', 'oasis');
context.set('targeting.topics', ['foo', 'bar', 'test']);
context.set('custom.device', utils.client.getDeviceType());
context.set('custom.adLayout', 'article');
context.set('options.tracking.kikimora.player', true);
context.set('bidders.a9.videoEnabled', true);
context.set('bidders.a9.dealsEnabled', true);
context.set('bidders.prebid.enabled', !!utils.queryString.get('wikia_video_adapter'));
context.set('options.video.isMidrollEnabled', utils.queryString.get('midroll') === '1');
context.set('options.video.isPostrollEnabled', utils.queryString.get('postroll') === '1');
context.set('options.video.comscoreJwpTracking', utils.queryString.get('comscore') === '1');
context.set(
	'options.video.adsOnNextVideoFrequency',
	parseInt(utils.queryString.get('capping'), 10) || 3,
);
context.set(
	'options.video.iasTracking.enabled',
	utils.queryString.get('enable_IAS_tracking') === '1',
);

if (f15sVideoId) {
	context.set('options.featuredVideo15sEnabled', true);
	context.set(`options.featuredVideo15sMap.${f15sVideoId}`, 5.0);
}

eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, (eventInfo) => {
	const request = new window.XMLHttpRequest();
	const queryUrl = Object.keys(eventInfo)
		.map((key) => `${key}=${eventInfo[key]}`)
		.join('&');

	request.open('GET', `http://example.com?${queryUrl}`);
	request.send();
});

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

context.set('options.maxDelayTimeout', 1000);

bidders.requestBids().then(() => {
	const playlist = [videoData];
	const playerOptions = {
		autoplay: utils.queryString.get('autoplay') !== '0',
		mute: utils.queryString.get('mute') !== '0',
		settings: {
			showAutoplayToggle: false,
			showQuality: true,
		},
		videoDetails: {
			description: playlist[0].description,
			title: playlist[0].title,
			playlist,
		},
		related: {
			autoplay: true,
			playlistId: 'MGBx1cJh',
			time: 3,
		},
	};

	// @ts-ignore
	window.wikiaJWPlayer('playerContainer', playerOptions, (player) => {
		const options = {
			adProduct: 'featured-video',
			slotName: 'featured',
			audio: !playerOptions.mute,
			autoplay: playerOptions.autoplay,
			featured: true,
			videoId: videoData.mediaid,
		};
		const targeting = {
			plist: '',
			videoTags: [],
			v1: '',
		};
		const playerKey = 'aePlayerKey';

		window[playerKey] = player;
		communicationService.dispatch(jwpReady({ options, playerKey, targeting }));
	});
});

eventService.on(AdSlot.SLOT_STATUS_CHANGED, (adSlot) => {
	console.log(`⛳ ${adSlot.getSlotName()}: %c${adSlot.getStatus()}`, 'font-weight: bold');
});
