import { context, GptProvider } from '@wikia/core';
import { expect } from 'chai';
import { spy, stub } from 'sinon';

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
			setPrivacySettings: spy(),
			setPublisherProvidedId: spy(),
			setTargeting: spy(),
			updateCorrelator: spy(),
		};

		window.googletag = {
			pubads: () => pubads,
			enableServices: spy(),
		} as any;

		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push = ((cb) => {
			cb();
		}) as any;

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
			expect(pubads.addEventListener.callCount).to.equal(7);
			done();
		});
	});

	it('initialise with restrict data processing when user opt-out from data sale', () => {
		context.set('options.optOutSale', true);

		provider = new GptProvider();
		provider.setupRestrictDataProcessing();

		expect(pubads.setPrivacySettings.calledWith({ restrictDataProcessing: true })).to.be.true;
	});
});
