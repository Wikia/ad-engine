import { expect } from 'chai';
import { spy } from 'sinon';
import { GptProvider } from '../../src/providers/gpt-provider';
import { context } from '../../src/services/context-service';

let provider;
let pubads;

describe('gpt-provider', () => {
	beforeEach(() => {
		pubads = {
			addEventListener: spy(),
			disableInitialLoad: spy(),
			enableSingleRequest: spy(),
			setRequestNonPersonalizedAds: spy()
		};

		window.googletag = {
			pubads: () => pubads,
			enableServices: spy()
		};

		window.googletag.cmd = window.googletag.cmd || [];
		window.googletag.cmd.push = (cb) => {
			cb();
		};

		context.set('options.trackingOptIn', true);
	});

	it('initialise and setup gpt provider', () => {
		provider = new GptProvider();

		expect(pubads.disableInitialLoad.called).to.be.true;
		expect(pubads.enableSingleRequest.called).to.be.true;
		expect(pubads.addEventListener.calledTwice).to.be.true;
		expect(pubads.setRequestNonPersonalizedAds.calledWith(0)).to.be.true;
	});

	it('initialise with non personalized ads when tracking in is disabled', () => {
		context.set('options.trackingOptIn', false);

		provider = new GptProvider();
		provider.setupNonPersonalizedAds();

		expect(pubads.setRequestNonPersonalizedAds.calledWith(1)).to.be.true;
	});
});
