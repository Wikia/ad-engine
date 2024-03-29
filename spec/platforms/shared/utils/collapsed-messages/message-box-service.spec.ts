import { AdSlot } from '@wikia/core';
import { MessageBoxService } from '@wikia/platforms/shared';
import { expect } from 'chai';

describe('Message Box Service', () => {
	function getMockElement(): HTMLElement {
		return {
			classList: {
				add: () => {},
				contains: () => {},
				remove: () => {},
			},
		} as any;
	}

	describe('Test shouldAddMessageBox() method', () => {
		let messageBoxService: MessageBoxService;
		let actionEventMock: string;

		beforeEach(() => {
			actionEventMock = 'collapse';
			messageBoxService = new MessageBoxService(true);
		});

		it('MB is added - when slot is collapsed, is not a top/bottom leaderboard and does not include message box already', () => {
			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				true,
			);
		});

		it("MB is not added - when slot status is different than 'collapse'", () => {
			actionEventMock = 'success';

			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				false,
			);
		});

		it('MB is not added - when collapsed slot is top_leaderboard', () => {
			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(true);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				false,
			);
		});

		it('MB is not added - when collapsed slot is bottom_leaderboard', () => {
			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(true);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				false,
			);
		});

		it('MB is not added - when the placeholder has already message-box class', () => {
			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(true);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				false,
			);
		});

		it('MB is not added - when the feature is disabled', () => {
			messageBoxService = new MessageBoxService(false);

			global.sandbox.stub(messageBoxService, 'isTopLeaderboard').returns(false);
			global.sandbox.stub(messageBoxService, 'isBottomLeaderoard').returns(false);
			global.sandbox.stub(messageBoxService, 'hasAlreadyMessageBox').returns(false);

			expect(messageBoxService.shouldAddMessageBox(actionEventMock, getMockElement())).to.equal(
				false,
			);
		});
	});

	describe('Test if message box indexes are changed correctly', () => {
		const parentElementMock: HTMLElement = document.createElement('div');
		parentElementMock.classList.add(AdSlot.AD_SLOT_PLACEHOLDER_CLASS);
		const elementMock: HTMLElement = document.createElement('div');
		parentElementMock.append(elementMock);

		const adSlotMock: AdSlot = new AdSlot({ id: 'top_leaderboard' });
		adSlotMock.element = elementMock;
		const messageBoxService = new MessageBoxService(true);

		it('index changes to 1 - when Register box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(0);
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(1);
		});

		it('index changes to 2 - when Fan Lab box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(1);
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(2);
		});

		it('index changes to 3 - when Newsletter-Link box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(2);
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
		});

		it('index equals 3 - no more message boxes can be added', () => {
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
		});
	});
});
