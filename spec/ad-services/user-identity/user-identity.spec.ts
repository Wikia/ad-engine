import { expect } from 'chai';
import { context } from '@wikia/ad-engine';
import { userIdentity } from '@wikia/ad-services';
import { createSandbox, SinonStub, spy, stub } from 'sinon';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { admsClient } from '@wikia/ad-services/user-identity/adms-identity-repository/adms-client';
import { ActionType } from '@wikia/ad-services/user-identity/adms-identity-repository/adms-actions';
import { uuid } from '@wikia/ad-engine/utils/uuid';
import { localStorageRepository } from '@wikia/ad-services/user-identity/local-storage-repository';

describe('User Identity', () => {
	let v4Stub: SinonStub;
	let sandbox;
	const mockId = '00000000-0000-0000-0000-000000000000';

	before(() => {
		v4Stub = stub(uuid, 'v4');
		v4Stub.returns(mockId);
	});

	beforeEach(() => {
		sandbox = createSandbox();
	});
	afterEach(() => {
		sandbox.restore();
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('is disabled', async () => {
		const setupSpy = spy(userIdentity, 'setupPPID');

		context.set('services.ppid.enabled', false);

		await userIdentity.call();

		expect(setupSpy.notCalled).to.eq(true);
	});

	it("use LocalStore strategy and don't have PPID stored", async () => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.LOCAL);
		sandbox.stub(localStorageRepository.storage, 'getItem').callsFake(() => null);
		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq(mockId);
	});

	it('use LocalStore strategy and have PPID stored', async () => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.LOCAL);
		sandbox
			.stub(localStorageRepository.storage, 'getItem')
			.callsFake(() => '11111111-1111-1111-1111-111111111111');

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq('11111111-1111-1111-1111-111111111111');
	});

	it('use ADMS strategy and gets PPID from API', async () => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.ADMS);
		sandbox.stub(admsClient, 'fetchData').returns(
			Promise.resolve({
				IDENTITY: [
					{
						name: 'identity',
						payload: {
							identityToken: '11111111-1111-1111-1111-111111111111',
							identityType: 'ppid',
						},
						type: ActionType.IDENTITY,
						time: Date.now(),
					},
				],
			}),
		);

		sandbox.stub(admsClient, 'postData').returns(Promise.resolve());

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq('11111111-1111-1111-1111-111111111111');
	});

	it("use ADMS strategy and don't have PPID in store or API", async () => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.ADMS);
		sandbox.stub(admsClient, 'fetchData').returns(Promise.resolve({}));

		sandbox.stub(admsClient, 'postData').returns(Promise.resolve());

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq(mockId);
	});

	it('use ADMS strategy and gets PPID from storage', async () => {
		context.set('services.ppid.enabled', {
			enabled: true,
			strategy: IdentityRepositories.ADMS,
		});
		sandbox.stub(admsClient.storage, 'getItem').callsFake(() => ({
			IDENTITY: [
				{
					name: 'identity',
					type: 'IDENTITY',
					time: 1662989288536,
					payload: {
						_type: 'identity',
						id: 'noId',
						subType: 'noSubtype',
						identityToken: '11111111-1111-1111-1111-111111111111',
						identityType: 'ppid',
					},
				},
			],
		}));

		await userIdentity.call();

		expect(context.get('targeting.ppid')).to.eq('11111111-1111-1111-1111-111111111111');
	});
});
