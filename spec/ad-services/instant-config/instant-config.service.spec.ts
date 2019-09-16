import { eventService, InstantConfigCacheStorage, utils } from '@wikia/ad-engine';
import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { instantConfigLoader } from '@wikia/ad-services/instant-config/instant-config.loader';
import { InstantConfigOverrider } from '@wikia/ad-services/instant-config/instant-config.overrider';
import { InstantConfigService } from '@wikia/ad-services/instant-config/instant-config.service';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Instant Config Service', () => {
	let sandbox;
	let initInterpreterStub: sinon.SinonStub;
	let getConfigStub: sinon.SinonStub;
	let getValuesStub: sinon.SinonStub;
	let overrideStub: sinon.SinonStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		getConfigStub = sandbox.stub(instantConfigLoader, 'getConfig');
		initInterpreterStub = sandbox.stub(InstantConfigInterpreter.prototype, 'init').returnsThis();
		getValuesStub = sandbox.stub(InstantConfigInterpreter.prototype, 'getValues');
		overrideStub = sandbox.stub(InstantConfigOverrider.prototype, 'override');
	});

	afterEach(() => {
		sandbox.restore();
		InstantConfigService['instancePromise'] = undefined;
		eventService.removeAllListeners(InstantConfigCacheStorage.CACHE_RESET_EVENT);
	});

	describe('static init', () => {
		it('should create InstantConfigService', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({ testKey: 'testValue' });

			const instantConfigService = await InstantConfigService.init();

			expect(instantConfigService.get('testKey')).to.equal('testValue');
		});

		it('should pass InstantConfig to InstantConfigOverrider', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));

			await InstantConfigService.init();

			expect(overrideStub.firstCall.args).to.deep.equal([{ config: true }]);
		});

		it('should pass InstantConfig to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((input) => input);

			await InstantConfigService.init();

			expect(initInterpreterStub.firstCall.args).to.deep.equal([{ config: true }, {}]);
		});

		it('should pass InstantConfig and InstantGlobals to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((input) => input);

			await InstantConfigService.init({ globals: true });

			expect(initInterpreterStub.firstCall.args).to.deep.equal([
				{ config: true },
				{ globals: true },
			]);
		});

		it('should call getConfig only once', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({});

			await InstantConfigService.init();
			await InstantConfigService.init();

			expect(getConfigStub.getCalls().length).to.equal(1);
		});

		it('should call getValues twice after emitting reset event', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({});

			await InstantConfigService.init();

			expect(getValuesStub.getCalls().length).to.equal(1);

			eventService.emit(InstantConfigCacheStorage.CACHE_RESET_EVENT);

			expect(getValuesStub.getCalls().length).to.equal(2);
		});
	});

	describe('instance', () => {
		let instance: InstantConfigService;
		const repository = {
			babDetection: true,
			scrollTimeout: { first: 10, next: 30 },
			wgAdDriverA9BidderCountries: ['PL'],
			aiBidder: true,
			undefinedTest: undefined,
		};

		beforeEach(async () => {
			getConfigStub.returns(Promise.resolve({}));
			overrideStub.callsFake((input) => input);
			getValuesStub.returns(repository);
			instance = await InstantConfigService.init();
		});

		describe('get', () => {
			it('should return appropriate values', () => {
				Object.keys(repository).forEach((key) => {
					expect(instance.get(key)).to.equal(repository[key]);
				});
			});

			it('should return appropriate value if default is provided', () => {
				expect(instance.get('aiBidder', false)).to.equal(true);
			});

			it('should return undefined if key does not exist', () => {
				expect(instance.get('doesNotExist')).to.equal(undefined);
			});

			it('should return default if key does not exist', () => {
				expect(instance.get('doesNotExist', 'it is ok')).to.equal('it is ok');
			});

			it('should return undefined if key has undefined value', () => {
				expect(instance.get('undefinedTest')).to.equal(undefined);
			});

			it('should return default if key has undefined value', () => {
				expect(instance.get('undefinedTest', 'it is ok')).to.equal('it is ok');
			});
		});

		describe('isGeoEnabled', () => {
			let isProperGeoStub: sinon.SinonStub;

			beforeEach(() => {
				isProperGeoStub = sinon.stub(utils.geoService, 'isProperGeo');
			});

			afterEach(() => {
				isProperGeoStub.restore();
			});

			it('should call isProperGeo with correct arguments', () => {
				instance.isGeoEnabled('wgAdDriverA9BidderCountries');

				expect(isProperGeoStub.firstCall.args).to.deep.equal([
					['PL'],
					'wgAdDriverA9BidderCountries',
				]);
			});

			it('should return value for isProperGeo for wgAdDriver', () => {
				isProperGeoStub.returns('it is ok');

				expect(instance.isGeoEnabled('wgAdDriverA9BidderCountries')).to.equal('it is ok');
			});

			it('should throw if supplied not wgAdDriver key', () => {
				expect(instance.isGeoEnabled.bind(instance, 'scrollTimeout')).to.throw(
					'This method should be only used for legacy wgAdDriver keys',
				);
			});
		});
	});
});
