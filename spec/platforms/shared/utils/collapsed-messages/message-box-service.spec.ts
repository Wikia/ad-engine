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

	describe('Test if message box should be added', () => {
		const sandbox = createSandbox();
		let messageBoxService: MessageBoxService;
		let actionEventMock: string;

		beforeEach(() => {
			actionEventMock = 'collapse';
			messageBoxService = new MessageBoxService();
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('is added - when slot is collapsed & is not a top/bottom leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				true,
			);
		});

		it("is not added - when slot status is different than 'collapse'", () => {
			actionEventMock = 'success';

			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when collapsed slot is top_leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(true);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('is not added - when collapsed slot is bottom_leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(true);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});
	});
});
