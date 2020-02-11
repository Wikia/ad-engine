import { expect } from 'chai';
import { hiviUapAb } from '../../../pages/hivi-uap-ab-ad.page';
import { slots } from '../../../common/slot-registry';
import { helpers } from '../../../common/helpers';

describe('HiVi UAP AB ads page with uap_c', () => {
	let currentCreativeID;
	before(() => {
		helpers.navigateToUrl(hiviUapAb.pageLink);
		slots.topLeaderboard.waitForCreativedIDAttribute();
		currentCreativeID = slots.topLeaderboard.creativeId;
	});

	it('should check creativeID for Top Boxad', () => {
		slots.topBoxad.waitForCreativedIDAttribute();
		expect(hiviUapAb.getUapCValue(slots.topBoxad)).to.equal(
			currentCreativeID,
			'Top Boxad has incorrect creative id',
		);
	});

	it('should check creativeID for Incontent Boxad', () => {
		slots.incontentBoxad.scrollIntoView();
		slots.incontentBoxad.waitForCreativedIDAttribute();
		expect(hiviUapAb.getUapCValue(slots.incontentBoxad)).to.equal(
			currentCreativeID,
			'Incontent Boxad has incorrect creative id',
		);
	});

	it('should check creativeID for Bottom Leaderboard', () => {
		slots.bottomLeaderboard.scrollIntoView();
		slots.bottomLeaderboard.waitForCreativedIDAttribute();
		expect(hiviUapAb.getUapCValue(slots.bottomLeaderboard)).to.equal(
			currentCreativeID,
			'Bottom Leaderboard has incorrect creative id',
		);
	});
});
