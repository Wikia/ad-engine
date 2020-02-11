import { expect } from 'chai';
import { collapsinator } from '../../pages/collapsinator.page';
import { helpers } from '../../common/helpers';
import { network } from '../../common/network';
import { slots } from '../../common/slot-registry';

describe('Collapsinator ads page', () => {
	before(() => {
		network.enableLogCapturing();
		network.captureConsole();
	});

	beforeEach(() => {
		network.clearLogs();

		helpers.navigateToUrl(collapsinator.pageLink, `cid=${collapsinator.cidParameter}`);
		helpers.mediumScroll(2000);
	});

	after(() => {
		network.disableLogCapturing();
	});

	it('Check if 300x250 BTF slots are not visible when collapsinator is enabled', () => {
		expect(slots.topBoxad.isDisplayedInViewport(), 'Visible in viewport').to.be.false;
		expect(slots.incontentBoxad.isDisplayedInViewport(), 'Visible in viewport').to.be.false;

		expect(network.checkIfMessageIsInLogs('top_boxad forced_collapse')).to.be.true;
		expect(network.checkIfMessageIsInLogs('incontent_boxad forced_collapse')).to.be.true;
	});
});
