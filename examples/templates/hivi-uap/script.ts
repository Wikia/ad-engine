import {
	AdEngine,
	AdInfoContext,
	BigFancyAdAbove,
	BigFancyAdBelow,
	context,
	FloatingRail,
	MOVE_NAVBAR,
	SET_BODY_PADDING_TOP,
	setupNpaContext,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	templateService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Communicator, ofType, setupPostQuecast } from '@wikia/post-quecast';

import customContext from '../../context';
import '../../styles.scss';

const { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } = universalAdPackage;

function moveNavbar(offset = 0, time: number = SLIDE_OUT_TIME): void {
	const navbarElement: HTMLElement = document.querySelector('body > nav.navigation');

	if (navbarElement) {
		navbarElement.style.transition = offset ? '' : `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
		navbarElement.style.top = offset ? `${offset}px` : '';
	}
}

setupPostQuecast();

context.extend(customContext);

const cid = context.get('targeting.cid');

if (!cid) {
	context.set('targeting.cid', 'adeng-uap-hivi-dev');
}
context.set('options.tracking.slot.status', true);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
	context.set('slots.bottom_leaderboard.viewportConflicts', []);
}

setupNpaContext();

templateService.register(BigFancyAdAbove, {});
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

// TODO: Move theme with PQC
const communicator = new Communicator();

communicator.actions$.pipe(ofType(MOVE_NAVBAR)).subscribe(({ payload }) => {
	const { height, time } = payload;
	moveNavbar(height, time);
});

communicator.actions$.pipe(ofType(SET_BODY_PADDING_TOP)).subscribe(({ padding }) => {
	document.body.style.paddingTop = padding;
});

new AdEngine().init();
