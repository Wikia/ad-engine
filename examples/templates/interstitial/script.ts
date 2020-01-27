import { AdEngine, context, Interstitial, templateService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('customContext.targeting.artid', '167');
context.set('customContext.targeting.skin', 'mercury');

templateService.register(Interstitial);

new AdEngine().init();
