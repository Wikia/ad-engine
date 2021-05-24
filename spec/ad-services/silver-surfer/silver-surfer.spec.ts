import { context } from '@wikia/ad-engine';
import { silverSurferService } from '@wikia/ad-services';
import { silverSurferServiceLoader } from '@wikia/ad-services/silver-surfer/silver-surfer.loader';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Silver Surfer service', () => {
	const sandbox = sinon.createSandbox();
	let getUserTargetingStub;

	const userProfile: UserProfile = {
		beaconId: 'test',
		gender: ['m'],
		ageBrackets: ['0-12', '13-17', '18-24'],
		adTags: {},
		time: 123456789,
	};

	const silverSurferConfig = ['ageBrackets:g_age_bracket', 'gender:g_gender'];

	beforeEach(() => {
		getUserTargetingStub = sandbox
			.stub(silverSurferServiceLoader, 'getUserProfile')
			.callsFake(() => Promise.resolve(userProfile));
	});

	afterEach(() => {
		context.remove('services.silverSurfer');
		sandbox.restore();
	});

	it('configures fetched user profile in context targeting', async () => {
		context.set('services.silverSurfer', silverSurferConfig);

		const configuredTareting = await silverSurferService.configureUserTargeting();

		expect(getUserTargetingStub.called).to.be.true;

		expect(configuredTareting).to.deep.equal({
			g_age_bracket: ['0-12', '13-17', '18-24'],
			g_gender: ['m'],
		});
		expect(context.get('targeting.g_age_bracket')).to.deep.equal(['0-12', '13-17', '18-24']);
		expect(context.get('targeting.g_gender')).to.deep.equal(['m']);
		expect(context.get('targeting.galactus_status')).to.equal('on_time');
	});

	it('does not fetch user profile when service is disabled', async () => {
		const configuredTareting = await silverSurferService.configureUserTargeting();

		expect(getUserTargetingStub.called).to.be.false;
		expect(configuredTareting).to.deep.equal({});
	});
});
