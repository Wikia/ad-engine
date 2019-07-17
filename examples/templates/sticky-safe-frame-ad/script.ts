import { AdEngine, context, StickyAd, templateService } from '@wikia/ad-engine';
import adContext from '../../context';

context.extend(adContext);
context.set('targeting.artid', '525');
context.set('templates.stickyAd.lineItemIds', ['4876845510']);
context.set('slots.top_leaderboard.defaultTemplates', ['stickyAd']);

// Include anything from ad-products to register StickyAd template or do it manually
templateService.register(StickyAd);

new AdEngine(context).init();
