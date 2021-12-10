import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { MessageBoxService } from '../../../../../platforms/shared';

describe('Message Box Service', () => {
	function getMockElement(containsClass = false): HTMLElement {
		return {
			classList: {
				add: () => {},
				contains: () => containsClass,
				remove: () => {},
			},
		} as any;
	}

	describe('Message Box', () => {
		const sandbox = createSandbox();
		let messageBoxService: MessageBoxService;
		let actionEventMock = 'collapse';

		beforeEach(() => {
			messageBoxService = new MessageBoxService();
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('is added - when it was not added before, slot is collapsed and is not a top_leaderboard', () => {
			sandbox.stub(messageBoxService, 'numOfMessageBoxesOnPage').returns(0);
			sandbox.stub(messageBoxService, 'isItTlbOrBlb').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				true,
			);
		});

		it("is not added - when slot status is different than 'collapse'", () => {
			actionEventMock = 'success';

			sandbox.stub(messageBoxService, 'numOfMessageBoxesOnPage').returns(0);
			sandbox.stub(messageBoxService, 'isItTlbOrBlb').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when message box already exists on the page', () => {
			sandbox.stub(messageBoxService, 'numOfMessageBoxesOnPage').returns(1);
			sandbox.stub(messageBoxService, 'isItTlbOrBlb').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when collapsed slot is top_leaderboard', () => {
			sandbox.stub(messageBoxService, 'numOfMessageBoxesOnPage').returns(0);
			sandbox.stub(messageBoxService, 'isItTlbOrBlb').returns(true);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});
	});
});
