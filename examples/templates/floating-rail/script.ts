import { AdEngine, context, FloatingRail, templateService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

context.extend(customContext);
context.set('targeting.artid', '264');

templateService.register(FloatingRail, {
	startOffset: -15,
});

new AdEngine().init();
