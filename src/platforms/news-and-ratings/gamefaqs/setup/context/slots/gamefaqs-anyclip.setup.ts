import { insertSlots } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { GameFAQsSlotsDefinitionRepository } from './gamefaqs-slots-definition-repository';

@Injectable()
export class GameFAQsAnyclipSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: GameFAQsSlotsDefinitionRepository) {}

	execute(): void {
		const incontentPlayerConfig = this.slotsDefinitionRepository.getIncontentPlayerConfig();

		context.set(
			'custom.hasIncontentPlayer',
			!!document.querySelector(incontentPlayerConfig.slotCreatorConfig.anchorSelector) &&
				!context.get('state.isMobile'),
		);

		insertSlots([incontentPlayerConfig]);
	}
}
