import { context, instantConfig, utils } from '@wikia/ad-engine';
import { set } from 'lodash';
import adContext from '../../context';

const breakConfigButton = document.getElementById('break-config');
const configPlaceholder = document.getElementById('config-placeholder');
const testParamsButton = document.getElementById('test-params');

context.extend(adContext);

set(window, 'fallbackConfig', {
	thisIsValueFromFallbackConfig: true,
});

if (utils.queryString.isUrlParamSet('break-config')) {
	context.set('services.instantConfig.endpoint', '//example.com');
}

instantConfig.getConfig().then((config) => {
	configPlaceholder.innerText = JSON.stringify(config, null, '\t');
	set(window, 'exposedInstantConfig', config);
});

breakConfigButton.addEventListener('click', () => {
	window.location.href = `?break-config=1`;
});

testParamsButton.addEventListener('click', () => {
	const testParams = [
		'InstantGlobals.boolean=false',
		'InstantGlobals.string=exampleString',
		'InstantGlobals.strings=["strings","in","the","array"]',
		'InstantGlobals.number=42',
		'InstantGlobals.numbers=[4, 8, 15, 16, 23, 42]',
		'InstantGlobals.object={"this":{"is":{"more":{"complex":"json","is it?": 1}}}}',
	].join('&');

	window.location.href = `?${testParams}`;
});
