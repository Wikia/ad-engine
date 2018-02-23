import { AdEngine } from '@wikia/ad-engine';
import adContext from '../../context';

adContext.targeting.artid = '666';

new AdEngine(adContext).init();
