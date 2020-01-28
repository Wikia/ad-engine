import { expect } from 'chai';
import { spy, stub } from 'sinon';
import { GptProvider } from '../../../src/ad-engine/providers/gpt-provider';
import { context } from '../../../src/ad-engine/services/context-service';

let provider;
let pubads;
let isInitializedCb;

describe('gpt-provider', () => {
	before(() => {
		isInitializedCb = stub(GptProvider.prototype, 'isInitialized');
	});

	after(() => {
		isInitializedCb.reset();
		context.removeListeners('targeting');
	});

	beforeEach(() => {
		isInitializedCb.returns(false);

		pubads = {
			addEventListener: spy(),
			disableInitialLoad: spy(),
			enableSingleRequest: spy(),
			setRequestNonPersonalizedAds: spy(),
			setPrivacySettings: spy(),
			setTargeting: spy(),
		};

		window.googletag = {
			pubads: () => pubads,
			enableServices: spy(),
		};

		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push = (cb) => {
			cb();
		};

		context.set('options.trackingOptIn', true);
	});

	afterEach(() => {
		isInitializedCb.reset();
	});

	it('initialise and setup gpt provider', (done) => {
		isInitializedCb.callThrough();

		provider = new GptProvider();
		provider = new GptProvider();
		provider = new GptProvider();

		setTimeout(() => {
			expect(pubads.disableInitialLoad.called).to.be.true;
			expect(pubads.enableSingleRequest.called).to.be.false;
			expect(pubads.addEventListener.callCount).to.equal(4);
			expect(pubads.setRequestNonPersonalizedAds.calledWith(0)).to.be.true;
			done();
		});
	});

	it('initialise with non personalized ads when tracking in is disabled', () => {
		context.set('options.trackingOptIn', false);

		provider = new GptProvider();
		provider.setupNonPersonalizedAds();

		expect(pubads.setRequestNonPersonalizedAds.calledWith(1)).to.be.true;
	});

	it('initialise with restrict data processing when user opt-out from data sale', () => {
		context.set('options.optOutSale', true);

		provider = new GptProvider();
		provider.setupRestrictDataProcessing();

		expect(pubads.setPrivacySettings.calledWith({ restrictDataProcessing: true })).to.be.true;
	});
});
