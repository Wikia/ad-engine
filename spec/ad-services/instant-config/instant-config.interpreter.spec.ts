import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { BrowserMatcher } from '@wikia/ad-services/instant-config/matchers/browser-matcher';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/matchers/device-matcher';
import { DomainMatcher } from '@wikia/ad-services/instant-config/matchers/domain-matcher';
import { RegionMatcher } from '@wikia/ad-services/instant-config/matchers/region-matcher';
import { expect } from 'chai';
import * as sinon from 'sinon';

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

	beforeEach(() => {
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
		browserIsValidStub.restore();
		deviceIsValidStub.restore();
		domainIsValidStub.restore();
		regionIsValidStub.restore();
	});

	it('should return correct values', () => {
		const instantConfig = {
			wgAdDriverA9BidderCountries: ['XX'],
			a9BidderCountries: [{ value: false }],
		};
		const instantGlobals = {
			wgAdDriverA9BidderCountries: ['PL'],
			wgAdDriverA9DealsCountries: ['PL'],
		};

		browserIsValidStub.returns(true);
		deviceIsValidStub.returns(true);
		domainIsValidStub.returns(true);
		regionIsValidStub.returns(true);

		expect(interpreter.getValues(instantConfig, instantGlobals)).to.deep.equal({
			wgAdDriverA9BidderCountries: ['XX'],
			wgAdDriverA9DealsCountries: ['PL'],
			a9BidderCountries: false,
		});
	});
});
