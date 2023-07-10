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

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname, pathname);

			return isApplicable;
		});

		if (this.shouldPlayerBeIncontent(pname)) {
			utils.logger(this.logGroup, 'player should be in-content');
			this.updateContextForIncontentAnyclip();
		} else {
			this.updateContextForMiniplayerAnyclip();
			utils.logger(this.logGroup, 'inserting slots without DOM elements');
			insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
		}
	}

	private shouldPlayerBeIncontent(pname: string): boolean {
		return this.isApplicable(pname) && this.isIncontentPlayerPage(pname);
	}

	private updateContextForMiniplayerAnyclip(): void {
		context.set(
			'services.anyclip.widgetname',
			context.get('services.anyclip.miniPlayerWidgetname'),
		);
		context.set('services.anyclip.playerElementId', null);
		context.set('services.anyclip.loadWithoutAnchor', true);
		context.set('services.anyclip.loadOnPageLoad', true);
		context.set('services.anyclip.latePageInject', false);
		context.set('custom.hasIncontentPlayer', false);
	}

	private updateContextForIncontentAnyclip(): void {
		context.set(
			'services.anyclip.widgetname',
			context.get('services.anyclip.incontentPlayerWidgetname'),
		);
		context.set('services.anyclip.playerElementId', 'incontent_player');
		context.set('services.anyclip.loadWithoutAnchor', false);
		context.set('services.anyclip.loadOnPageLoad', false);
		context.set('services.anyclip.latePageInject', false);
		context.set('custom.hasIncontentPlayer', true);
	}

	isApplicable(pathname: string): boolean {
		return this.isApplicableByPnameAdTag(pathname) || this.isApplicableByPathname(pathname);
	}

	private isApplicableByPnameAdTag(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub', 'listings/main', 'movie', 'tv_show'];

		return applicablePnames.includes(pname);
	}

	private isApplicableByPathname(pathname: string): boolean {
		const applicablePathnames = ['/news/'];

		return applicablePathnames.includes(pathname);
	}

	private isIncontentPlayerPage(pname: string): boolean {
		const incontentPlayerPages = ['listings/main', 'movie', 'tv_show'];

		return incontentPlayerPages.includes(pname);
	}
}
