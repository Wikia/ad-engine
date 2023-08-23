import { context, trackingOptIn } from '@wikia/core';
import { expect } from 'chai';

describe('tracking-opt-in', () => {
	function clearContext(): void {
		context.remove('options.isSubjectToCcpa');
		context.remove('options.adsAllowed');
	}
	beforeEach(clearContext);

	after(clearContext);

	describe('adsAllowed', () => {
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
		].forEach(([ccpa, allowed, result]) => {
			it(`should return ${result} when options.trackingOptIn is ${allowed} and options.isSubjectToCcpa is ${ccpa}`, () => {
				context.set('options.isSubjectToCcpa', ccpa);
				context.set('options.adsAllowed', allowed);

				expect(trackingOptIn.isOptedIn()).to.equal(result);
			});
		});
	});
});
