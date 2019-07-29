import { utils } from '@wikia/ad-engine';
import { InstantConfigInterpreter } from '@wikia/ad-services/instant-config/instant-config.interpreter';
import { instantConfigLoader } from '@wikia/ad-services/instant-config/instant-config.loader';
import { InstantConfigService } from '@wikia/ad-services/instant-config/instant-config.service';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Instant Config Service', () => {
	let getConfigStub: sinon.SinonStub;
	let getValuesStub: sinon.SinonStub;

	beforeEach(() => {
		getConfigStub = sinon.stub(instantConfigLoader, 'getConfig');
		getValuesStub = sinon.stub(InstantConfigInterpreter.prototype, 'getValues');
	});

	afterEach(() => {
		getConfigStub.restore();
		getValuesStub.restore();
		InstantConfigService['instancePromise'] = undefined;
	});

	describe('static init', () => {
		it('should create InstantConfigService', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({ testKey: 'testValue' });

			const instantConfigService = await InstantConfigService.init();

			expect(instantConfigService.get('testKey')).to.equal('testValue');
		});

		it('should pass InstantConfig to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});

			await InstantConfigService.init();

			expect(getValuesStub.firstCall.args).to.deep.equal([{ config: true }, {}]);
		});

		it('should pass InstantConfig and InstantGlobals to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});

			await InstantConfigService.init({ globals: true });

			expect(getValuesStub.firstCall.args).to.deep.equal([{ config: true }, { globals: true }]);
		});

		it('should call getConfig only once', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({});

			await InstantConfigService.init();
			await InstantConfigService.init();

			expect(getConfigStub.getCalls().length).to.equal(1);
		});
	});

	describe('instance', () => {
		let instance: InstantConfigService;
		const repository = {
			babDetection: true,
			scrollTimeout: { first: 10, next: 30 },
			wgAdDriverA9BidderCountries: ['PL'],
			aiBidder: true,
		};

		beforeEach(async () => {
			getConfigStub.returns(Promise.resolve({}));
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

			it('should return null if key does not exist', () => {
				expect(instance.get('doesNotExist')).to.equal(null);
			});

			it('should return default if key does not exist', () => {
				expect(instance.get('doesNotExist', 'it is ok')).to.equal('it is ok');
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
