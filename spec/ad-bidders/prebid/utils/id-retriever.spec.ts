import { IdRetriever } from '@wikia/ad-bidders/prebid/utils/id-retriever';
import { communicationService, eventsRepository } from '@wikia/communication';
import { Context, UniversalStorage } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy, SinonStub } from 'sinon';
import { PbjsStub, stubPbjs } from '../../../core/services/pbjs.stub';

describe('Prebid Id Retriever', () => {
	let pbjsStub: PbjsStub;
	let dispatchSpy: SinonSpy;
	let getItemStub, contextGetStub: SinonStub;

	beforeEach(() => {
		pbjsStub = stubPbjs(global.sandbox).pbjsStub;
		dispatchSpy = global.sandbox.spy(communicationService, 'dispatch');
		getItemStub = global.sandbox.stub(UniversalStorage.prototype, 'getItem');
		contextGetStub = global.sandbox.stub(Context.prototype, 'get');
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

	describe('generateBoiString', () => {
		it('can generate boi empty string', async () => {
			const retriever = IdRetriever.get();
			pbjsStub.getUserIdsAsEids.returns([{ source: 'foo', uids: [{ id: 'bar' }] }]);
			const idString = await retriever.generateBoiString();
			expect(idString.charAt(IdRetriever.YAHOO_BIT)).to.equal('A');
			expect(idString.charAt(IdRetriever.ID5_BIT)).to.equal('A');
			expect(idString.charAt(IdRetriever.HEM_BIT)).to.equal('A');
			expect(idString.charAt(IdRetriever.LIVEINTENT_BIT)).to.equal('A');
			expect(idString.charAt(IdRetriever.PUBCID_BIT)).to.equal('A');
		});

		describe('YAHOO_BIT', () => {
			const bit = IdRetriever.YAHOO_BIT;

			it('can generate proper status for Yahoo', async () => {
				const retriever = IdRetriever.get();
				pbjsStub.getUserIdsAsEids.returns([{ source: 'yahoo.com', uids: [{ id: 'bar' }] }]);
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('P');
			});
		});

		describe('ID5_BIT', () => {
			const bit = IdRetriever.ID5_BIT;

			it('can generate proper status for id5=abc', async () => {
				const retriever = IdRetriever.get();
				pbjsStub.getUserIdsAsEids.returns([{ source: 'id5-sync.com', uids: [{ id: 'abc' }] }]);
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('P');
			});
		});

		describe('HEM_BIT', () => {
			const bit = IdRetriever.HEM_BIT;

			it('can generate proper status for LiveIntent HEM', async () => {
				getItemStub.withArgs('liveConnect').returns({ data: 'abc4', expires: 4299837050986 });
				const retriever = IdRetriever.get();
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('L');
			});

			it('can generate proper status for MediaWiki HEM', async () => {
				contextGetStub.withArgs('wiki.opts.userEmailHashes').returns(['md5', 'sha1', 'sha256']);

				const retriever = IdRetriever.get();
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('M');
			});
		});

		describe('LIVEINTENT_BIT', () => {
			const bit = IdRetriever.LIVEINTENT_BIT;

			it('can generate proper status for LiveIntent ID', async () => {
				const retriever = IdRetriever.get();
				pbjsStub.getUserIdsAsEids.returns([{ source: 'liveintent.com', uids: [{ id: 'bar' }] }]);
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('P');
			});
		});

		describe('PUBCID_BIT', () => {
			const bit = IdRetriever.PUBCID_BIT;

			it('can generate proper status for pubcid.org', async () => {
				const retriever = IdRetriever.get();
				pbjsStub.getUserIdsAsEids.returns([{ source: 'pubcid.org', uids: [{ id: 'bar' }] }]);
				const idString = await retriever.generateBoiString();
				expect(idString.charAt(bit)).to.equal('P');
			});
		});
	});
});
