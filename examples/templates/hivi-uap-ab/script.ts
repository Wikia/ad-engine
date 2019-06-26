import {
	AdEngine,
	BigFancyAdAbove,
	BigFancyAdBelow,
	context,
	FloatingRail,
	setupNpaContext,
	templateService,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '527';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

setupNpaContext();

templateService.register(BigFancyAdAbove);
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

new AdEngine().init();
