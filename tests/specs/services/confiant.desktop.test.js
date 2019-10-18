import { expect } from 'chai';
import { confiant } from '../../pages/confiant.page';
import { network } from '../../common/network';
import { helpers } from '../../common/helpers';
import { queryStrings } from '../../common/query-strings';
import { adSlots } from '../../common/ad-slots';
import { timeouts } from '../../common/timeouts';

describe('It will test Confiant page', () => {
	before(() => {
		network.enableCapturing(confiant.request);
		network.enableLogCapturing();
		network.captureConsole();
	});

	beforeEach(() => {
		network.clearLogs();
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('will check if script is loaded', () => {
		helpers.navigateToUrl(confiant.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		expect(network.checkIfHasResponse(confiant.configFile), 'config not loaded').to.be.true;
	});

	it('should check console logs', () => {
		helpers.navigateToUrl(confiant.pageLink);
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		browser.waitUntil(
			() => network.checkIfMessageIsInLogs(confiant.blockedAdLog),
			2000,
			`Logs should contain message: ${confiant.blockedAdLog}`,
		);
	});

	it('will test disabled confiant', () => {
		helpers.navigateToUrl(confiant.pageLink, queryStrings.getConfiant(false));
		$(adSlots.topBoxad).waitForDisplayed(timeouts.standard);
		expect(network.checkIfHasResponse(confiant.configFile)).to.be.false;
	});
});
