import { AdEngine, context, Permutive } from '@wikia/ad-engine';
import adContext from '../../context';

context.extend(adContext);

Permutive.configure();
Permutive.loadScript();

new AdEngine().init();
