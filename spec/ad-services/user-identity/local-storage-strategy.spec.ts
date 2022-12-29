import { expect } from 'chai';
import { context, targetingService } from '@wikia/core';
import { userIdentity } from '@wikia/ad-services';
import { createSandbox, SinonStub } from 'sinon';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { uuid } from '@wikia/core/utils/uuid';
import { localStorageRepository } from '@wikia/ad-services/user-identity/local-storage-repository';

describe('User Identity', () => {
	let v4Stub: SinonStub;
	let sandbox;
	const mockId = '00000000-0000-0000-0000-000000000000';

	beforeEach(() => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.LOCAL);
		sandbox = createSandbox();
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

		expect(targetingService.get('ppid')).to.eq(mockId);
	});

	it('use LocalStore strategy and have PPID stored', async () => {
		sandbox
			.stub(localStorageRepository.storage, 'getItem')
			.callsFake(() => '11111111-1111-1111-1111-111111111111');

		await userIdentity.call();

		expect(targetingService.get('ppid')).to.eq('11111111-1111-1111-1111-111111111111');
	});
});
