import { setupNpaContext } from '@wikia/ad-products/utils/npa';
import { context, trackingOptIn } from '@wikia/core';
import { assert } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

describe('NPA - setup context ', () => {
	const sandbox = createSandbox();
	let isOptedInStub: SinonStub;

	beforeEach(() => {
		isOptedInStub = sandbox.stub(trackingOptIn, 'isOptedIn');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('sets npa targeting for turned off tracking opt-in', () => {
		isOptedInStub.returns(false);
		setupNpaContext();
		assert.equal(context.get('targeting.npa'), '1');
	});

	it('sets npa targeting for tracking opt-in', () => {
		isOptedInStub.returns(true);
		setupNpaContext();
		assert.equal(context.get('targeting.npa'), '0');
	});
});
