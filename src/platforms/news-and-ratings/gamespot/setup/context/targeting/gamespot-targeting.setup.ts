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
		const gtagData = window.sitePageVars?.trackingSettings?.google_tag_manager?.data;
		const pathname = window.location.pathname;

		if (!gtagData) {
			return 'gaming';
		}

		if (this.isEntertainmentSite(pathname)) {
			return 'ent';
		}

		if (
			gtagData.siteSection === 'news' ||
			gtagData.siteSection === 'reviews' ||
			gtagData.siteSection === 'galleries'
		) {
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
		const topicName = gtagData.topicName;
		const contentTopicName = gtagData.contentTopicName;

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
