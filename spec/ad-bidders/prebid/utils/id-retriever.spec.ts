import { IdRetriever } from '@wikia/ad-bidders/prebid/utils/id-retriever';
import { communicationService, eventsRepository } from '@wikia/communication';
import { UniversalStorage } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';

describe('Prebid Id Retriever', () => {
	let pbjsStub: PbjsStub;
	let dispatchSpy: SinonSpy;
	let getItemStub: SinonStub;
	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		dispatchSpy = global.sandbox.spy(communicationService, 'dispatch');
		getItemStub = global.sandbox.stub(UniversalStorage.prototype, 'getItem');
	});

	afterEach(() => {
		global.sandbox.restore();
		getItemStub.resetHistory();
	});
	it('can be initialized', () => {
		const retriever = IdRetriever.get();
		expect(retriever).to.be.instanceOf(IdRetriever);
	});

	it('can retrieve ids', async () => {
		pbjsStub.getUserIdsAsEids.returns([{ source: 'foo', uids: [{ id: 'bar' }] }]);

		const retriever = IdRetriever.get();
		const ids = await retriever.getIds();
		expect(ids).to.be.instanceOf(Array);
	});

	it('can save ids', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'foo', uids: [{ id: 'bar' }] }]);
		await retriever.saveCurrentPrebidIds();

		expect(dispatchSpy.firstCall.args[0]).to.deep.equal(
			communicationService.getGlobalAction(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED)({
				partnerIdentityId: 'bar',
				partnerName: 'foo',
			}),
		);
	});

	it('can generate boi empty string', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'foo', uids: [{ id: 'bar' }] }]);
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('AAAAxxxxxxxxxxxx');
	});

	it('can generate boi string with one partner', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'liveintent.com', uids: [{ id: 'bar' }] }]);
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('AAAPxxxxxxxxxxxx');
	});

	it('can generate proper status for id5=0', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'id5-sync.com', uids: [{ id: '0' }] }]);
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('AZAAxxxxxxxxxxxx');
	});

	it('can generate proper status for id5=abc', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'id5-sync.com', uids: [{ id: 'abc' }] }]);
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('APAAxxxxxxxxxxxx');
	});

	it('can generate proper status for LiveIntent HEM', async () => {
		getItemStub.withArgs('liveConnect').returns({ data: 'abc4', expires: 4299837050986 });
		const retriever = IdRetriever.get();
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('AALAxxxxxxxxxxxx');
	});

	it('can generate proper status for MediaWiki HEM', async () => {
		const adsContext = {
			context: {
				opts: {
					userEmailHashes: ['a', 'b', 'c'],
				},
			},
		} as unknown as MediaWikiAds;
		window.ads = {
			...adsContext,
		};

		const retriever = IdRetriever.get();
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('AAMAxxxxxxxxxxxx');
	});
});
