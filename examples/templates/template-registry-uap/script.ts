import {
	AdEngine,
	AdInfoContext,
	BigFancyAdAbove,
	context,
	setupNpaContext,
	slotPropertiesTrackingMiddleware,
	slotTracker,
	slotTrackingMiddleware,
	TemplateRegistry,
	templateService,
	universalAdPackage,
} from '@wikia/ad-engine';
import { Container } from '@wikia/dependency-injection';

import customContext from '../../context';
import '../../styles.scss';
import { ImpactHandler } from './handlers/impact-handler';
import { InitialHandler } from './handlers/initial-handler';
import { ResolvedHandler } from './handlers/resolved-handler';
import { StickyHandler } from './handlers/sticky-handler';
import { TransitionHandler } from './handlers/transition-handler';

const { CSS_TIMING_EASE_IN_CUBIC, SLIDE_OUT_TIME } = universalAdPackage;

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

templateService.register(BigFancyAdAbove, {
	moveNavbar: (offset = 0, time: number = SLIDE_OUT_TIME): void => {
		const navbarElement: HTMLElement = document.querySelector('body > nav.navigation');

		if (navbarElement) {
			navbarElement.style.transition = offset ? '' : `top ${time}ms ${CSS_TIMING_EASE_IN_CUBIC}`;
			navbarElement.style.top = offset ? `${offset}px` : '';
		}
	},
	setBodyPaddingTop: (padding: string) => {
		document.body.style.paddingTop = padding;
	},
});

// Register slot tracker
slotTracker
	.add(slotTrackingMiddleware)
	.add(slotPropertiesTrackingMiddleware)
	.register(({ data, slot }: AdInfoContext) => {
		// Trigger event tracking
		console.info(`🏁 Slot tracker: ${slot.getSlotName()} ${data.ad_status}`, data);
	});

const container = new Container();
const templateRegistry = container.get(TemplateRegistry);

templateService.setRegistry(templateRegistry);

templateRegistry.register(
	'bfaa',
	{
		impact: [ImpactHandler],
		initial: [InitialHandler],
		resolved: [ResolvedHandler],
		sticky: [StickyHandler],
		transition: [TransitionHandler],
	},
	'initial',
);

new AdEngine().init();
