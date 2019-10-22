import { expect } from 'chai';
import { collapsinator } from '../../pages/collapsinator.page';
import { adSlots } from '../../common/ad-slots';
import { helpers } from '../../common/helpers';
import { network } from '../../common/network';

describe('Collapsinator ads page', () => {
	let tbAdStatus;
	let icbAdStatus;

	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
	});

	beforeEach(() => {
		network.clearLogs();

		helpers.navigateToUrl(collapsinator.pageLink, `cid=${collapsinator.cidParameter}`);
		helpers.mediumScroll(2000);

		tbAdStatus = adSlots.getSlotStatus(adSlots.topBoxad, true);
		icbAdStatus = adSlots.getSlotStatus(adSlots.incontentBoxad, true);
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('Check if 300x250 BTF slots are not visible when collapsinator is enabled', () => {
		expect(tbAdStatus.inViewport, 'Visible in viewport').to.be.false;
		expect(icbAdStatus.inViewport, 'Visible in viewport').to.be.false;

		expect(network.checkIfMessageIsInLogs('top_boxad forced_collapse')).to.be.true;
		expect(network.checkIfMessageIsInLogs('incontent_boxad forced_collapse')).to.be.true;
	});
});
