import { context, trackingOptIn } from '@wikia/core';
import { expect } from 'chai';

describe('tracking-opt-in', () => {
	function clearContext(): void {
		context.remove('options.isSubjectToCcpa');
		context.remove('options.trackingOptIn');
		context.remove('options.optOutSale');
		context.remove('options.geoRequiresConsent');
	}
	beforeEach(clearContext);

	after(clearContext);

	describe('isOptedIn', () => {
		[
			[undefined, undefined, false],
			[true, undefined, false],
			[false, undefined, false],
			[undefined, true, true],
			[true, true, true],
			[false, true, true],
			[undefined, false, false],
			[true, false, false],
			[false, false, false],
		].forEach(([ccpa, optIn, result]) => {
			it(`should return ${result} when options.trackingOptIn is ${optIn} and options.isSubjectToCcpa is ${ccpa}`, () => {
				context.set('options.isSubjectToCcpa', ccpa);
				context.set('options.trackingOptIn', optIn);

				expect(trackingOptIn.isOptedIn()).to.equal(result);
			});
		});
	});

	describe('isOptOutSale', () => {
		[
			[undefined, undefined, false],
			[true, undefined, true],
			[false, undefined, false],
			[undefined, true, true],
			[true, true, true],
			[false, true, true],
			[undefined, false, false],
			[true, false, true],
			[false, false, false],
		].forEach(([ccpa, optOutSale, result]) => {
			it(`should return ${result} when options.optOutSale is ${optOutSale} and options.isSubjectToCcpa is ${ccpa}`, () => {
				context.set('options.isSubjectToCcpa', ccpa);
				context.set('options.optOutSale', optOutSale);

				expect(trackingOptIn.isOptOutSale()).to.equal(result);
			});
		});
	});

	describe('getConsentData', () => {
		it('should call __tcfapi from IAB for the GDPR consent string', () => {
			global.window.__tcfapi =
				global.window.__tcfapi || (function () {} as typeof global.window.__tcfapi);
			const tcfApiSpy = global.sandbox.spy(window, '__tcfapi');
			context.set('options.geoRequiresConsent', true);

			const consetData = trackingOptIn.getConsentData();

			expect(tcfApiSpy.calledOnce).to.be.true;
			expect(consetData.type).to.eq('gdpr');
		});

		it('should call __uspapi from IAB for the US consent string', () => {
			global.window.__uspapi =
				global.window.__uspapi || (function () {} as typeof global.window.__uspapi);
			const uspApiSpy = global.sandbox.spy(window, '__uspapi');
			context.set('options.geoRequiresConsent', false);

			const consetData = trackingOptIn.getConsentData();

			expect(uspApiSpy.calledOnce).to.be.true;
			expect(consetData.type).to.eq('ccpa');
		});
	});
});
