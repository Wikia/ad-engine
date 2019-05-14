import { AdEngine, context, templateService } from '@wikia/ad-engine';
import { FloorAdhesion, HideOnViewability } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '158';

context.extend(customContext);

context.set('slots.invisible_high_impact_2.defaultTemplates', ['hideOnViewability']);

templateService.register(FloorAdhesion);
templateService.register(HideOnViewability);

new AdEngine().init();
