import { AdEngine, BigFancyAdAbove, context, templateService } from '@wikia/ad-engine';
import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '390';
customContext.targeting.dmn = 'fandomcom';
customContext.templates.bfaa = {
	slotsToDisable: ['incontent_player'],
};
context.extend(customContext);

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());

new AdEngine().init();
