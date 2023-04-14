import { registerUapListener, universalAdPackage } from '@wikia/ad-products';
import { communicationService, eventsRepository } from '@wikia/communication';
import {
	AdSlotEvent,
	AdSlotStatus,
	Context,
	context,
	TargetingService,
	targetingService,
} from '@wikia/core';
import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { SinonSpy, SinonStubbedInstance } from 'sinon';

describe('UniversalAdPackage', () => {
	const UAP_ID = 666;
	const UAP_CREATIVE_ID = 333;
	const UAP_STANDARD_AD_PRODUCT = 'uap';
	let contextStub: SinonStubbedInstance<Context>;
	let targetingServiceStub: SinonStubbedInstance<TargetingService>;
	const uapLoadStatus = communicationService.getGlobalAction(
		eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
	);

	beforeEach(() => {
		targetingServiceStub = global.sandbox.stub(targetingService);

		contextStub = global.sandbox.stub(context);
		contextStub.get.withArgs('slots').returns({ top_leaderboard: {}, top_boxad: {} });
	});

	it('should update every slots context when uap is updated', () => {
		universalAdPackage.init({
			lineItemId: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
		} as any);

		expect(targetingServiceStub.set.calledWith('uap', UAP_ID, 'top_leaderboard')).to.equal(true);
		expect(
			targetingServiceStub.set.calledWith('uap_c', UAP_CREATIVE_ID, 'top_leaderboard'),
		).to.equal(true);
		expect(targetingServiceStub.set.calledWith('uap', UAP_ID, 'top_boxad')).to.equal(true);
		expect(targetingServiceStub.set.calledWith('uap_c', UAP_CREATIVE_ID, 'top_boxad')).to.equal(
			true,
		);
		expect(targetingServiceStub.set.callCount).to.equal(4);
	});

	it.skip("should use slot's default video ad unit with default settings from GAM", () => {
		// ToDo: broken after ad-engine to core rename
		universalAdPackage.init({
			lineItemId: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
			slotName: 'top_leaderboard',
			useVideoSpecialAdUnit: false,
		} as any);

		expect(
			targetingServiceStub.set.calledWith('special_ad_unit', 'slots.top_leaderboard.videoAdUnit'),
		).to.equal(false);
	});

	it.skip('should use special ad video unit with the right settings from GAM', () => {
		// ToDo: broken after ad-engine to core rename
		universalAdPackage.init({
			lineItemId: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
			slotName: 'top_leaderboard',
			useVideoSpecialAdUnit: true,
		} as any);

		expect(
			targetingServiceStub.set.calledWith('videoAdUnit', '/5441/uap', 'top_leaderboard'),
		).to.equal(true);
	});

	describe('registerUapListener (UAP Load Status listener - side effect)', () => {
		const isFanTakeoverLoaded = true;
		const adSlotName = 'Slot1';
		let dispatch: SinonSpy;

		beforeEach(() => {
			dispatch = global.sandbox.spy(communicationService, 'dispatch');
			contextStub.get.withArgs('slots.Slot1.firstCall').returns(true);
			global.sandbox.stub(universalAdPackage, 'isFanTakeoverLoaded').returns(isFanTakeoverLoaded);
		});

		afterEach(() => {
			global.sandbox.reset();
		});

		it('should emit event with load status if slot collapsed', () => {
			global.sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
						adSlotName,
						event: AdSlotStatus.STATUS_COLLAPSE,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});

		it('should emit event with load status if slot forcibly collapsed', () => {
			global.sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
						adSlotName,
						event: AdSlotStatus.STATUS_FORCED_COLLAPSE,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});

		it('should emit event with load status when templates are loaded', () => {
			global.sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
						adSlotName,
						event: AdSlotEvent.TEMPLATES_LOADED,
					}),
				),
			);

			registerUapListener();

			expect(dispatch.callCount).to.equal(1);
			expect(dispatch.firstCall.args[0]).to.deep.equal(
				uapLoadStatus({
					isLoaded: isFanTakeoverLoaded,
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});
	});
});
