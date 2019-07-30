import { context, InstantConfigService, utils } from '@wikia/ad-engine';
import { set } from 'lodash';
import adContext from '../../context';

const breakConfigButton = document.getElementById('break-config');
const configPlaceholder = document.getElementById('config-placeholder');
const testParamsButton = document.getElementById('test-params');

context.extend(adContext);

set(window, 'fallbackConfig', {
	thisIsValueFromFallbackConfig: [{ regions: ['XX'] }],
	wgAdDriverThisIsValueFromFallbackConfig: true,
});

if (utils.queryString.isUrlParamSet('break-config')) {
	context.set('services.instantConfig.endpoint', '//example.com');
}

InstantConfigService.init().then((config) => {
	configPlaceholder.innerText = JSON.stringify(config['repository'], null, '\t');
	set(window, 'exposedInstantConfig', config['repository']);
});

breakConfigButton.addEventListener('click', () => {
	window.location.href = `?break-config=1`;
});

testParamsButton.addEventListener('click', () => {
	const testParams = [
		'InstantGlobals.thisIsValueFromTestParams="WrappedInXX"',
		'InstantGlobals.wgAdDriverBoolean=false',
		'InstantGlobals.wgAdDriverString=exampleString',
		'InstantGlobals.wgAdDriverStrings=["strings","in","the","array"]',
		'InstantGlobals.wgAdDriverNumber=42',
		'InstantGlobals.wgAdDriverNumbers=[4, 8, 15, 16, 23, 42]',
		'InstantGlobals.wgAdDriverObject={"that":{"is":{"more":{"complex":"json","is it?": 1}}}}',
	].join('&');

	window.location.href = `?${testParams}`;
});
