import { communicationService, eventsRepository } from '@wikia/communication';
import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { createSandbox, SinonSandbox, SinonSpy, SinonStubbedInstance } from 'sinon';
import { AdSlot, Context, context } from '../../../../src/ad-engine';
import {
	registerUapListener,
	universalAdPackage,
} from '../../../../src/ad-products/templates/uap/universal-ad-package';

describe('UniversalAdPackage', () => {
	const UAP_ID = 666;
	const UAP_CREATIVE_ID = 333;
	const UAP_STANDARD_AD_PRODUCT = 'uap';
	const sandbox: SinonSandbox = createSandbox();
	let contextStub: SinonStubbedInstance<Context>;
	const uapLoadStatus = communicationService.getGlobalAction(
		eventsRepository.AD_ENGINE_UAP_LOAD_STATUS,
	);

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		contextStub = sandbox.stub(context);
	});

	it('should update every slots context when uap is updated', () => {
		contextStub.get.withArgs('slots').returns({ top_leaderboard: {}, top_boxad: {} });

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

	it("should use slot's default video ad unit with default settings from GAM", () => {
		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
			slotName: 'top_leaderboard',
			useVideoSpecialAdUnit: false,
		} as any);

		expect(
			contextStub.set.calledWith('slots.top_leaderboard.videoAdUnit', 'special_ad_unit'),
		).to.equal(false);
	});

	it('should use special ad video unit with the right settings from GAM', () => {
		universalAdPackage.init({
			uap: UAP_ID,
			creativeId: UAP_CREATIVE_ID,
			slotName: 'top_leaderboard',
			useVideoSpecialAdUnit: true,
		} as any);

		expect(contextStub.set.calledWith('slots.top_leaderboard.videoAdUnit', '/5441/uap')).to.equal(
			true,
		);
	});

	describe('registerUapListener (UAP Load Status listener - side effect)', () => {
		const isFanTakeoverLoaded = true;
		const adSlotName = 'Slot1';
		let dispatch: SinonSpy;

		beforeEach(() => {
			dispatch = sandbox.spy(communicationService, 'dispatch');
			contextStub.get.withArgs('slots.Slot1.firstCall').returns(true);
			sandbox.stub(universalAdPackage, 'isFanTakeoverLoaded').returns(isFanTakeoverLoaded);
		});

		afterEach(() => {
			sandbox.reset();
		});

		it('should emit event with load status if slot collapsed', () => {
			sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
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
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});

		it('should emit event with load status if slot forcibly collapsed', () => {
			sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
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
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});

		it('should emit event with load status when templates are loaded', () => {
			sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.AD_ENGINE_SLOT_EVENT)({
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
					adProduct: UAP_STANDARD_AD_PRODUCT,
				}),
			);
		});
	});
});
