import { AdEngine, templateService } from '@wikia/ad-engine';
import { FloorAdhesion } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '158';

templateService.register(FloorAdhesion);

new AdEngine(customContext).init();
