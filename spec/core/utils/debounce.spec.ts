import { debounce, withDebounce } from '@wikia/core/utils';
import { expect } from 'chai';

describe('debounce', () => {
	describe('withDebounce HOF', () => {
		it('should call debounced function only once', () => {
			// given
			const clock = global.sandbox.useFakeTimers();
			const original = global.sandbox.spy();
			const debounced = withDebounce(original, 100);

			// when
			debounced();
			debounced();
			debounced();

			// then
			expect(original.calledOnce).to.equal(false);
			clock.tick(110);
			expect(original.calledOnce).to.equal(true);
			clock.restore();
		});
	});

	describe('debounce decorator', () => {
		it('should call debounced method only once', () => {
			// given
			const clock = global.sandbox.useFakeTimers();
			const original = global.sandbox.spy();

			class DebounceTestClass {
				@debounce(100)
				public debounced(): void {
					original();
				}
			}

			const debounceTestClass = new DebounceTestClass();

			// when
			debounceTestClass.debounced();
			debounceTestClass.debounced();
			debounceTestClass.debounced();

			// then
			expect(original.calledOnce).to.equal(false);
			clock.tick(110);
			expect(original.calledOnce).to.equal(true);
			clock.restore();
		});
	});
});
