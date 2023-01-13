import { UserIdentity } from '@wikia/ad-services';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { localStorageRepository } from '@wikia/ad-services/user-identity/local-storage-repository';
import { context, TargetingService, targetingService } from '@wikia/core';
import { uuid } from '@wikia/core/utils/uuid';
import { expect } from 'chai';
import { createSandbox, SinonStub, SinonStubbedInstance } from 'sinon';

describe('User Identity', () => {
	let v4Stub: SinonStub;
	let sandbox;
	const mockId = '00000000-0000-0000-0000-000000000000';
	const userIdentity = new UserIdentity();
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.LOCAL);
		sandbox = createSandbox();
		targetingServiceStub = sandbox.stub(targetingService);
		v4Stub = sandbox.stub(uuid, 'v4');
		v4Stub.returns(mockId);
	});

	afterEach(() => {
		sandbox.restore();
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it("use LocalStore strategy and don't have PPID stored", async () => {
		sandbox.stub(localStorageRepository.storage, 'getItem').callsFake(() => null);
		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use LocalStore strategy and have PPID stored', async () => {
		sandbox
			.stub(localStorageRepository.storage, 'getItem')
			.callsFake(() => '11111111-1111-1111-1111-111111111111');

		await userIdentity.call();

		expect(
			targetingServiceStub.set.calledWith('ppid', '11111111-1111-1111-1111-111111111111'),
		).to.equal(true);
	});
});
