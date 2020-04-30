import { Dictionary, utils } from '@wikia/ad-engine';
import { InstantConfigOverrider } from '@wikia/ad-services/instant-config/instant-config.overrider';
import { expect } from 'chai';
import * as sinon from 'sinon';

describe('Instant Config Overrider', () => {
	const overrider = new InstantConfigOverrider();

	let getQueryParamsStub: sinon.SinonStub;

	beforeEach(() => {
		getQueryParamsStub = sinon.stub(utils.queryString, 'getValues');
	});

	afterEach(() => {
		getQueryParamsStub.restore();
	});

	describe('overriding and wrapping', () => {
		let result: Dictionary;
		const configResponse = {
			configUnique: 'I am new unique from config',
			override: [{ regions: ['PL'] }],
			wgAdDriverOverride: true,
			wgAdDriverConfigUnique: 'I am wgAdDriver unique from config',
		};
		const queryParams = {
			'InstantGlobals.queryUnique': 'I am new unique from query',
			'InstantGlobals.override': 'true',
			'InstantGlobals.wgAdDriverOverride': 'false',
			'InstantGlobals.wgAdDriverQueryUnique': 'I am wgAdDriver unique from query',
			'icbm.icFoo': 'I am value overridden with icbm. prefix',
		};

		beforeEach(() => {
			getQueryParamsStub.returns(queryParams);
			result = overrider.override(configResponse);
		});

		it('should wrap new instant config from query into XX regions group', () => {
			expect(result['queryUnique']).to.deep.equal([
				{ regions: ['XX'], value: 'I am new unique from query' },
			]);
		});

		it('should leave new instant config from response intact', () => {
			expect(result['configUnique']).to.equal('I am new unique from config');
		});

		it('should override response', () => {
			expect(result['configUnique']).to.equal('I am new unique from config');
			expect(result['queryUnique']).to.deep.equal([
				{ regions: ['XX'], value: 'I am new unique from query' },
			]);
			expect(result['override']).to.deep.equal([{ regions: ['XX'], value: true }]);
			expect(result['icFoo']).to.deep.equal([
				{ regions: ['XX'], value: 'I am value overridden with icbm. prefix' },
			]);

			expect(result['wgAdDriverConfigUnique']).to.equal('I am wgAdDriver unique from config');
			expect(result['wgAdDriverQueryUnique']).to.equal('I am wgAdDriver unique from query');
			expect(result['wgAdDriverOverride']).to.equal(false);
		});
	});

	describe('parsing types', () => {
		it('should parse different types', () => {
			const queryParamsTypes = {
				'InstantGlobals.wgAdDriverBoolean': 'false',
				'InstantGlobals.wgAdDriverString': 'exampleString',
				'InstantGlobals.wgAdDriverStrings': '["strings","in","the","array"]',
				'InstantGlobals.wgAdDriverNumber': '42',
				'InstantGlobals.wgAdDriverNumbers': '[4, 8, 15, 16, 23, 42]',
				'InstantGlobals.wgAdDriverObject':
					'{"that":{"is":{"more":{"complex":"json","is it?": 1}}}}',
			};

			getQueryParamsStub.returns(queryParamsTypes);

			const result = overrider.override({});

			expect(result['wgAdDriverBoolean']).to.equal(false);
			expect(result['wgAdDriverString']).to.equal('exampleString');
			expect(result['wgAdDriverStrings']).to.deep.equal(['strings', 'in', 'the', 'array']);
			expect(result['wgAdDriverNumber']).to.equal(42);
			expect(result['wgAdDriverNumbers']).to.deep.equal([4, 8, 15, 16, 23, 42]);
			expect(result['wgAdDriverObject']).to.deep.equal({
				that: { is: { more: { complex: 'json', 'is it?': 1 } } },
			});
		});
	});

	describe('should split', () => {
		it('by dot', () => {
			const queryParamsTypes = {
				'InstantGlobals.foo': 'false',
				'icbm.foo_bar': 'true',
			};

			getQueryParamsStub.returns(queryParamsTypes);
			const result = overrider.override({});

			expect(result['foo']).to.deep.equal([{ value: false, regions: ['XX'] }]);
			expect(result['foo_bar']).to.deep.equal([{ value: true, regions: ['XX'] }]);
		});

		it('double underscore', () => {
			const queryParamsTypes = {
				InstantGlobals__foo: 'false',
				icbm__foo_bar: 'true',
			};

			getQueryParamsStub.returns(queryParamsTypes);
			const result = overrider.override({});

			console.log(result);

			expect(result['foo']).to.deep.equal([{ value: false, regions: ['XX'] }]);
			expect(result['foo_bar']).to.deep.equal([{ value: true, regions: ['XX'] }]);
		});
	});
});
