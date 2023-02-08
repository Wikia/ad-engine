import { context, DiProcess } from '@wikia/ad-engine';

export class MetacriticNeutronTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: 'ent',
			s1: 'metacritic-neutron',
			skin: 'metacritic-neutron',
		};

		context.set('targeting', {
			...context.get('targeting'),
			...targeting,
		});
	}
}
