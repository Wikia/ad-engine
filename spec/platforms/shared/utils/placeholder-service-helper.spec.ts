import { expect } from 'chai';
import { createSandbox } from 'sinon';

import { PlaceholderServiceHelper } from '../../../../platforms/shared/utils/placeholder-service-helper';

describe('placeholder service helper', () => {
	function getMockElement(containsClass = false): HTMLElement {
		return {
			classList: {
				add: () => {},
				contains: () => containsClass,
				remove: () => {},
			},
		} as any;
	}

	describe('placeholder', () => {
		let placeholderHelper;

		beforeEach(() => {
			placeholderHelper = new PlaceholderServiceHelper();
		});

		it('shouldDisplayPlaceholder returns true when slot is rendered and forced success', () => {
			const actionEventMock = 'slotRendered';
			const actionPayloadMock = 'forced_success';

			expect(
				placeholderHelper.shouldDisplayPlaceholder(actionEventMock, actionPayloadMock),
			).to.equal(true);
		});

		it('shouldDisplayPlaceholder returns false for rendered successfully slot', () => {
			const actionEventMock = 'slotRendered';
			const actionPayloadMock = 'success';

			expect(
				placeholderHelper.shouldDisplayPlaceholder(actionEventMock, actionPayloadMock),
			).to.equal(false);
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

	describe('Message Box', () => {
		const sandbox = createSandbox();
		let placeholderHelper: PlaceholderServiceHelper;
		let actionEventMock = 'collapse';

		beforeEach(() => {
			placeholderHelper = new PlaceholderServiceHelper();
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('is added - when it was not added before, slot is collapsed and is not a top_leaderboard', () => {
			sandbox.stub(placeholderHelper, 'isMessageBoxAlreadyAdded').returns(false);
			sandbox.stub(placeholderHelper, 'isItTopLeaderboard').returns(false);

			expect(placeholderHelper.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				true,
			);
		});

		it("is not added - when slot status is different than 'collapse'", () => {
			actionEventMock = 'success';

			sandbox.stub(placeholderHelper, 'isMessageBoxAlreadyAdded').returns(false);
			sandbox.stub(placeholderHelper, 'isItTopLeaderboard').returns(false);

			expect(placeholderHelper.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when message box already exists on the page', () => {
			sandbox.stub(placeholderHelper, 'isMessageBoxAlreadyAdded').returns(true);
			sandbox.stub(placeholderHelper, 'isItTopLeaderboard').returns(false);

			expect(placeholderHelper.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when collapsed slot is top_leaderboard', () => {
			sandbox.stub(placeholderHelper, 'isMessageBoxAlreadyAdded').returns(false);
			sandbox.stub(placeholderHelper, 'isItTopLeaderboard').returns(true);

			expect(placeholderHelper.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});
	});
});
