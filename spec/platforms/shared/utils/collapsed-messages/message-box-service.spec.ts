import { AdSlot, context } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { MessageBoxService } from '../../../../../src/platforms/shared';

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

	describe('Test if message box indexes are changed correctly (Sailthru enabled)', () => {
		context.set('services.sailthru.enabled', true);
		const parentElementMock: HTMLElement = document.createElement('div');
		parentElementMock.classList.add(AdSlot.AD_SLOT_PLACEHOLDER_CLASS);
		const elementMock: HTMLElement = document.createElement('div');
		parentElementMock.append(elementMock);

		const adSlotMock: AdSlot = new AdSlot({ id: 'top_leaderboard' });
		adSlotMock.element = elementMock;
		const messageBoxService = new MessageBoxService();

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

		it('index changes to 3 - when Newsletter-Form box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(2);
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
		});

		it('index changes to 4 - when Newsletter-Link box is added', () => {
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(3);
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(4);
		});

		it('index equals 4 - no more message boxes can be added', () => {
			messageBoxService.addMessageBox(adSlotMock);
			expect(messageBoxService.getCurrentTypeIndex()).to.equal(4);
		});
	});

	describe('Test if message box indexes are changed correctly (Sailthru disabled)', () => {
		context.set('services.sailthru.enabled', false);
		const parentElementMock: HTMLElement = document.createElement('div');
		parentElementMock.classList.add(AdSlot.AD_SLOT_PLACEHOLDER_CLASS);
		const elementMock: HTMLElement = document.createElement('div');
		parentElementMock.append(elementMock);

		const adSlotMock: AdSlot = new AdSlot({ id: 'top_leaderboard' });
		adSlotMock.element = elementMock;
		const messageBoxService = new MessageBoxService();

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
