import { expect } from 'chai';
import { createSandbox, SinonSpy } from 'sinon';
import { context, utils } from '../../../src/ad-engine';
import { liveConnect } from '../../../src/ad-services';
import { communicationService, eventsRepository } from '@wikia/communication';

describe('LiveConnect', () => {
	const sandbox = createSandbox();
	let loadScriptStub;

	beforeEach(() => {
		loadScriptStub = sandbox
			.stub(utils.scriptLoader, 'loadScript')
			.returns(Promise.resolve({} as any));
		context.set('services.liveConnect.enabled', true);
		context.set('options.trackingOptIn', true);
		context.set('options.optOutSale', false);
		context.set('wiki.targeting.directedAtChildren', false);
	});

	afterEach(() => {
		sandbox.restore();
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

		await liveConnect.call();

		expect(loadScriptStub.called).to.equal(false);
	});

	describe('LiveConnect ids resolution', () => {
		let emitSpy: SinonSpy;

		beforeEach(() => {
			emitSpy = sandbox.spy(communicationService, 'emit');
		});

		afterEach(() => sandbox.restore());

		it('resolve valid id', async () => {
			liveConnect.resolveId('md5', 'liveconnect-md5')({ md5: '123' });

			expect(
				emitSpy.calledWith(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: 'liveconnect-md5',
					partnerIdentityId: '123',
				}),
			).to.be.true;
		});

		it('resolve unifiedId', async () => {
			liveConnect.resolveId('unifiedId', 'liveconnect-unifiedId')({ unifiedId: '123' });

			expect(emitSpy.calledWith(eventsRepository.LIVE_CONNECT_RESPONDED_UUID)).to.be.true;
			expect(
				emitSpy.calledWith(eventsRepository.IDENTITY_PARTNER_DATA_OBTAINED, {
					partnerName: 'liveconnect-unifiedId',
					partnerIdentityId: '123',
				}),
			).to.be.true;
		});

		it('resolve no or wrong id', async () => {
			liveConnect.resolveId('test', 'liveconnect-test')({});
			liveConnect.resolveId('test', 'liveconnect-test')({ wrong: '123' });

			expect(emitSpy.notCalled).to.be.true;
		});
	});
});
