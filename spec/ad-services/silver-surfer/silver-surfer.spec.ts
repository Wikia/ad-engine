import { context } from '@wikia/ad-engine';
import { SilverSurferProfileFetcher } from '@wikia/ad-services/silver-surfer/silver-surfer-profile-fetcher';
import { SilverSurferProfileExtender } from '@wikia/ad-services/silver-surfer/silver-surfer-profile-extender';
import { SilverSurferService } from '@wikia/ad-services';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Silver Surfer service', () => {
	const sandbox = sinon.createSandbox();
	let getProfileStub;
	let getContextStub;

	const userProfile: UserProfile = {
		beaconId: 'test',
		gender: ['m'],
		ageBrackets: ['0-12', '13-17', '18-24'],
		adTags: {},
		time: 123456789,
		interactions: ['featured video'],
	};

	const silverSurferContext: SilverSurferContext = {
		pages: [{ product: 'mw' }, { product: 'dis' }, { product: 'mw' }],
	};

	const silverSurferConfig = [
		'ageBrackets:g_age_bracket',
		'gender:g_gender',
		'keyMissingFromConfig:g_key_missing_from_config',
		'interactions:g_interactions',
	];

	function mockSilverSurferService(context, profile) {
		const fetcher = new SilverSurferProfileFetcher();
		const extender = new SilverSurferProfileExtender();

		getProfileStub = sandbox
			.stub(fetcher, 'getUserProfile')
			.callsFake(() => Promise.resolve(profile));
		getContextStub = sandbox.stub(extender, 'getContext').callsFake(() => context);
		return new SilverSurferService(fetcher, extender);
	}

	afterEach(() => {
		context.remove('services.silverSurfer');
		sandbox.restore();
	});

	it('configures fetched user profile in context targeting', async () => {
		context.set('services.silverSurfer', silverSurferConfig);
		const configuredTargeting = await mockSilverSurferService(
			silverSurferContext,
			userProfile,
		).call();

		expect(getProfileStub.called).to.be.true;
		expect(getContextStub.called).to.be.true;

		expect(configuredTargeting).to.deep.equal({
			g_age_bracket: ['0-12', '13-17', '18-24'],
			g_gender: ['m'],
			g_interactions: ['featured video', 'wiki content', 'discussions'],
		});
		expect(context.get('targeting.g_age_bracket')).to.deep.equal(['0-12', '13-17', '18-24']);
		expect(context.get('targeting.g_gender')).to.deep.equal(['m']);
		expect(context.get('targeting.galactus_status')).to.equal('on_time');
	});

	it('does not fetch user profile when service is disabled', async () => {
		const configuredTargeting = await mockSilverSurferService(
			silverSurferContext,
			userProfile,
		).call();

		expect(getProfileStub.called).to.be.false;
		expect(getContextStub.called).to.be.false;
		expect(configuredTargeting).to.deep.equal({});
	});

	it('should not fail when SilverSurfer profile is not available', async () => {
		context.set('services.silverSurfer', silverSurferConfig);
		const configuredTargeting = await mockSilverSurferService(undefined, undefined).call();

		expect(getProfileStub.called).to.be.true;
		expect(getContextStub.called).to.be.false;
		expect(configuredTargeting).to.deep.equal({});
	});
});
