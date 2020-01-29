import {
	AdEngine,
	AdSlot,
	bidders,
	billTheLizard,
	btfBlockerService,
	cmp,
	context,
	DelayModule,
	events,
	eventService,
	slotService,
	utils,
} from '@wikia/ad-engine';
import adContext from '../../context';

const contentTemplate = document.querySelector('.content-template').innerHTML;
const mainContainer = document.getElementById('main-container');
const limit = utils.queryString.get('limit') || null;
const contentLength = utils.queryString.get('content_length') || 1;
const enabledProjects = utils.queryString.get('enabled-project');
const optIn = utils.queryString.get('tracking-opt-in-status') !== '0';

function loadContent() {
	const newContent = document.createElement('div');

	newContent.innerHTML = contentTemplate;

	mainContainer.appendChild(newContent);
}

cmp.override((cmd, param, cb) => {
	if (cmd === 'getConsentData') {
		cb(
			{
				consentData: optIn
					? 'BOQu5jyOQu5jyCNABAPLBR-AAAAeCAFgAUABYAIAAaABFACY'
					: 'BOQu5naOQu5naCNABAPLBRAAAAAeCAAA',
				gdprApplies: true,
				hasGlobalScope: false,
			},
			true,
		);
	} else if (cmd === 'getVendorConsents') {
		cb(
			{
				metadata: 'BOQu5naOQu5naCNABAAABRAAAAAAAA',
				purposeConsents: Array.from({ length: 5 }).reduce<ConsentData['purposeConsents']>(
					(map, val, i) => ({ ...map, [i + 1]: optIn }),
					{},
				),
				vendorConsents: Array.from({ length: 500 }).reduce<ConsentData['vendorConsents']>(
					(map, val, i) => ({ ...map, [i + 1]: optIn }),
					{},
				),
			},
			true,
		);
	} else {
		cb(null, false);
	}
});

context.extend(adContext);
context.set('slots.repeatable_boxad_1.repeat.limit', limit);

eventService.on(AdSlot.SLOT_STATUS_CHANGED, async (adSlot) => {
	const slotName = adSlot.getSlotName();
	const realSlotPrices = bidders.getDfpSlotPrices(slotName);
	const currentSlotPrices = await bidders.getCurrentSlotPrices(slotName);

	function transformBidderPrice(bidderName) {
		if (realSlotPrices && realSlotPrices[bidderName]) {
			return realSlotPrices[bidderName];
		}

		if (currentSlotPrices && currentSlotPrices[bidderName]) {
			return `${currentSlotPrices[bidderName]}not_used`;
		}

		return '';
	}

	const price = transformBidderPrice('wikia');

	if (price) {
		console.log(`⛳ ${slotName}: wikia adapter price is %c$${price}`, 'font-weight: bold');
	} else {
		console.log(`⛳ ${slotName}: wikia adapter responded %ctoo late`, 'font-weight: bold');
	}
});

if (enabledProjects) {
	enabledProjects.split(',').forEach((name) => billTheLizard.projectsHandler.enable(name));

	billTheLizard.executor.register('logResult', (model, prediction) => {
		console.log(`🦎 %c${model.name}`, 'font-weight: bold', `predicted ${prediction}`);
	});

	billTheLizard.executor.register('catlapse', () => {
		const slots = document.querySelectorAll('.repeatable-boxad');

		if (slots.length > 0) {
			const slot = slots[slots.length - 1];

			slotService.disable(slot.id, 'catlapsed');
		}
	});

	context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', () => {
		billTheLizard.call(['cheshirecat'], null);
	});
}

for (let i = 0; i < contentLength; i += 1) {
	loadContent();
}

let resolveBidders;

const biddersDelay: DelayModule = {
	isEnabled: () => true,
	getName: () => 'bidders-delay',
	getPromise: () =>
		new Promise((resolve) => {
			resolveBidders = resolve;
		}),
};

context.set('targeting.artid', '266');
context.set('options.maxDelayTimeout', 1000);
context.push('delayModules', biddersDelay);

bidders.requestBids({
	responseListener: () => {
		if (bidders.hasAllResponses()) {
			if (resolveBidders) {
				resolveBidders();
				resolveBidders = null;
			}
		}
	},
});

bidders.runOnBiddingReady(() => {
	console.log('⛳ Prebid bidding completed');
});

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init();

btfBlockerService.finishFirstCall();

window.adsQueue.push({
	id: 'repeatable_boxad_1',
});

document.getElementById('requestBids').addEventListener('click', () => {
	bidders.requestBids({});
});
