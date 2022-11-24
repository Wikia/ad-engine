import {
	context,
	DiProcess,
	InstantConfigCacheStorage,
	InstantConfigService,
	Targeting,
	utils,
} from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

@Injectable()
export class FanCentralTargetingSetup implements DiProcess {
	constructor(
		private instantConfig: InstantConfigService,
		private cacheStorage: InstantConfigCacheStorage,
	) {}

	execute(): void {
		context.set('targeting', {
			...context.get('targeting'),
			...this.getPageLevelTargeting(),
		});
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const targeting: Partial<Targeting> = {
			host: window.location.hostname,
			lang: 'en',
			post_id: '-1',
			skin: `fc_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			s0: 'fan-central',
			s1: '_fc',
			s2: 'home',
			rating: 'esrb:teen',
			labrador: this.cacheStorage.mapSamplingResults(
				this.instantConfig.get('icLABradorGamKeyValues'),
			),
			is_mobile: context.get('state.isMobile'),
		};

		this.setHomeTargeting(targeting);
		this.setCid(targeting);

		return targeting;
	}

	private setHomeTargeting(targeting: Partial<Targeting>): void {
		targeting.vertical = 'home';
		targeting.s0v = 'home';
	}

	private setCid(targeting: Partial<Targeting>): void {
		const cid = utils.queryString.get('cid');

		if (cid !== undefined) {
			targeting.cid = cid;
		}
	}
}
