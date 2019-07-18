import { AdEngine, bidders, context, events, eventService, utils } from '@wikia/ad-engine';
import { biddersDelay } from './bidders/bidders-delay';
import { adsSetup } from './setup';
import { hideAllAdSlots } from './templates/hide-all-ad-slots';
import { PageTracker } from './tracking/page-tracker';
import { editModeManager } from './utils/edit-mode-manager';
import { babDetection } from './wad/bab-detection';

const GPT_LIBRARY_URL = '//www.googletagservices.com/tag/js/gpt.js';
const logGroup = 'ad-engine';

export async function setupAdEngine(isOptedIn): Promise<void> {
	const wikiContext = window.mw ? window.mw.config.values : {};

	await adsSetup.configure(wikiContext, isOptedIn);

	// ToDo: video and recovery

	context.push('delayModules', babDetection);
	context.push('delayModules', biddersDelay);

	eventService.on(events.AD_SLOT_CREATED, (slot) => {
		utils.logger(logGroup, `Created ad slot ${slot.getSlotName()}`);
		bidders.updateSlotTargeting(slot.getSlotName());
	});

	if (context.get('state.showAds')) {
		editModeManager.onActivate(() => hideAllAdSlots());
		callExternals();
		startAdEngine();
	} else {
		hideAllAdSlots();
	}

	trackLabradorValues();
}

function startAdEngine(): void {
	utils.scriptLoader.loadScript(GPT_LIBRARY_URL);

	const engine = new AdEngine();

	engine.init();
	babDetection.run();

	context.push('listeners.slot', {
		onRenderEnded: (slot) => {
			slot.getElement().classList.remove('default-height');
		},
	});

	context.push('state.adStack', { id: 'cdm-zone-01' });
	context.push('state.adStack', { id: 'cdm-zone-02' });
	context.push('state.adStack', { id: 'cdm-zone-03' });
	context.push('state.adStack', { id: 'cdm-zone-04' });
	context.push('state.adStack', { id: 'cdm-zone-06' });
}

function trackLabradorValues(): void {
	const labradorPropValue = utils.geoService.getSamplingResults().join(';');

	if (labradorPropValue) {
		PageTracker.trackProp('labrador', labradorPropValue);
	}
}

function callExternals(): void {
	bidders.requestBids({
		responseListener: biddersDelay.markAsReady,
	});

	// ToDo: other externals
}

function waitForBiddersResolve(): Promise<void | {}> {
	if (!context.get('state.showAds')) {
		return Promise.resolve();
	}

	const timeout = new Promise((resolve) => {
		setTimeout(resolve, context.get('options.maxDelayTimeout'));
	});

	return Promise.race([timeout, biddersDelay.getPromise()]);
}

function waitForAdStackResolve(): Promise<(void | {})[]> {
	return Promise.all([waitForBiddersResolve()]);
}
