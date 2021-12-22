import { AdSlot } from '@wikia/ad-engine';
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

	describe('Test shouldAddMessageBox() method', () => {
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

		it('MB is added - when slot is collapsed & is not a top/bottom leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				true,
			);
		});

		it("MB is not added - when slot status is different than 'collapse'", () => {
			actionEventMock = 'success';

			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('MB is not added - when collapsed slot is top_leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(true);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});

		it('MB is not added - when collapsed slot is bottom_leaderboard', () => {
			sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(true);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement(true))).to.equal(
				false,
			);
		});
	});

	describe('Test if message box indexes are changed correctly', () => {
		const placeholderMock: HTMLElement = document.createElement('div');
		const adSlotMock: AdSlot = new AdSlot({ id: 'top_leaderboard' });
		const messageBoxService: MessageBoxService = new MessageBoxService();

		it('index changes to 1 - when Register box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(0);
			messageBoxService.addMessageBox(placeholderMock, adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(1);
		});

		it('index changes to 2 - when Fan Lab box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(1);
			messageBoxService.addMessageBox(placeholderMock, adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(2);
		});

		it('index changes to 3 - when Newsletter box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(2);
			messageBoxService.addMessageBox(placeholderMock, adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
		});

		it('index equals 3 - no more message boxes can be added', () => {
			messageBoxService.addMessageBox(placeholderMock, adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
		});
	});
});
