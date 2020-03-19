import { expect } from 'chai';
import { context } from '../../../src/ad-engine/services/context-service';
import { trackingOptIn } from '../../../src/ad-engine/services/tracking-opt-in';

describe('tracking-opt-in', () => {
	function clearContext() {
		context.remove('options.isSubjectToCoppa');
		context.remove('options.trackingOptIn');
		context.remove('options.optOutSale');
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
		].forEach(([coppa, optIn, result]) => {
			it(`should return ${result} when options.trackingOptIn is ${optIn} and options.isSubjectToCoppa is ${coppa}`, () => {
				context.set('options.isSubjectToCoppa', coppa);
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
		].forEach(([coppa, optOutSale, result]) => {
			it(`should return ${result} when options.optOutSale is ${optOutSale} and options.isSubjectToCoppa is ${coppa}`, () => {
				context.set('options.isSubjectToCoppa', coppa);
				context.set('options.optOutSale', optOutSale);

				expect(trackingOptIn.isOptOutSale()).to.equal(result);
			});
		});
	});
});
