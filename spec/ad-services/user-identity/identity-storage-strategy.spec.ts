import { UserIdentity } from '@wikia/ad-services';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { identityStorageClient } from '@wikia/ad-services/user-identity/identity-storage-repository/identity-storage-client';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('User Identity', () => {
	let mockId;
	let userIdentity;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	let identityStorageClientPostDataStub;

	beforeEach(() => {
		mockId = `${Math.random()}-${Math.random()}-${Math.random()}-${Math.random()}`;
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.IDENTITY_STORAGE);
		targetingServiceStub = global.sandbox.stub(targetingService);
		userIdentity = new UserIdentity();
		identityStorageClientPostDataStub = global.sandbox.stub(identityStorageClient, 'postData');
	});

	afterEach(() => {
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('use Identity Storage strategy and gets synced PPID from API', async () => {
		global.sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
			}),
		);

		global.sandbox.stub(identityStorageClient, 'getLocalData').callsFake(() => undefined);

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use Identity Storage strategy and gets not synced PPID from API', async () => {
		global.sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: false,
			}),
		);

		global.sandbox.stub(identityStorageClient, 'getLocalData').callsFake(() => undefined);

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use Identity Storage strategy and gets synced PPID from Cache', async () => {
		global.sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: true,
		}));

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
		expect(identityStorageClientPostDataStub.called).to.eq(false);
	});

	it('use Identity Storage strategy and gets not synced PPID from Cache', async () => {
		identityStorageClientPostDataStub.returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
			}),
		);

		global.sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: false,
		}));

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
		expect(identityStorageClientPostDataStub.called).to.eq(true);
	});
});
