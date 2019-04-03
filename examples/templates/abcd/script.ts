import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { BigFancyAdAbove } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '390';
customContext.targeting.dmn = 'fandomcom';
customContext.templates.bfaa = {
	slotsToDisable: ['incontent_player'],
};
context.extend(customContext);

templateService.register(BigFancyAdAbove);

new AdEngine().init();
