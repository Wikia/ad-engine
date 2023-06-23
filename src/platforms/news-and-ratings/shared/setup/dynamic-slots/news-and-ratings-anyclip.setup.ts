import { insertSlots } from '@platforms/shared';
import { context, DiProcess, targetingService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';

import { NewsAndRatingsSlotsDefinitionRepository } from '../../index';

@Injectable()
export class NewsAndRatingsAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';

	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		const pname = targetingService.get('pname');

		context.set('services.anyclip.isApplicable', () => {
			const doesAnyclipTagExist = context.get('services.anyclip.anyclipTagExists');
			const pathname = window.location.pathname.toLowerCase();

			const isApplicable = doesAnyclipTagExist
				? doesAnyclipTagExist
				: this.isApplicable(pname)
				? this.isApplicable(pname)
				: this.isApplicable(pathname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});

		if (this.shouldPlayerBeIncontent(pname)) {
			utils.logger(this.logGroup, 'player should be in-content');
			this.updateContextForIncontentAnyclip();
		} else {
			utils.logger(this.logGroup, 'inserting slots without DOM elements');
			this.updateContextForMiniplayerAnyclip();
			insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
		}
	}

	private shouldPlayerBeIncontent(pname: string): boolean {
		return this.isApplicable(pname) && ['listings/main'].includes(pname);
	}

	private updateContextForMiniplayerAnyclip(): void {
		const MINI_PLAYER_WIDGET_ID = '001w000001Y8ud2AAB_M7985';

		context.set('services.anyclip.widgetname', MINI_PLAYER_WIDGET_ID);
		context.set('services.anyclip.playerElementSelector', null);
		context.set('services.anyclip.loadOnPageLoad', true);
		context.set('services.anyclip.latePageInject', false);
		context.set('custom.hasIncontentPlayer', false);
	}

	private updateContextForIncontentAnyclip(): void {
		const INCONTENT_PLAYER_WIDGET_ID = '001w000001Y8ud2AAB_M8046';

		context.set('services.anyclip.widgetname', INCONTENT_PLAYER_WIDGET_ID);
		context.set('services.anyclip.playerElementId', 'incontent_player');
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', false);
		context.set('custom.hasIncontentPlayer', true);
	}

	isApplicable(pathname: string): boolean {
		return this.isApplicableByPnameAdTag(pathname) || this.isApplicableByPathname(pathname);
	}

	private isApplicableByPnameAdTag(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub', 'listings/main'];

		return applicablePnames.includes(pname);
	}

	private isApplicableByPathname(pathname: string): boolean {
		const applicablePathnames = ['/news/'];

		return applicablePathnames.includes(pathname);
	}
}
