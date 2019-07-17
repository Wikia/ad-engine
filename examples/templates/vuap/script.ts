import {
	AdEngine,
	BigFancyAdAbove,
	BigFancyAdBelow,
	FloatingRail,
	templateService,
} from '@wikia/ad-engine';

import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '321';

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail, {
	startOffset: -15,
});

new AdEngine(customContext).init();
