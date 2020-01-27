import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { createSandbox, SinonSandbox, SinonSpy, SinonStubbedInstance } from 'sinon';
import { AdSlot, adSlotEvent, Context, context, eventService } from '../../../../src/ad-engine';
import {
	registerUapListener,
	uapLoadStatus,
	universalAdPackage,
} from '../../../../src/ad-products/templates/uap/universal-ad-package';

describe('UniversalAdPackage', () => {
	const UAP_ID = 666;
	const UAP_CREATIVE_ID = 333;
	const sandbox: SinonSandbox = createSandbox();
	let contextStub: SinonStubbedInstance<Context>;

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		contextStub = sandbox.stub(context);
	});

	it('should update every slots context when uap is updated', () => {
		contextStub.get.withArgs('slots').returns({ top_leaderboard: {}, top_boxad: {} });
		contextStub.get.withArgs('slots.top_leaderboard.nonUapSlot').returns(undefined);
		contextStub.get.withArgs('slots.top_boxad.nonUapSlot').returns(undefined);

		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
		} as any);

		expect(contextStub.set.calledWith('slots.top_leaderboard.targeting.uap', UAP_ID)).to.equal(
			true,
		);
		expect(
			contextStub.set.calledWith('slots.top_leaderboard.targeting.uap_c', UAP_CREATIVE_ID),
		).to.equal(true);
		expect(contextStub.set.calledWith('slots.top_boxad.targeting.uap', UAP_ID)).to.equal(true);
		expect(contextStub.set.calledWith('slots.top_boxad.targeting.uap_c', UAP_CREATIVE_ID)).to.equal(
			true,
		);
		expect(contextStub.set.callCount).to.equal(4);
	});

	it('should not update slot with blocked uap parameter', () => {
		contextStub.get.withArgs('slots').returns({
			top_leaderboard: {},
			NON_UAP_SLOT: {
				nonUapSlot: true,
			},
			top_boxad: {},
		});

		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
		} as any);

		expect(contextStub.set.calledWith('slots.top_leaderboard.targeting.uap', UAP_ID)).to.equal(
			true,
		);
		expect(
			contextStub.set.calledWith('slots.top_leaderboard.targeting.uap_c', UAP_CREATIVE_ID),
		).to.equal(true);
		expect(contextStub.set.calledWith('slots.top_boxad.targeting.uap', UAP_ID)).to.equal(true);
		expect(contextStub.set.calledWith('slots.top_boxad.targeting.uap_c', UAP_CREATIVE_ID)).to.equal(
			true,
		);
		expect(contextStub.set.neverCalledWith('slots.NON_UAP_SLOT.targeting.uap', UAP_ID)).to.equal(
			true,
		);
		expect(contextStub.set.callCount).to.equal(4);
	});

	describe('registerUapListener (UAP Load Status listener - side effect)', () => {
		const isFanTakeoverLoaded = true;
		const adSlotName = 'Slot1';
		let dispatch: SinonSpy;

		beforeEach(() => {
			dispatch = sandbox.spy(eventService.communicator, 'dispatch');
			sandbox.stub(universalAdPackage, 'isFanTakeoverLoaded').returns(isFanTakeoverLoaded);
		});

		afterEach(() => {
			sandbox.reset();
		});

		it('should emit event with load status if slot collapsed', () => {
			sandbox.stub(eventService.communicator, 'actions$').value(
				new BehaviorSubject(
					adSlotEvent({
						adSlotName,
						event: AdSlot.STATUS_COLLAPSE,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
				}),
			);
		});

		it('should emit event with load status if slot forcibly collapsed', () => {
			sandbox.stub(eventService.communicator, 'actions$').value(
				new BehaviorSubject(
					adSlotEvent({
						adSlotName,
						event: AdSlot.STATUS_FORCED_COLLAPSE,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
				}),
			);
		});

		it('should emit event with load status when templates are loaded', () => {
			sandbox.stub(eventService.communicator, 'actions$').value(
				new BehaviorSubject(
					adSlotEvent({
						adSlotName,
						event: AdSlot.TEMPLATES_LOADED,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
				}),
			);
		});
	});
});
