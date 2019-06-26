import { AdEngine, BigFancyAdAbove, templateService } from '@wikia/ad-engine';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '415';

templateService.register(BigFancyAdAbove);

new AdEngine(customContext).init();
