import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class TvGuideMtcSlotsContextSetup implements DiProcess {
	execute(): void {
		const slots = {
			'top-leaderboard': {
				adProduct: 'top_leaderboard',
				group: 'LB',
				sizes: [],
				defaultTemplates: ['stickyTlb'],
				defaultSizes: [],
				providers: ['nothing'],
			},
			'mtop-leaderboard': {
				adProduct: 'top_leaderboard',
				group: 'LB',
				sizes: [],
				defaultTemplates: ['stickyTlb'],
				defaultSizes: [],
				providers: ['nothing'],
			},
			'mobile-omni-skybox-plus-sticky': {
				adProduct: 'top_leaderboard',
				group: 'LB',
				sizes: [],
				defaultTemplates: ['stickyTlb'],
				defaultSizes: [],
				providers: ['nothing'],
			},
		};

		context.set('slots', slots);
		context.set('vast.adUnitId', this.buildVastAdUnit());
		context.push('state.adStack', { id: 'top-leaderboard' });
		context.push('state.adStack', { id: 'mtop-leaderboard' });
		context.push('state.adStack', { id: 'mobile-omni-skybox-plus-sticky' });
	}

	private buildVastAdUnit(): string {
		const dfpId = context.get('custom.dfpId');
		const region = context.get('custom.region');
		const property = context.get('custom.property') || 'tvguide';
		const device = context.get('custom.device') === 'm' ? 'mobile' : 'desktop';

		return `${dfpId}/v${region}-${property}/${device}`;
	}
}
