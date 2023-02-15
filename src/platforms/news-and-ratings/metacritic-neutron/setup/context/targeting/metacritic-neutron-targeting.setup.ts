import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class MetacriticNeutronTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'metacritic-neutron',
			skin: `metacritic_neutron_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
		};

		targetingService.extend(targeting);
	}
}
