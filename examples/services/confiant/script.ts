import { AdEngine, confiant, context, utils } from '@wikia/ad-engine';
import customContext from '../../context';

const isConfiantEnabled = utils.queryString.get('confiant-disabled') !== '1';

customContext.targeting.artid = '553';
context.extend(customContext);
context.set('services.confiant.enabled', isConfiantEnabled);

confiant.call();

setTimeout(() => {
	new AdEngine().init();
}, 1000);
