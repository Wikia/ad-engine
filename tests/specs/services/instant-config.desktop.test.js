import { expect } from 'chai';
import { helpers } from '../../common/helpers';
import { instantConfig } from '../../pages/instant-config.page';

describe('Instant Config', () => {
	beforeEach(() => {
		helpers.navigateToUrl(instantConfig.pageLink);
	});

	it('should read query params from URL and override configuration', () => {
		instantConfig.enableTestQueryParams();
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['wgAdDriverBoolean']).to.equal(false);
		expect(config['wgAdDriverNumber']).to.equal(42);
		expect(config['wgAdDriverNumbers']).to.deep.equal([4, 8, 15, 16, 23, 42]);
		expect(config['thisIsValueFromTestParams']).to.equal('WrappedInXX');
		expect(config['wgAdDriverString']).to.equal('exampleString');
		expect(config['wgAdDriverStrings']).to.deep.equal(['strings', 'in', 'the', 'array']);
		expect(config['wgAdDriverObject']).to.deep.equal({
			that: { is: { more: { complex: 'json', 'is it?': 1 } } },
		});
	});

	it('should use fallback configuration on broken connection', () => {
		instantConfig.enableBrokenConfigRequest();
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['wgAdDriverThisIsValueFromFallbackConfig']).to.equal(true);
	});

	it('should override fallback config with query params on broken connection', () => {
		instantConfig.enableBrokenConfigRequest();
		helpers.navigateToUrl(
			instantConfig.pageLink,
			'InstantGlobals.wgAdDriverThisIsValueFromFallbackConfig=false',
		);
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['wgAdDriverThisIsValueFromFallbackConfig']).to.equal(false);
	});
});
