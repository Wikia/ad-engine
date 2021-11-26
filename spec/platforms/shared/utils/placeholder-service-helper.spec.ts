import { expect } from 'chai';

import { PlaceholderServiceHelper } from '../../../../platforms/shared/utils/placeholder-service-helper';

describe('placeholder service helper', () => {
	function getMockElement(hidden = false): HTMLElement {
		return {
			classList: {
				add: () => {},
				contains: () => hidden,
				remove: () => {},
			},
		} as any;
	}

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

	it('shouldHidePlaceholder returns true when placeholder does not contain the right class', () => {
		const placeholderMock: HTMLElement = getMockElement(false);

		expect(placeholderHelper.shouldHidePlaceholder(placeholderMock)).to.equal(true);
	});

	it('shouldHidePlaceholder returns true when placeholder does contain the right class', () => {
		const placeholderMock: HTMLElement = getMockElement(true);

		expect(placeholderHelper.shouldHidePlaceholder(placeholderMock)).to.equal(false);
	});
});
