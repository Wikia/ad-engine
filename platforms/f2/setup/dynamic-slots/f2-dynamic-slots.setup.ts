import { DynamicSlotsSetup } from '@platforms/shared';
import { context } from '@wikia/ad-engine';

export class F2DynamicSlotsSetup implements DynamicSlotsSetup {
	configureDynamicSlots(): void {
		if (!context.get('custom.hasFeaturedVideo') && context.get('templates.stickyTlb.lineItemIds')) {
			context.set('templates.stickyTlb.enabled', true);
			context.push(`slots.top_leaderboard.defaultTemplates`, 'stickyTlb');
		}
		context.set('templates.stickyTLB.enabled', true);
	}
}
