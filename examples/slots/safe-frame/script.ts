import {
	AdEngine,
	bidders,
	clickPositionTracker,
	context,
	DelayModule,
	events,
	eventService,
	FloorAdhesion,
	setupNpaContext,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '173';
customContext.slots.floor_adhesion.forceSafeFrame = true;
customContext.slots.floor_adhesion.clickPositionTracking = true;

context.extend(customContext);

templateService.register(FloorAdhesion);

setupNpaContext();

let resolveBidders;

const biddersDelay: DelayModule = {
	isEnabled: () => true,
	getName: () => 'bidders-delay',
	getPromise: () =>
		new Promise((resolve) => {
			resolveBidders = resolve;
		}),
};

function registerClickPositionTracker() {
	clickPositionTracker.register(
		(data) => console.log(['🖱️ click on: ', data.label]),
		'floor_adhesion',
	);
}

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

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init();

registerClickPositionTracker();
