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
		const utagData = window.utag_data;
		if (!utagData) {
			return 'gaming';
		}

		if (utagData.siteSection === 'entertainment') {
			return 'ent';
		}

		if (utagData.siteSection === 'news' || utagData.siteSection === 'reviews') {
			return this.getVerticalNameBasedOnTopicName(utagData.topicName);
		}

		return 'gaming';
	}

	private getVerticalNameBasedOnTopicName(topicName: string[]): 'gaming' | 'ent' {
		if (!Array.isArray(topicName) || topicName.length === 0) {
			return 'gaming';
		}

		if (topicName.includes('Games') || topicName.includes('Game Review')) {
			return 'gaming';
		}

		return 'ent';
	}
}
