import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { BrowserMatcher } from '@wikia/ad-services/instant-config/matchers/browser-matcher';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/matchers/device-matcher';
import { DomainMatcher } from '@wikia/ad-services/instant-config/matchers/domain-matcher';
import { RegionMatcher } from '@wikia/ad-services/instant-config/matchers/region-matcher';
import { SamplingCacheManager } from '@wikia/ad-services/instant-config/matchers/sampling-cache.manager';
import { expect } from 'chai';
import * as sinon from 'sinon';

type MatchersResponses = [boolean, boolean, boolean, boolean];

describe('Instant Config Interpreter', () => {
	let interpreter: InstantConfigInterpreter;
	const browserMatcher = new BrowserMatcher();
	let browserIsValidStub: sinon.SinonStub;
	const deviceMatcher = new DeviceMatcher();
	let deviceIsValidStub: sinon.SinonStub;
	const domainMatcher = new DomainMatcher();
	let domainIsValidStub: sinon.SinonStub;
	const regionMatcher = new RegionMatcher();
	let regionIsValidStub: sinon.SinonStub;
	let samplingCacheApplyStub: sinon.SinonStub;

	beforeEach(() => {
		samplingCacheApplyStub = sinon.stub(SamplingCacheManager.prototype, 'apply');
		samplingCacheApplyStub.callsFake((a, b, predicate) => predicate());
		browserIsValidStub = sinon.stub(browserMatcher, 'isValid');
		deviceIsValidStub = sinon.stub(deviceMatcher, 'isValid');
		domainIsValidStub = sinon.stub(domainMatcher, 'isValid');
		regionIsValidStub = sinon.stub(regionMatcher, 'isValid');
		interpreter = new InstantConfigInterpreter(
			browserMatcher,
			deviceMatcher,
			domainMatcher,
			regionMatcher,
		);
	});

	afterEach(() => {
		samplingCacheApplyStub.restore();
		browserIsValidStub.restore();
		deviceIsValidStub.restore();
		domainIsValidStub.restore();
		regionIsValidStub.restore();
	});

	it('should not change wgAdDriver', () => {
		const instantConfig = {};
		const instantGlobals = {
			wgAdDriverA9BidderCountries: ['PL'],
			wgAdDriverA9DealsCountries: ['PL'],
		};

		expect(interpreter.getValues(instantConfig, instantGlobals)).to.deep.equal({
			wgAdDriverA9BidderCountries: ['PL'],
			wgAdDriverA9DealsCountries: ['PL'],
		});
		expect(browserIsValidStub.getCalls().length).to.equal(0);
	});

	it('should overwrite wgAdDriver', () => {
		const instantConfig = {
			wgAdDriverA9BidderCountries: ['XX'],
		};
		const instantGlobals = {
			wgAdDriverA9BidderCountries: ['PL'],
			wgAdDriverA9DealsCountries: ['PL'],
		};

		expect(interpreter.getValues(instantConfig, instantGlobals)).to.deep.equal({
			wgAdDriverA9BidderCountries: ['XX'],
			wgAdDriverA9DealsCountries: ['PL'],
		});
		expect(browserIsValidStub.getCalls().length).to.equal(0);
	});

	it('should return correct values', () => {
		const instantConfig = {
			wgAdDriverA9BidderCountries: ['XX'],
			a9BidderCountries: [{ value: false }],
			babDetection: [{ value: true }],
		};
		const instantGlobals = {
			wgAdDriverA9BidderCountries: ['PL'],
			wgAdDriverA9DealsCountries: ['PL'],
		};

		mockResponses([true, true, true, true], [true, true, false, true]);
		expect(interpreter.getValues(instantConfig, instantGlobals)).to.deep.equal({
			wgAdDriverA9BidderCountries: ['XX'],
			wgAdDriverA9DealsCountries: ['PL'],
			a9BidderCountries: false,
			babDetection: undefined,
		});
	});

	it('should return true if no value', () => {
		const instantConfig = { babDetection: [{}] };

		mockResponses([true, true, true, true]);
		expect(interpreter.getValues(instantConfig).babDetection).to.equal(true);
	});

	it('should return value of the first correct group', () => {
		const instantConfig = {
			babDetection: [{ value: 1 }, { value: 2 }, { value: 3 }],
		};

		mockResponses([false, true, true, true], [true, true, true, true], [true, true, true, true]);

		expect(interpreter.getValues(instantConfig).babDetection).to.equal(2);
		expect(browserIsValidStub.getCalls().length).to.equal(2);
	});

	it('should receive correct arguments', () => {
		const instantConfig = {
			babDetection: [
				{
					browsers: ['Chrome', 'Firefox'],
					devices: ['desktop'],
					domains: ['fandom.com'],
					regions: ['PL'],
					sampling: 30,
					cache: true,
					value: true,
				},
			],
		};

		mockResponses([true, true, true, true]);
		interpreter.getValues(instantConfig);

		expect(browserIsValidStub.firstCall.args[0]).to.equal(instantConfig.babDetection[0].browsers);
		expect(deviceIsValidStub.firstCall.args[0]).to.equal(instantConfig.babDetection[0].devices);
		expect(domainIsValidStub.firstCall.args[0]).to.equal(instantConfig.babDetection[0].domains);
		expect(regionIsValidStub.firstCall.args[0]).to.equal(instantConfig.babDetection[0].regions);
	});

	it('should fail for either matcher', () => {
		const input = {
			babDetection: [{ value: true }],
		};
		const expectedOutput = {
			babDetection: undefined,
		};

		mockResponses(
			[false, true, true, true],
			[true, false, true, true],
			[true, true, false, true],
			[true, true, true, false],
			[false, false, false, false],
			[true, true, true, true],
		);
		expect(interpreter.getValues(input)).to.deep.equal(expectedOutput);
		expect(interpreter.getValues(input)).to.deep.equal(expectedOutput);
		expect(interpreter.getValues(input)).to.deep.equal(expectedOutput);
		expect(interpreter.getValues(input)).to.deep.equal(expectedOutput);
		expect(interpreter.getValues(input)).to.deep.equal(expectedOutput);
		expect(interpreter.getValues(input)).to.deep.equal({ babDetection: true });
	});

	it('should pass correct arguments to samplingCache', () => {
		const instantConfig = { babDetection: [{}] };

		mockResponses([true, true, true, true]);
		interpreter.getValues(instantConfig);

		const [id, group, predicate] = samplingCacheApplyStub.getCalls()[0].args;

		expect(samplingCacheApplyStub.getCalls().length).to.equal(1);
		expect(id).to.equal('babDetection-0');
		expect(group).to.deep.equal({});
		expect(typeof predicate).to.equal('function');
	});

	function mockResponses(...responses: MatchersResponses[]): void {
		let browserCounter = 0;
		let deviceCounter = 0;
		let domainCounter = 0;
		let regionCounter = 0;

		responses.forEach((response) => {
			browserIsValidStub.onCall(browserCounter++).returns(response[0]);
			if (response[0] === false) {
				return;
			}

			deviceIsValidStub.onCall(deviceCounter++).returns(response[1]);
			if (response[1] === false) {
				return;
			}

			domainIsValidStub.onCall(domainCounter++).returns(response[2]);
			if (response[2] === false) {
				return;
			}
			regionIsValidStub.onCall(regionCounter++).returns(response[3]);
		});
	}
});
