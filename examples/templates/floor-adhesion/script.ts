import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { FloorAdhesion } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '158';

context.extend(customContext);

templateService.register(FloorAdhesion);

new AdEngine().init();
