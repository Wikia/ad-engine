import {
	context,
	CookieStorageAdapter,
	DiProcess,
	InstantConfigCacheStorage,
	InstantConfigService,
	Targeting,
	utils,
} from '@wikia/ad-engine';
import { Inject, Injectable } from '@wikia/dependency-injection';

import { F2_ENV, F2Environment } from '../../../setup-f2';
import { F2State } from '../../../utils/f2-state';
import { F2_STATE } from '../../../utils/f2-state-binder';
import { getCrossDomainTargeting } from '../../../../shared/utils/get-cross-domain-targeting';

@Injectable()
export class F2TargetingSetup implements DiProcess {
	constructor(
		@Inject(F2_ENV) private f2Env: F2Environment,
		@Inject(F2_STATE) private f2State: F2State,
		private instantConfig: InstantConfigService,
		private cacheStorage: InstantConfigCacheStorage,
	) {}

	execute(): void {
		context.set('targeting', {
			...context.get('targeting'),
			...this.getPageLevelTargeting(),
			...getCrossDomainTargeting(new CookieStorageAdapter()),
		});
	}

	private getPageLevelTargeting(): Partial<Targeting> {
		const targeting: Partial<Targeting> = {
			host: window.location.hostname,
			lang: 'en',
			post_id: '-1',
			skin: this.f2Env.skinName,
			s0: 'fandom',
			s1: '_fandom',
			s2: this.f2State.pageType === 'topic' ? 'vertical' : this.f2State.pageType,
			esrb: 'teen',
			labrador: this.cacheStorage.mapSamplingResults(
				this.instantConfig.get('icLABradorGamKeyValues'),
			),
			is_mobile: utils.client.isMobileSkin(this.f2Env.skinName) ? '1' : '0',
		};

		if (this.f2State.pageType === 'article' || this.f2State.pageType === 'app-article') {
			this.setArticleTargeting(targeting);
		}

		if (this.f2State.pageType === 'home') {
			this.setHomeTargeting(targeting);
		}

		if (this.f2State.pageType === 'topic') {
			this.setTopicTargeting(targeting);
		}

		if (this.f2State.hasFeaturedVideo) {
			context.set('custom.hasFeaturedVideo', true);
		}

		this.setCid(targeting);

		return targeting;
	}

	private setArticleTargeting(targeting: Partial<Targeting>): void {
		targeting.post_id = this.f2State.article?.id.toString() ?? '-1';
		// note tags and verticals send the same data for consistency with legacy ad targeting
		targeting.tags = this.undefinedIfEmpty(this.f2State.article?.tags);
		targeting.vertical = this.undefinedIfEmpty(this.f2State.article?.tags);
		targeting.s0v = this.undefinedIfEmpty(
			this.f2State.article?.tags.map((tag) => tag.toLowerCase()),
		);
		targeting.topic = this.undefinedIfEmpty(this.f2State.article?.topicNames);
		targeting.page_url = window.location.toString();
		targeting.s2 = `${this.f2State.hasFeaturedVideo ? 'fv-' : ''}${targeting.s2}`;
	}

	private setHomeTargeting(targeting: Partial<Targeting>): void {
		targeting.vertical = 'home';
		targeting.s0v = 'home';
	}

	private setTopicTargeting(targeting: Partial<Targeting>): void {
		targeting.topic = this.f2State.topic?.slug;
		targeting.hub = this.f2State.topic?.slug;
		targeting.s0v = this.f2State.topic?.slug;
	}

	private setCid(targeting: Partial<Targeting>): void {
		const cid = utils.queryString.get('cid');

		if (cid !== undefined) {
			targeting.cid = cid;
		}
	}

	private undefinedIfEmpty<T = any>(array: T[] | undefined): T[] | undefined {
		return array?.length > 0 ? array : undefined;
	}
}
