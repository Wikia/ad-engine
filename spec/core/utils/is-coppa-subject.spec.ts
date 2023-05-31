import { CookieStorageAdapter } from '@wikia/core';
import { context } from '@wikia/core/services/context-service';
import { isCoppaSubject } from '@wikia/core/utils';
import { expect } from 'chai';

describe('isCoppaSubject', () => {
	it('should return false when wiki is not directedAtChildren', () => {
		// given
		global.sandbox
			.stub(context, 'get')
			.withArgs('wiki.targeting.directedAtChildren')
			.returns(false);

		// when
		const result = isCoppaSubject();

		// then
		expect(result).to.be.false;
	});

	describe('AgeGate handling', () => {
		it('should return directedAtChildren when AgeGate result is not set', () => {
			// given
			global.sandbox
				.stub(context, 'get')
				.withArgs('wiki.targeting.directedAtChildren')
				.returns(true)
				.withArgs('services.ageGateHandling')
				.returns(true);

			// when
			const result = isCoppaSubject();

			// then
			expect(result).to.be.true;
		});

		const testCases = [
			{ ageGateCookie: '', expected: true },
			{ ageGateCookie: 'incorrect', expected: true },
			{ ageGateCookie: '0', expected: true },
			{ ageGateCookie: '1', expected: false },
		];
		testCases.forEach((testCase, idx) => {
			it(`should return AgeGate result when set #${idx}`, () => {
				// given
				global.sandbox
					.stub(context, 'get')
					.withArgs('wiki.targeting.directedAtChildren')
					.returns(true)
					.withArgs('services.ageGateHandling')
					.returns(true);
				global.sandbox
					.stub(CookieStorageAdapter.prototype, 'getItem')
					.returns(testCase.ageGateCookie);

				// when
				const result = isCoppaSubject();

				// then
				expect(result).to.equal(testCase.expected);
			});
		});
	});
});
