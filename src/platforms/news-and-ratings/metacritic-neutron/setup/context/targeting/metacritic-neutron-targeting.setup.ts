import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class MetacriticNeutronTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getS0(),
			s1: 'metacritic-neutron',
			skin: `metacritic_neutron_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}

	private getS0(): string {
		const path = window.location.pathname;

		if (
			path.startsWith('/game/') ||
			path.startsWith('/browse/game/') ||
			targetingService.get('section') === 'games'
		) {
			return 'gaming';
		}

		return 'ent';
	}
}
