import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { BrowserMatcher } from '@wikia/ad-services/instant-config/matchers/browser-matcher';
import { DeviceMatcher } from '@wikia/ad-services/instant-config/matchers/device-matcher';
import { DomainMatcher } from '@wikia/ad-services/instant-config/matchers/domain-matcher';
import { RegionMatcher } from '@wikia/ad-services/instant-config/matchers/region-matcher';
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
			babDetection: false,
		});
	});

	it('should return true if no value');

	it('should receive correct arguments');

	it('should fail for either matcher', () => {
		const input = {
			babDetection: [{ value: true }],
		};
		const expectedOutput = {
			babDetection: false,
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
