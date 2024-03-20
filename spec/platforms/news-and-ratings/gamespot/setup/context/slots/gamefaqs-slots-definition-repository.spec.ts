// @ts-strict-ignore
import { context } from '@wikia/core';
import { GameFAQsSlotsDefinitionRepository } from '@wikia/platforms/news-and-ratings/gamefaqs/setup/context/slots/gamefaqs-slots-definition-repository';
import { expect } from 'chai';

describe('GameFAQsSlotsDefinitionRepository', () => {
	it('should return proper slot creator config', () => {
		const repository = new GameFAQsSlotsDefinitionRepository();

		expect(repository.getIncontentPlayerConfig().slotCreatorConfig).to.deep.eq({
			slotName: 'incontent_player',
			anchorSelector: '.msg_list .msg_body',
			insertMethod: 'prepend',
		});
	});

	it('should return proper activator', () => {
		const repository = new GameFAQsSlotsDefinitionRepository();

		repository.getIncontentPlayerConfig().activator();

		expect(context.get('state.adStack')).to.deep.contain({ id: 'incontent_player' });
	});
});
