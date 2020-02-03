import { AdEngine, context, Interstitial, templateService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('targeting.artid', '167');
context.set('targeting.skin', 'mercury');

templateService.register(Interstitial);

new AdEngine().init();
