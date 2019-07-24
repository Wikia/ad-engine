import {
	AdEngine,
	context,
	FloorAdhesion,
	HideOnViewability,
	templateService,
	utils,
} from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

const timeoutHideTime = Number.parseInt(utils.queryString.get('timeout-hide-time'), 10) || 0;

customContext.targeting.artid = '158';

context.extend(customContext);

context.set('slots.invisible_high_impact_2.defaultTemplates', ['hideOnViewability']);

templateService.register(FloorAdhesion);
templateService.register(HideOnViewability);

context.set('templates.hideOnViewability.timeoutHideTime', timeoutHideTime);

new AdEngine().init();
