import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';

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
		const utagData = window.utag_data;
		if (!utagData) {
			return 'gaming';
		}

		if (this.isEntertainmentSite(utagData['dom.pathname'])) {
			return 'ent';
		}

		if (
			utagData.siteSection === 'news' ||
			utagData.siteSection === 'reviews' ||
			utagData.siteSection === 'galleries'
		) {
			return this.getVerticalNameBasedOnTopicName(utagData);
		}

		return 'gaming';
	}

	isEntertainmentSite(pathname: string): boolean {
		if (!pathname) {
			return false;
		}

		return pathname.includes('entertainment');
	}

	private getVerticalNameBasedOnTopicName(utagData): 'gaming' | 'ent' {
		const topicName = utagData.topicName;
		const contentTopicName = utagData.contentTopicName;

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
