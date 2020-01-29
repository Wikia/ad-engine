import { AdEngine, BigFancyAdAbove, context, templateService } from '@wikia/ad-engine';
import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('customContext.targeting.artid', '390');
context.set('customContext.targeting.dmn', 'fandomcom');
context.set('customContext.targeting.bfaa', {
	slotsToDisable: ['incontent_player'],
});

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());

new AdEngine().init();
