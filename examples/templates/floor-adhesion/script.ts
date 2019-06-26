import { AdEngine, context, FloorAdhesion, templateService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '158';

context.extend(customContext);

templateService.register(FloorAdhesion);

new AdEngine().init();
