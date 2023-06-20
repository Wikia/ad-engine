import { LiveConnect } from '@wikia/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';
import { context, InstantConfigService, utils } from '@wikia/core';
import { expect } from 'chai';
import { SinonSpy } from 'sinon';

const mockedStorageStrategyVariable = {
	ttl: 300000,
	type: 'session',
	mandatoryParams: ['unifiedId'],
};

describe('LiveConnect', () => {
	let liveConnect;
	let loadScriptStub, instantConfigStub;

	before(() => {
		context.set('services.liveConnect.cachingStrategy', mockedStorageStrategyVariable);
	});

	beforeEach(() => {
		instantConfigStub = global.sandbox.createStubInstance(InstantConfigService);
		instantConfigStub.get.withArgs('icIdentityPartners').returns(false);
		loadScriptStub = global.sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.liveConnect.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
		liveConnect = new LiveConnect(instantConfigStub);
		window.fandomContext = {
			partners: { directedAtChildren: false },
		} as any;
	});

	after(() => {
		context.set('services.liveConnect.cachingStrategy', mockedStorageStrategyVariable);
		delete window.fandomContext;
	});

	it('Live Connect is called', async () => {
		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(true);
	});

	it('Live Connect can be disabled', async () => {
		context.set('services.liveConnect.enabled', false);

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect is disabled when Identity Partners are enabled', async () => {
		instantConfigStub.get.withArgs('icIdentityPartners').returns(true);

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called when user is not opted in', async () => {
		context.set('options.trackingOptIn', false);

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called when user has opted out sale', async () => {
		context.set('options.optOutSale', true);

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	it('Live Connect not called on kid wikis', async () => {
		context.set('wiki.targeting.directedAtChildren', true);
		window.fandomContext.partners.directedAtChildren = true;

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	describe('LiveConnect ids resolution', async () => {
		let emitSpy: SinonSpy;
		await liveConnect.call();

		beforeEach(() => {
			emitSpy = global.sandbox.spy(communicationService, 'emit');
		});

		afterEach(() => global.sandbox.restore());

		it('valid id is resolved', async () => {
			liveConnect.resolveId('md5', 'liveconnect-md5')({ md5: '123' });

			expect(
				emitSpy.calledWith(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: 'liveconnect-md5',
					partnerIdentityId: '123',
				}),
			).to.be.true;
		});

		it('unifiedId is resolved', async () => {
			liveConnect.resolveId('unifiedId', 'liveconnect-unifiedId')({ unifiedId: '123' });

			expect(emitSpy.calledWith(eventsRepository.LIVE_CONNECT_RESPONDED_UUID)).to.be.true;
			expect(
				emitSpy.calledWith(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: 'liveconnect-unifiedId',
					partnerIdentityId: '123',
				}),
			).to.be.true;
		});

		it('missing or wrong id is not resolved', async () => {
			liveConnect.resolveId('test', 'liveconnect-test')({});
			liveConnect.resolveId('test', 'liveconnect-test')({ wrong: '123' });

			expect(emitSpy.notCalled).to.be.true;
		});
	});
});
