import { IdRetriever } from '@wikia/ad-bidders/prebid/utils/id-retriever';
import { communicationService, eventsRepository } from '@wikia/communication';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';

describe('Prebid Id Retriever', () => {
	let pbjsStub: PbjsStub;
	let dispatchSpy: SinonSpy;
	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		dispatchSpy = global.sandbox.spy(communicationService, 'dispatch');
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
		expect(idString).to.equal('AAAAAxxxxxxxxxxx');
	});

	it('can generate boi string with one partner', async () => {
		const retriever = IdRetriever.get();
		pbjsStub.getUserIdsAsEids.returns([{ source: 'id5-sync.com', uids: [{ id: 'bar' }] }]);
		const idString = await retriever.generateBoiString();
		expect(idString).to.equal('APAAAxxxxxxxxxxx');
	});
});
