import { context, PrebidiumProvider } from '@wikia/core';
import { IframeBuilder } from '@wikia/core/utils';
import { communicationService, eventsRepository } from '@wikia/communication';
import { assert } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { createSandbox, SinonSandbox } from 'sinon';
import { PbjsStub, stubPbjs } from '../services/pbjs.stub';

describe('PrebidiumProvider', () => {
	let sandbox: SinonSandbox;
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
		sandbox = createSandbox();
		prebidiumProvider = new PrebidiumProvider();

		stubIframeBuilder();
		contextStub.get = sandbox.stub(context, 'get').returns(mock.adId);
		pbjsStub = stubPbjs(sandbox).pbjsStub;
	});

	afterEach(() => {
		sandbox.restore();
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

			sandbox.stub(communicationService, 'action$').value(
				new BehaviorSubject(
					communicationService.getGlobalAction(eventsRepository.BIDDERS_BIDDING_DONE)({
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
			const argument = contextStub.get.getCall(0).args[0];

			assert(contextStub.get.calledOnce);
			assert.equal(argument, `slots.${mock.slotName}.targeting.hb_adid`);
		});
	});

	function stubIframeBuilder(): void {
		sandbox.stub(IframeBuilder.prototype, 'create').returns({
			contentWindow: {
				document: mock.doc,
			},
		} as any);
	}
});
