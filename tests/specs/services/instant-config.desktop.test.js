import { expect } from 'chai';
import { helpers } from '../../common/helpers';
import { instantConfig } from '../../pages/instant-config.page';

describe('Instant Config', () => {
	beforeEach(() => {
		browser.url(instantConfig.pageLink);
	});

	it('should read query params from URL and override configuration', () => {
		instantConfig.enableTestQueryParams();
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['boolean']).to.equal(false);
		expect(config['number']).to.equal(42);
		expect(config['numbers']).to.deep.equal([4, 8, 15, 16, 23, 42]);
		expect(config['string']).to.equal('exampleString');
		expect(config['strings']).to.deep.equal(['strings', 'in', 'the', 'array']);
		expect(config['object']).to.deep.equal({
			this: { is: { more: { complex: 'json', 'is it?': 1 } } },
		});
	});

	it('should use fallback configuration on broken connection', () => {
		instantConfig.enableBrokenConfigRequest();
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['thisIsValueFromFallbackConfig']).to.equal(true);
	});

	it('should override fallback config with query params on broken connection', () => {
		instantConfig.enableBrokenConfigRequest();
		browser.url(`${browser.getUrl()}&InstantGlobals.thisIsValueFromFallbackConfig=false`);
		helpers.waitForValuesLoaded(instantConfig.configPlaceholder);
		const config = instantConfig.getConfig();

		expect(config['thisIsValueFromFallbackConfig']).to.equal(false);
	});
});
