import {
	AdEngine,
	BigFancyAdAbove,
	BigFancyAdBelow,
	FloatingRail,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '321';

templateService.register(BigFancyAdAbove);
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail, {
	startOffset: -15,
});

new AdEngine(customContext).init();
