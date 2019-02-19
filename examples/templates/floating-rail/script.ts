import { AdEngine, templateService } from '@wikia/ad-engine';
import { FloatingRail } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '264';

templateService.register(FloatingRail, {
	startOffset: -15,
});

new AdEngine(customContext).init();
