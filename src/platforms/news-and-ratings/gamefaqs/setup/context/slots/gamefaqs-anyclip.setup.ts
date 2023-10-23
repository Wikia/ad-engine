import { insertSlots } from '@platforms/shared';
import { context, DiProcess } from '@wikia/ad-engine';
import { Injectable } from '@wikia/dependency-injection';
import { GameFAQsSlotsDefinitionRepository } from './gamefaqs-slots-definition-repository';

@Injectable()
export class GameFAQsAnyclipSetup implements DiProcess {
	constructor(private slotsDefinitionRepository: GameFAQsSlotsDefinitionRepository) {}

	execute(): void {
		context.set('custom.hasIncontentPlayer', !!document.querySelector('.msg_body'));

		// TODO: this line can be removed after releasing gamefaqs change that removes the element from the page
		document.querySelector('.message_mpu')?.remove();

		insertSlots([this.slotsDefinitionRepository.getIncontentPlayerConfig()]);
	}
}
