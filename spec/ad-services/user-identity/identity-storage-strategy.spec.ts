import { expect } from 'chai';
import { context } from '@wikia/core';
import { userIdentity } from '@wikia/ad-services';
import { createSandbox } from 'sinon';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { identityStorageClient } from '@wikia/ad-services/user-identity/identity-storage-repository/identity-storage-client';

describe('User Identity', () => {
	let sandbox;
	let clientSpy;
	const mockId = '00000000-0000-0000-0000-000000000000';

	beforeEach(() => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.IDENTITY_STORAGE);
		sandbox = createSandbox();
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

		expect(context.get('targeting.ppid')).to.eq(mockId);
	});

	it('use Identity Storage strategy and gets not synced PPID from API', async () => {
		sandbox.stub(identityStorageClient, 'fetchData').returns(
			Promise.resolve({
				ppid: mockId,
				synced: false,
			}),
		);

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq(mockId);
	});

	it('use Identity Storage strategy and gets synced PPID from Cache', async () => {
		sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: true,
		}));

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq(mockId);
		expect(clientSpy.called).to.eq(false);
	});

	it('use Identity Storage strategy and gets not synced PPID from Cache', async () => {
		sandbox.stub(identityStorageClient.storage, 'getItem').callsFake(() => ({
			ppid: mockId,
			synced: false,
		}));
		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq(mockId);
		expect(clientSpy.called).to.eq(true);
	});
});
