import { context, DiProcess, targetingService } from '@wikia/ad-engine';

export class GamespotTargetingSetup implements DiProcess {
	execute(): void {
		const targeting = {
			s0: this.getVerticalName(),
			s1: 'gamespot',
			skin: `gamespot_${context.get('state.isMobile') ? 'mobile' : 'desktop'}`,
			seg: '',
			aamid: '',
		};

		targetingService.extend(targeting);
	}

	getVerticalName(): 'gaming' | 'ent' {
		const gtagData = window.dataLayer.find(({ event }) => event === 'Pageview');
		const pathname = window.location.pathname;

		if (!gtagData) {
			return 'gaming';
		}

		if (this.isEntertainmentSite(pathname)) {
			return 'ent';
		}

		const validSiteSections = ['news', 'reviews', 'galleries'];

		if (validSiteSections.includes(gtagData.data.siteSection)) {
			return this.getVerticalNameBasedOnTopicName(gtagData);
		}

		return 'gaming';
	}

	isEntertainmentSite(pathname: string): boolean {
		if (!pathname) {
			return false;
		}

		return pathname.includes('entertainment');
	}

	private getVerticalNameBasedOnTopicName(gtagData): 'gaming' | 'ent' {
		const topicName = gtagData.data.topicName;
		const contentTopicName = gtagData.data.contentTopicName;

		if (!Array.isArray(topicName) || topicName.length === 0) {
			return 'gaming';
		}

		if (topicName.includes('Games') || topicName.includes('Game Review')) {
			return 'gaming';
		}

		if (contentTopicName && contentTopicName.includes('gaming')) {
			return 'gaming';
		}

		return 'ent';
	}
}
