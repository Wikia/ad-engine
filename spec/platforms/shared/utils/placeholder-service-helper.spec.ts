import { expect } from 'chai';

import { PlaceholderServiceHelper } from '../../../../platforms/shared/utils/placeholder-service-helper';

describe('placeholder service helper', () => {
	let placeholderHelper;

	beforeEach(() => {
		placeholderHelper = new PlaceholderServiceHelper();
	});

	it('shouldDisplayPlaceholder returns true when slot is rendered and forced success', () => {
		const actionEventMock = 'slotRendered';
		const actionPayloadMock = 'forced_success';

		expect(placeholderHelper.shouldDisplayPlaceholder(actionEventMock, actionPayloadMock)).to.equal(
			true,
		);
	});

	it('shouldDisplayPlaceholder returns false for rendered successfully slot', () => {
		const actionEventMock = 'slotRendered';
		const actionPayloadMock = 'success';

		expect(placeholderHelper.shouldDisplayPlaceholder(actionEventMock, actionPayloadMock)).to.equal(
			false,
		);
	});
});
