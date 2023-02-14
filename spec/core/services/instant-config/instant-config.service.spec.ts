import { communicationService, eventsRepository } from '@wikia/communication';
import { InstantConfigInterpreter } from '@wikia/core/services/instant-config/instant-config.interpreter';
import { instantConfigLoader } from '@wikia/core/services/instant-config/instant-config.loader';
import { InstantConfigOverrider } from '@wikia/core/services/instant-config/instant-config.overrider';
import { InstantConfigService } from '@wikia/core/services/instant-config/instant-config.service';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Instant Config Service', () => {
	let initInterpreterStub: sinon.SinonStub;
	let getConfigStub: sinon.SinonStub;
	let getValuesStub: sinon.SinonStub;
	let overrideStub: sinon.SinonStub;

	beforeEach(() => {
		getConfigStub = global.sandbox.stub(instantConfigLoader, 'getConfig');
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

			const instantConfigService = await new InstantConfigService().init();

			expect(instantConfigService.get('testKey')).to.equal('testValue');
		});

		it('should pass InstantConfig to InstantConfigOverrider', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));

			await new InstantConfigService().init();

			expect(overrideStub.firstCall.args).to.deep.equal([{ config: true }]);
		});

		it('should pass InstantConfig to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((input) => input);

			await new InstantConfigService().init();

			expect(initInterpreterStub.firstCall.args).to.deep.equal([{ config: true }, {}]);
		});

		it('should pass InstantConfig and InstantGlobals to InstantConfigInterpreter', async () => {
			getConfigStub.returns(Promise.resolve({ config: true }));
			getValuesStub.returns({});
			overrideStub.callsFake((input) => input);

			await new InstantConfigService().init({ globals: true });

			expect(initInterpreterStub.firstCall.args).to.deep.equal([
				{ config: true },
				{ globals: true },
			]);
		});

		it('should call getValues again after emitting reset event', async () => {
			getConfigStub.returns(Promise.resolve({}));
			getValuesStub.returns({});

			await new InstantConfigService().init();
			const numberOfCalls = getValuesStub.getCalls().length;

			communicationService.emit(eventsRepository.AD_ENGINE_INSTANT_CONFIG_CACHE_RESET);

			expect(getValuesStub.getCalls().length).to.be.greaterThan(numberOfCalls);
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
			instance = await new InstantConfigService().init();
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
