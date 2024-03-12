import { context, targetingService } from '@ad-engine/core';
import { DiProcess } from '@ad-engine/pipeline';
import { logger } from '@ad-engine/utils';
import { insertSlots } from '@platforms/shared';
import { Injectable } from '@wikia/dependency-injection';
import { NewsAndRatingsSlotsDefinitionRepository } from '../../index';

@Injectable()
export class NewsAndRatingsAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';
	private pageNamesWhenAnyclipAppliesOnDesktop = ['movie', 'tv_show'];
	private pageNamesWithAnyclipInContent = [
		'listings/main',
		...this.pageNamesWhenAnyclipAppliesOnDesktop,
	];
	private pageNamesWhenAnyclipApplies = [
		'news',
		'feature_hub',
		'listings/main',
		...this.pageNamesWhenAnyclipAppliesOnDesktop,
	];
	private pathNamesWhenAnyclipApplies = ['/news/'];

	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		const pname = targetingService.get('pname');

		context.set('services.anyclip.isApplicable', () => {
			const doesAnyclipTagExist = context.get('services.anyclip.anyclipTagExists');
			const pathname = window.location.pathname.toLowerCase();

			const isApplicable =
				doesAnyclipTagExist || this.isApplicable(pname) || this.isApplicable(pathname);

			logger(this.logGroup, 'isApplicable: ', isApplicable, pname, pathname);

			return isApplicable;
		});

		if (this.shouldPlayerBeIncontent(pname)) {
			logger(this.logGroup, 'player should be in-content');
			this.updateContextForIncontentAnyclip();
		} else {
			this.updateContextForMiniplayerAnyclip();
			logger(this.logGroup, 'inserting slots without DOM elements');
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
		if (this.isTvShowOrMoviePageOnMobile(pathname)) {
			return false;
		}

		return this.isApplicableByPnameAdTag(pathname) || this.isApplicableByPathname(pathname);
	}

	private isTvShowOrMoviePageOnMobile(pathname: string): boolean {
		return (
			context.get('state.isMobile') && this.pageNamesWhenAnyclipAppliesOnDesktop.includes(pathname)
		);
	}

	private isApplicableByPnameAdTag(pname: string): boolean {
		return this.pageNamesWhenAnyclipApplies.includes(pname);
	}

	private isApplicableByPathname(pathname: string): boolean {
		return this.pathNamesWhenAnyclipApplies.includes(pathname);
	}

	private isIncontentPlayerPage(pname: string): boolean {
		return this.pageNamesWithAnyclipInContent.includes(pname);
	}
}
