import { expect } from 'chai';
import { helpers } from '../../common/helpers';
import { billTheLizard } from '../../pages/bill-the-lizard.page';
import { slots } from '../../common/slot-registry';

describe('It will test bill the lizard page', () => {
	before(() => {
		helpers.navigateToUrl(billTheLizard.pageLink);
		slots.topLeaderboard.waitForDisplayed();
	});

	beforeEach(() => {
		helpers.navigateToUrl(billTheLizard.pageLink);
		slots.topLeaderboard.waitForDisplayed();
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
