import { AdEngine, context, templateService } from '@wikia/ad-engine';
import {
	BigFancyAdAbove,
	BigFancyAdBelow,
	FloatingRail,
	setupNpaContext,
} from '@wikia/ad-products';
import { getConfig as getBigFancyAdAboveConfig } from '../../big-fancy-ad-above-config';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '527';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

setupNpaContext();

templateService.register(BigFancyAdAbove, getBigFancyAdAboveConfig());
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

new AdEngine().init();
