import { AdEngine, context, permutive } from '@wikia/ad-engine';
import adContext from '../../context';

context.extend(adContext);
context.set('services.permutive.enabled', true);
context.set('options.trackingOptIn', true);

permutive.call();

new AdEngine().init();
