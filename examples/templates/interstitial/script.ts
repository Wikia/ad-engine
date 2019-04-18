import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { Interstitial } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '167';
customContext.targeting.skin = 'mercury';

context.extend(customContext);

templateService.register(Interstitial);

new AdEngine().init();
