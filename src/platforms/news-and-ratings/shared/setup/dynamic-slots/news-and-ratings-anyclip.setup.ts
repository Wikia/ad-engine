import { context, DiProcess, targetingService, utils } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { insertSlots } from '../../../../shared';

import { NewsAndRatingsSlotsDefinitionRepository } from '../../index';

@Injectable()
export class NewsAndRatingsAnyclipSetup implements DiProcess {
	private logGroup = 'Anyclip';

	constructor(private slotsDefinitionRepository: NewsAndRatingsSlotsDefinitionRepository) {}

	execute(): void {
		context.set('services.anyclip.isApplicable', () => {
			const doesAnyclipTagExist = context.get('services.anyclip.anyclipTagExists');
			const pname = targetingService.get('pname');
			const pathname = window.location.pathname.toLowerCase();

			const isApplicable = doesAnyclipTagExist
				? doesAnyclipTagExist
				: this.isApplicable(pname)
				? this.isApplicable(pname)
				: this.isApplicable(pathname);

			utils.logger(this.logGroup, 'isApplicable: ', isApplicable, pname);

			return isApplicable;
		});

		utils.logger(this.logGroup, 'Inserting slots without DOM elements');
		insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
	}

	isApplicable(pathname: string): boolean {
		return this.isApplicableByPnameAdTag(pathname) || this.isApplicableByPathname(pathname);
	}

	private isApplicableByPnameAdTag(pname: string): boolean {
		const applicablePnames = ['news', 'feature_hub'];

		return applicablePnames.includes(pname);
	}

	private isApplicableByPathname(pathname: string): boolean {
		const applicablePathnames = ['/news/'];

		return applicablePathnames.includes(pathname);
	}
}
