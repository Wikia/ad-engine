import {
	AdEngine,
	bidders,
	clickPositionTracker,
	context,
	events,
	eventService,
	FloorAdhesion,
	setupNpaContext,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('targeting.artid', '173');
context.set('slots.floor_adhesion.forceSafeFrame', true);
context.set('slots.floor_adhesion.clickPositionTracking', true);

templateService.register(FloorAdhesion);

setupNpaContext();

function registerClickPositionTracker() {
	clickPositionTracker.register(
		(data) => console.log(['🖱️ click on: ', data.label]),
		'floor_adhesion',
	);
}

const biddersInhibitor = bidders.requestBids();

eventService.on(events.AD_SLOT_CREATED, (slot) => {
	bidders.updateSlotTargeting(slot.getSlotName());
});

new AdEngine().init([biddersInhibitor]);

registerClickPositionTracker();
