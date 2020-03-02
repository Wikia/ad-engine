import {
	AdEngine,
	AdSlot,
	bidders,
	context,
	events,
	eventService,
	fillerService,
	playerEvents,
	PorvataFiller,
	PorvataTemplate,
	porvataTracker,
	slotService,
	templateService,
	utils,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

const sendAllBidsEnabled = utils.queryString.get('send_all_bids') === '1';

context.extend(customContext);

context.set('targeting.artid', '503');
context.set('slots.incontent_boxad.disabled', false);
context.set('options.tracking.kikimora.player', true);
context.set('bidders.prebid.sendAllBids', sendAllBidsEnabled);

if (utils.queryString.get('porvata-direct') === '1') {
	context.set('slots.incontent_player.customFiller', 'porvata');
}

eventService.on(AdSlot.SLOT_STATUS_CHANGED, (adSlot) => {
	console.log(`⛳ ${adSlot.getSlotName()}: %c${adSlot.getStatus()}`, 'font-weight: bold');
});

context.push('listeners.porvata', {
	onEvent: (eventName) => {
		console.log(`🎬 Porvata: %c${eventName}`, 'font-weight: bold');
		if (utils.queryString.get('force-empty-response') === '1') {
			context.remove('targeting.artid');
		}
	},
});

context.set('options.maxDelayTimeout', 1000);

const biddersInhibitor = bidders.requestBids();

templateService.register(PorvataTemplate, {
	isFloatingEnabled: utils.queryString.get('floating') !== '0',
	inViewportOffsetTop: 58,
});

fillerService.register(new PorvataFiller());

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

eventService.on(playerEvents.VIDEO_PLAYER_TRACKING_EVENT, (eventInfo) => {
	const request = new window.XMLHttpRequest();
	const queryUrl = Object.keys(eventInfo)
		.map((key) => `${key}=${eventInfo[key]}`)
		.join('&');

	request.open('GET', `http://example.com?${queryUrl}`);
	request.send();
});

porvataTracker.register();

document.addEventListener('keydown', (event) => {
	if (event.key === 'd') {
		const adSlot = slotService.get('incontent_player');
		slotService.remove(adSlot);
	}
});

new AdEngine().init([biddersInhibitor]);
