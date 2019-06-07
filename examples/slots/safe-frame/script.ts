import { bidders } from '@wikia/ad-bidders';
import {
	AdEngine,
	context,
	DelayModule,
	events,
	eventService,
	templateService,
} from '@wikia/ad-engine';
import { FloorAdhesion, setupNpaContext } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '173';
customContext.slots.floor_adhesion.forceSafeFrame = true;

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
