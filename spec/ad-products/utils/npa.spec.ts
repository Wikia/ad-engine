import { setupNpaContext } from '@wikia/ad-products/utils/npa';
import { TargetingService, targetingService, trackingOptIn } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, SinonStub, SinonStubbedInstance } from 'sinon';

describe('NPA - setup context ', () => {
	const sandbox = createSandbox();
	let isOptedInStub: SinonStub;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		isOptedInStub = sandbox.stub(trackingOptIn, 'isOptedIn');
		targetingServiceStub = sandbox.stub(targetingService);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('sets npa targeting for turned off tracking opt-in', () => {
		isOptedInStub.returns(false);
		setupNpaContext();
		expect(targetingServiceStub.set.calledWith('npa', '1')).to.equal(true);
	});

	it('sets npa targeting for tracking opt-in', () => {
		isOptedInStub.returns(true);
		setupNpaContext();
		expect(targetingServiceStub.set.calledWith('npa', '0')).to.equal(true);
	});
});
