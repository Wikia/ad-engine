import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { BigFancyAdAbove, BigFancyAdBelow, FloatingRail } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '479';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

templateService.register(BigFancyAdAbove);
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

new AdEngine().init();
