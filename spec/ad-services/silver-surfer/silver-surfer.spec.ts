import { context } from '@wikia/ad-engine';
import SilverSurferProfileFetcher from '@wikia/ad-services/silver-surfer/silver-surfer-profile-fetcher';
import SilverSurferContextMapper from '@wikia/ad-services/silver-surfer/silver-surfer-context-mapper';
import { SilverSurferService } from '@wikia/ad-services';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Silver Surfer service', () => {
	const sandbox = sinon.createSandbox();
	let getProfileStub;
	let getContextStub;
	let silverSurferService;

	const userProfile: UserProfile = {
		beaconId: 'test',
		gender: ['m'],
		ageBrackets: ['0-12', '13-17', '18-24'],
		adTags: {},
		time: 123456789,
		interactions: ['featured video'],
	};

	const silverSurferContext: SilverSurferContext = {
		pages: [
			{ product: 'mw', productId: 'nw', time: 0 },
			{ product: 'dis', productId: 'dis', time: 1 },
			{ product: 'mw', productId: 'nw', time: 2 },
		],
		current: undefined,
		slots: undefined,
	};

	const silverSurferConfig = [
		'ageBrackets:g_age_bracket',
		'gender:g_gender',
		'keyMissingFromConfig:g_key_missing_from_config',
		'interactions:g_interactions',
	];

	beforeEach(() => {
		const fetcher = new SilverSurferProfileFetcher();
		const mapper = new SilverSurferContextMapper();

		getProfileStub = sandbox
			.stub(fetcher, 'getUserProfile')
			.callsFake(() => Promise.resolve(userProfile));
		getContextStub = sandbox.stub(mapper, 'getContext').callsFake(() => silverSurferContext);
		silverSurferService = new SilverSurferService(fetcher, mapper);
	});

	afterEach(() => {
		context.remove('services.silverSurfer');
		sandbox.restore();
	});

	it('configures fetched user profile in context targeting', async () => {
		context.set('services.silverSurfer', silverSurferConfig);
		const configuredTargeting = await silverSurferService.configureUserTargeting();

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
		const configuredTargeting = await silverSurferService.configureUserTargeting();

		expect(getProfileStub.called).to.be.false;
		expect(configuredTargeting).to.deep.equal({});
	});
});
