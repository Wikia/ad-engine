import { AdEngine, templateService } from '@wikia/ad-engine';
import { BigFancyAdAbove } from '@wikia/ad-products';
import customContext from '../../context';
import '../../styles.scss';

customContext.targeting.artid = '415';

templateService.register(BigFancyAdAbove);

new AdEngine(customContext).init();
