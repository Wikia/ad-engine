import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { FloorAdhesion } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '173';
customContext.slots.floor_adhesion.forceSafeFrame = true;

context.extend(customContext);

templateService.register(FloorAdhesion);

new AdEngine().init();
