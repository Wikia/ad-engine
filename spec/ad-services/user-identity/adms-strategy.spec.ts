import { UserIdentity } from '@wikia/ad-services';
import { ActionType } from '@wikia/ad-services/user-identity/adms-identity-repository/adms-actions';
import { admsClient } from '@wikia/ad-services/user-identity/adms-identity-repository/adms-client';
import { IdentityRepositories } from '@wikia/ad-services/user-identity/identity-repositories';
import { context, TargetingService, targetingService } from '@wikia/core';
import { uuid } from '@wikia/core/utils/uuid';
import { expect } from 'chai';
import { SinonStub, SinonStubbedInstance } from 'sinon';

describe('User Identity', () => {
	let v4Stub: SinonStub;
	const mockId = '00000000-0000-0000-0000-000000000000';
	const userIdentity = new UserIdentity();
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;

	beforeEach(() => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.ADMS);
		v4Stub = global.sandbox.stub(uuid, 'v4');
		v4Stub.returns(mockId);
		targetingServiceStub = global.sandbox.stub(targetingService);
	});
	afterEach(() => {
		context.remove('services.ppid.enabled');
		context.remove('services.ppidRepository');
	});

	it('use ADMS strategy and gets PPID from API', async () => {
		context.set('services.ppid.enabled', true);
		context.set('services.ppidRepository', IdentityRepositories.ADMS);
		global.sandbox.stub(admsClient, 'fetchData').returns(
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

		global.sandbox.stub(admsClient, 'postData').returns(Promise.resolve());

		await userIdentity.call();

		expect(
			targetingServiceStub.set.calledWith('ppid', '11111111-1111-1111-1111-111111111111'),
		).to.equal(true);
	});

	it("use ADMS strategy and don't have PPID in store or API", async () => {
		global.sandbox.stub(admsClient, 'fetchData').returns(Promise.resolve({}));

		global.sandbox.stub(admsClient, 'postData').returns(Promise.resolve());

		await userIdentity.call();

		expect(targetingServiceStub.set.calledWith('ppid', mockId)).to.equal(true);
	});

	it('use ADMS strategy and gets PPID from storage', async () => {
		global.sandbox.stub(admsClient.storage, 'getItem').callsFake(() => ({
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

		expect(
			targetingServiceStub.set.calledWith('ppid', '11111111-1111-1111-1111-111111111111'),
		).to.equal(true);
	});
});
