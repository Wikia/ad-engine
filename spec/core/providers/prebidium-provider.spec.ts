import { communicationService } from '@wikia/communication';
import { PrebidiumProvider, targetingService } from '@wikia/core';
import { IframeBuilder } from '@wikia/core/utils';
import { assert } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { PbjsStub, stubPbjs } from '../services/pbjs.stub';
import { BIDDERS_BIDDING_DONE } from "@wikia/communication/events/events-bidders";

describe('PrebidiumProvider', () => {
	let prebidiumProvider: PrebidiumProvider;
	const contextStub = {
		get: undefined,
	};
	let pbjsStub: PbjsStub;
	const mock = {
		doc: 'mock_document',
		adId: 'mock_ad_id',
		slotName: 'mock_slot_name',
		element: 'mock_slot_element',
	};

	beforeEach(() => {
		prebidiumProvider = new PrebidiumProvider();

		stubIframeBuilder();
		contextStub.get = global.sandbox.stub(targetingService, 'get').returns(mock.adId);
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
	});

	describe('fillIn', () => {
		let adSlot;

		beforeEach(async () => {
			adSlot = {
				successCalled: false,
				getSlotName: () => mock.slotName,
				getElement: () => mock.slotName,
				success(): void {
					this.successCalled = true;
				},
			};

			global.sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(BIDDERS_BIDDING_DONE)({
						slotName: mock.slotName,
						provider: 'prebid',
					}),
				),
			);

			await prebidiumProvider.fillIn(adSlot);
		});

		it('should call renderAd', () => {
			const [doc, adId] = pbjsStub.renderAd.getCall(0).args;

			assert(pbjsStub.renderAd.calledOnce);
			assert.equal(doc, mock.doc);
			assert.equal(adId, mock.adId);
			assert.isTrue(adSlot.successCalled);
		});

		it('should call context get with correct argument', () => {
			const callArguments = contextStub.get.getCall(0).args;

			assert(contextStub.get.calledOnce);
			assert.equal(callArguments[0], 'hb_adid');
			assert.equal(callArguments[1], mock.slotName);
		});
	});

	function stubIframeBuilder(): void {
		global.sandbox.stub(IframeBuilder.prototype, 'create').returns({
			contentWindow: {
				document: mock.doc,
			},
		} as any);
	}
});
