import { expect } from 'chai';
import sinon from 'sinon';
import { context } from '../../../../src/ad-engine';
import { universalAdPackage } from '../../../../src/ad-products/templates/uap/universal-ad-package';

describe('UniversalAdPackage', () => {
	const UAP_ID = 666;
	const UAP_CREATIVE_ID = 333;
	let sandbox;

	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(context, 'get');
		sandbox.spy(context, 'set');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should update every slots context when uap is updated', () => {
		context.get.withArgs('slots').returns({ top_leaderboard: {}, top_boxad: {} });
		context.get.withArgs('slots.top_leaderboard.nonUapSlot').returns(undefined);
		context.get.withArgs('slots.top_boxad.nonUapSlot').returns(undefined);

		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
		});

		expect(context.set.calledWith('slots.top_leaderboard.targeting.uap', UAP_ID)).to.equal(true);
		expect(
			context.set.calledWith('slots.top_leaderboard.targeting.uap_c', UAP_CREATIVE_ID),
		).to.equal(true);
		expect(context.set.calledWith('slots.top_boxad.targeting.uap', UAP_ID)).to.equal(true);
		expect(context.set.calledWith('slots.top_boxad.targeting.uap_c', UAP_CREATIVE_ID)).to.equal(
			true,
		);
		expect(context.set.callCount).to.equal(4);
	});

	it('should not update slot with blocked uap parameter', () => {
		context.get.withArgs('slots').returns({
			top_leaderboard: {},
			NON_UAP_SLOT: {
				nonUapSlot: true,
			},
			top_boxad: {},
		});

		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
		});

		expect(context.set.calledWith('slots.top_leaderboard.targeting.uap', UAP_ID)).to.equal(true);
		expect(
			context.set.calledWith('slots.top_leaderboard.targeting.uap_c', UAP_CREATIVE_ID),
		).to.equal(true);
		expect(context.set.calledWith('slots.top_boxad.targeting.uap', UAP_ID)).to.equal(true);
		expect(context.set.calledWith('slots.top_boxad.targeting.uap_c', UAP_CREATIVE_ID)).to.equal(
			true,
		);
		expect(context.set.neverCalledWith('slots.NON_UAP_SLOT.targeting.uap', UAP_ID)).to.equal(true);
		expect(context.set.callCount).to.equal(4);
	});
});
