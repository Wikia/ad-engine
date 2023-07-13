import { IdentitySetup } from '@wikia/ad-services';
import { communicationService } from '@wikia/communication';
import { expect } from 'chai';
import sinon from 'sinon';

describe('IdentitySetup', () => {
	let identitySetup;
	let communicationServiceMock;

	beforeEach(() => {
		identitySetup = new IdentitySetup();
		communicationServiceMock = sinon.mock(communicationService);
	});

	afterEach(() => {
		communicationServiceMock.restore();
	});

	it('should call the required methods', async () => {
		const identityEngineReadyStub = sinon.stub(identitySetup, 'identityEngineReady').resolves();

		await identitySetup.execute();

		expect(identityEngineReadyStub.calledOnce).to.be.true;
	});
});
