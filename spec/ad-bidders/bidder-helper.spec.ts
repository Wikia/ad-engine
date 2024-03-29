import {
	defaultSlotBidGroup,
	getSlotBidGroupByName,
	getSlotNameByBidderAlias,
	hasCorrectBidGroup,
} from '@wikia/ad-bidders/bidder-helper';
import { context } from '@wikia/core';
import { expect } from 'chai';

describe('bidder-helper', () => {
	describe('getSlotNameByBidderAlias', () => {
		it('should return slot name if has no alias', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1').returns({ uid: '12345' });

			const result = getSlotNameByBidderAlias('slot1');

			expect(result).to.deep.equal('slot1');
		});

		it('should return slot name if alias matches', () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('slots')
				.returns({
					slot2: { bidderAlias: 'slotAlias2' },
				});

			const result = getSlotNameByBidderAlias('slotAlias2');
			expect(result).to.deep.equal('slot2');
		});
	});

	describe('getSlotBidGroup', () => {
		it('should return default bid group if no group', () => {
			const result = getSlotBidGroupByName('slot1');

			expect(result).to.deep.be.equals(defaultSlotBidGroup);
		});

		it('should return bid group if defined group', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.testSlot.bidGroup').returns(['group#1']);

			const result = getSlotBidGroupByName('testSlot');

			expect(result).to.deep.be.equals(['group#1']);
		});
	});

	describe('hasCorrectBidGroup', () => {
		it('should return true if default bid group and undefined slot bid group', () => {
			const result = hasCorrectBidGroup('slot1', defaultSlotBidGroup);

			expect(result).to.deep.be.true;
		});

		it('should return false if default bid group and defined slot bid group', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1.bidGroup').returns(['group#1']);

			const result = hasCorrectBidGroup('slot1', defaultSlotBidGroup);

			expect(result).to.deep.be.false;
		});

		it('should return true if not default bid group and correct group', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1.bidGroup').returns('group#1');

			const result = hasCorrectBidGroup('slot1', 'group#1');

			expect(result).to.deep.be.true;
		});

		it('should return true if exist bid group by alias', () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('slots.slot1.bidGroup')
				.returns('group#1')
				.withArgs('slots')
				.returns({
					slot1: { bidderAlias: 'alias', a9Alias: 'aliasA9' },
					slot2: { bidderAlias: 'alias2', a9Alias: 'aliasA9_2' },
				});

			const result = hasCorrectBidGroup('alias', 'group#1');

			expect(result).to.deep.be.true;
		});

		it('should return true if exist A9 bid group by alias', () => {
			global.sandbox
				.stub(context, 'get')
				.withArgs('slots.slot1.bidGroup')
				.returns('group#1')
				.withArgs('slots')
				.returns({
					slot1: { bidderAlias: 'alias_2', a9Alias: 'alias' },
					slot2: { bidderAlias: 'alias', a9Alias: 'aliasA9' },
				});

			const result = hasCorrectBidGroup('alias', 'group#1', true);

			expect(result).to.deep.be.true;
		});

		it('should return false if default bid group and different slot bid group', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1.bidGroup').returns('secondGroup');

			const result = hasCorrectBidGroup('slot1', 'group#1');

			expect(result).to.deep.be.false;
		});

		it('should return false if default bid group and incorrect slot bid group', () => {
			global.sandbox.stub(context, 'get').withArgs('slots.slot1.bidGroup').returns(['group#1']);

			const result = hasCorrectBidGroup('slot1', 'group#1');

			expect(result).to.deep.be.false;
		});
	});
});
