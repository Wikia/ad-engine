import { utils } from '@wikia/core';
import { InstantConfigService } from '@wikia/core/services/instant-config/instant-config.service';
import {
	InstantConfigInterpreter,
	InstantConfigLoader,
	InstantConfigOverrider,
} from '@wikia/instant-config-loader';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Instant Config Service', () => {
	let initInterpreterStub: sinon.SinonStub;
	let getConfigStub: sinon.SinonStub;
	let getValuesStub: sinon.SinonStub;
	let overrideStub: sinon.SinonStub;

	beforeEach(() => {
		getConfigStub = global.sandbox.stub(InstantConfigLoader.prototype, 'getConfig');
		initInterpreterStub = global.sandbox
			.stub(InstantConfigInterpreter.prototype, 'init')
			.returnsThis();
		getValuesStub = global.sandbox.stub(InstantConfigInterpreter.prototype, 'getValues');
		overrideStub = global.sandbox.stub(InstantConfigOverrider.prototype, 'override');
	});

	describe('initialization', () => {
		it('should create InstantConfigService', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({ testKey: 'testValue' });

			const instantConfigService = await new InstantConfigService({
				appName: 'testapp',
			}).init();

			expect(instantConfigService.get('testKey')).to.equal('testValue');
		});

		it('should pass InstantConfig to InstantConfigOverrider', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));

			await new InstantConfigService({
				appName: 'testapp',
			}).init();

			expect(overrideStub.firstCall.args[1]).to.deep.equal({ config: true });
		});

		it('should pass InstantConfig to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((_, input) => input);

			await new InstantConfigService({
				appName: 'testapp',
			}).init();

			expect(initInterpreterStub.firstCall.args).to.deep.equal([
				{ config: true },
				{},
				utils.geoService.isProperGeo,
			]);
		});

		it('should pass InstantConfig and InstantGlobals to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((_, input) => input);

			await new InstantConfigService({
				appName: 'testapp',
			}).init({ globals: true });

			expect(initInterpreterStub.firstCall.args).to.deep.equal([
				{ config: true },
				{ globals: true },
				utils.geoService.isProperGeo,
			]);
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
			instance = await new InstantConfigService({
				appName: 'testapp',
			}).init();
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
	});
});
