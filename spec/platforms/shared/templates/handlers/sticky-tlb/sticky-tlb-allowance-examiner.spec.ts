import { AdSlot, context } from '@wikia/core';
import { StickyTlbAllowanceExaminer } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('StickyTlbAllowanceExaminer', () => {
	const testSlot: AdSlot | null = new AdSlot({ id: 'top_leaderboard' });

	it('return `true` when Sticky-TLB is forced by ICBM variable', async () => {
		const examiner = new StickyTlbAllowanceExaminer(testSlot);
		const contextGetStub = global.sandbox.stub(context, 'get');
		contextGetStub.withArgs('templates.stickyTlb.forced').returns(true);

		const result = examiner.shouldStick();
		expect(result).to.be.true;
		expect(contextGetStub.callCount).to.be.eq(1);
	});

	describe('with Sticky-Tlb-forced = false', () => {
		let contextGetStub;

		beforeEach(() => {
			contextGetStub = global.sandbox.stub(context, 'get');
			contextGetStub.withArgs('templates.stickyTlb.forced').returns(false);

			testSlot.lineItemId = 9123;
			testSlot.orderId = 1239;
		});

		afterEach(() => {
			global.sandbox.restore();
		});

		it('return `false` when nothing else is set', async () => {
			const examiner = new StickyTlbAllowanceExaminer(testSlot);
			const result = examiner.shouldStick();

			expect(result).to.be.false;
			expect(contextGetStub.callCount).to.be.eq(3);
		});

		it('return `true` when lineItemIds was set in ICBM variable', async () => {
			const examiner = new StickyTlbAllowanceExaminer(testSlot);

			contextGetStub.withArgs('templates.stickyTlb.lineItemIds').returns(['9123']);

			const result = examiner.shouldStick();

			expect(result).to.be.true;
			expect(contextGetStub.callCount).to.be.eq(2);
		});

		it('return `true` when orderIds was set in ICBM variable', async () => {
			const examiner = new StickyTlbAllowanceExaminer(testSlot);

			contextGetStub.withArgs('templates.stickyTlb.ordersIds').returns(['1239']);

			const result = examiner.shouldStick();

			expect(result).to.be.true;
			expect(contextGetStub.callCount).to.be.eq(3);
		});
	});
});
