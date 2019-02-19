import { AdEngine, context } from '@wikia/ad-engine';
import customContext from '../../context';

context.extend(customContext);

new AdEngine().init();
