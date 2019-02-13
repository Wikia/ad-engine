import { AdEngine, context } from '@wikia/ad-engine';
import adContext from '../../context';

context.extend(adContext);
context.set('src', 'incorrect-src');

new AdEngine().init();
