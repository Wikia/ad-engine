import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { BigFancyAdAbove, BigFancyAdBelow, FloatingRail } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '455';

context.extend(customContext);

if (document.body.offsetWidth < 728) {
	context.set('state.isMobile', true);
	context.set('targeting.skin', 'fandom_mobile');
}

templateService.register(BigFancyAdAbove);
templateService.register(BigFancyAdBelow);
templateService.register(FloatingRail);

context.set('templates.bfaa.autoPlayAllowed', false);
context.set('templates.bfaa.defaultStateAllowed', false);
context.set('templates.bfaa.fullscreenAllowed', false);
context.set('templates.bfaa.stickinessAllowed', false);
context.set('templates.bfab.autoPlayAllowed', false);
context.set('templates.bfab.defaultStateAllowed', false);
context.set('templates.bfab.fullscreenAllowed', false);
context.set('templates.bfaa.mainContainer', document.querySelector('.header'));

new AdEngine().init();
