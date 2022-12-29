import { expect } from 'chai';
import sinon from 'sinon';

import { GamefaqsDynamicSlotsSetup } from '../../../../../src/platforms/gamefaqs/setup/dynamic-slots/gamefaqs-dynamic-slots.setup';
import { context, utils } from '../../../../../src/core';
import { createHtmlElementStub } from '../../../../spec-utils/html-element.stub';

describe('Inserting dynamic slots on GameFAQs', () => {
	const sandbox = sinon.createSandbox();
	let querySelectorAllStub;

	beforeEach(() => {
		querySelectorAllStub = sandbox.stub(document, 'querySelectorAll');
		context.set('state.adStack', []);
	});

	afterEach(() => {
		sandbox.restore();
		context.set('state.adStack', []);
	});

	it('works as expected for no slots found on the page', () => {
		querySelectorAllStub.returns([] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
	});

	it('works as expected for slots found on the page but without a wrapper', () => {
		const slotElementStub = createHtmlElementStub(sandbox, 'div');
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(0);
	});

	it('works as expected for slots found on the page', () => {
		const slotElementStub = createHtmlElementStub(sandbox, 'div');
		slotElementStub.getAttribute.returns('test-ad-slot');
		sandbox
			.stub(utils.Document, 'getFirstElementChild')
			.returns(createHtmlElementStub(sandbox, 'div'));
		querySelectorAllStub.returns([slotElementStub] as any);

		const dynamicSlotsSetup = new GamefaqsDynamicSlotsSetup();
		dynamicSlotsSetup.execute();

		expect(context.get('state.adStack').length).to.eq(1);
	});
});
