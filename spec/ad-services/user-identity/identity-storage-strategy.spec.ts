import { UserIdentity } from '@wikia/ad-services';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { identityStorageClient } from '@wikia/ad-services/user-identity/identity-storage-repository/identity-storage-client';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, SinonStubbedInstance } from 'sinon';

describe('User Identity', () => {
	let sandbox;
	let clientSpy;
	const mockId = '00000000-0000-0000-0000-000000000000';
	const userIdentity = new UserIdentity();
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.IDENTITY_STORAGE);
		sandbox = createSandbox();
		targetingServiceStub = sandbox.stub(targetingService);
		clientSpy = sandbox.spy(identityStorageClient, 'postData');
	});

	afterEach(() => {
		sandbox.restore();
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('use Identity Storage strategy and gets synced PPID from API', async () => {
		sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
			}),
		);

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use Identity Storage strategy and gets not synced PPID from API', async () => {
		sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: false,
			}),
		);

		await userIdentity.call();

		//expect(targetingService.get('ppid')).to.eq(mockId);
		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use Identity Storage strategy and gets synced PPID from Cache', async () => {
		sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: true,
		}));

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
		expect(clientSpy.called).to.eq(false);
	});

	it('use Identity Storage strategy and gets not synced PPID from Cache', async () => {
		sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: false,
		}));
		await userIdentity.call();

		//expect(targetingService.get('ppid')).to.eq(mockId);
		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
		expect(clientSpy.called).to.eq(true);
	});
});
