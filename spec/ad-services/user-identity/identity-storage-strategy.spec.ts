import { UserIdentity } from '@wikia/ad-services';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { identityStorageClient } from '@wikia/ad-services/user-identity/identity-storage-repository/identity-storage-client';
import { localStorageRepository } from '@wikia/ad-services/user-identity/local-storage-repository';
import { context, TargetingService, targetingService } from '@wikia/core';
import { expect } from 'chai';
import { SinonStubbedInstance } from 'sinon';

describe('User Identity', () => {
	let mockId;
	let userIdentity;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		mockId = `${Math.random()}-${Math.random()}-${Math.random()}-${Math.random()}`;
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.IDENTITY_STORAGE);
		targetingServiceStub = global.sandbox.stub(targetingService);
		userIdentity = new UserIdentity();
	});

	afterEach(() => {
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('use Identity Storage strategy and gets synced PPID from API', async () => {
		const fetchMock = global.sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
			}),
		);

		global.sandbox.stub(identityStorageClient, 'getLocalData').callsFake(() => undefined);

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
		expect(fetchMock.called).to.eq(true);
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

	it('use Identity Storage strategy and gets PPID from API when local is deprecated', async () => {
		global.sandbox.stub(localStorageRepository.storage, 'getItem').callsFake(() => null);
		global.sandbox.stub(identityStorageClient, 'getLocalData').returns({
			ppid: mockId,
			synced: true,
			over18: true,
			timestamp: 0,
		});
		const fetchMock = global.sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
				over18: true,
			}),
		);

		await userIdentity.call();

		expect(fetchMock.called).to.eq(true);
	});

	it('use Identity Storage strategy and gets PPID from local if it is not deprecated', async () => {
		global.sandbox
			.stub(identityStorageClient, 'getLocalData')
			.callsFake(() => ({ ppid: mockId, synced: true, over18: false, timestamp: Date.now() }));
		const fetchMock = global.sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: true,
				over18: true,
			}),
		);

		await userIdentity.call();

		expect(fetchMock.called).to.eq(false);
	});
});
