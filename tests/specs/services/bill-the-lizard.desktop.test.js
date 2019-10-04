import { expect } from 'chai';
import { timeouts } from '../../common/timeouts';
import { helpers } from '../../common/helpers';
import { billTheLizard } from '../../pages/bill-the-lizard.page';
import { adSlots } from '../../common/ad-slots';

describe('It will test bill the lizard page', () => {
	before(() => {
		browser.url(billTheLizard.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
	});

	beforeEach(() => {
		browser.url(billTheLizard.pageLink);
		$(adSlots.topLeaderboard).waitForDisplayed(timeouts.standard);
		helpers.waitForValuesLoaded();
	});

	it('will test last call status', () => {
		expect(billTheLizard.getLastCallStatus()).to.equal('on_time');
	});

	it('will test lazy cat load', () => {
		expect(billTheLizard.getLastCallStatus()).to.equal('on_time');
		billTheLizard.lazyLoadCheshireCat();
		expect(billTheLizard.getLastCallStatus()).to.equal('not_used');
		expect(billTheLizard.getAllStatuses()).to.include('"1": "on_time"');
		expect(billTheLizard.getAllStatuses()).to.include('"2": "not_used"');
	});
	it('will test lazy cat with ID load', () => {
		expect(billTheLizard.getLastCallStatus()).to.equal('on_time');
		billTheLizard.lazyLoadCheshireCatWithId();
		expect(billTheLizard.getLastCallStatus()).to.equal('on_time');
		expect(billTheLizard.getAllStatuses()).to.include('"1": "on_time"');
		expect(billTheLizard.getAllStatuses()).to.include('"catCall": "not_used"');
	});
});
