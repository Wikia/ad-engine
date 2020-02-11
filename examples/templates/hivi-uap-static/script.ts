import {
	AdEngine,
	BigFancyAdAbove,
	BigFancyAdBelow,
	context,
	FloatingRail,
	templateService,
} from '@wikia/ad-engine';
import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);

const cid = context.get('targeting.cid');

if (!cid) {
	context.set('targeting.cid', 'adeng-uap-hivi-static-dev');
}
context.set('options.tracking.slot.status', true);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
	context.set('slots.bottom_leaderboard.viewportConflicts', []);
}

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

new AdEngine().init();
