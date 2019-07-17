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

customContext.targeting.artid = '455';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

templateService.register(BigFancyAdAbove, {
	...getBigFancyAdAboveConfig(),
	autoPlayAllowed: false,
	defaultStateAllowed: false,
	fullscreenAllowed: false,
	stickinessAllowed: false,
	mainContainer: document.querySelector('.header'),
});
templateService.register(BigFancyAdBelow, {
	autoPlayAllowed: false,
	defaultStateAllowed: false,
	fullscreenAllowed: false,
});
templateService.register(FloatingRail);

new AdEngine().init();
