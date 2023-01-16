import { TargetingService } from '@wikia/core';
import { expect } from 'chai';
import { createSandbox } from 'sinon';

describe('slot-service', () => {
	let targetingService: TargetingService;
	const pageTargetingData = {
		num1: 123456,
		num2: 987987,
		string1: 'test_TEST',
		string2: 'EXAMPLE_STRING',
		array: ['test', 'test1', 'test3'],
		bundles: ['test'],
	};

	const firstSlotTestData = {
		num1: 456,
		num2: 123,
		string1: 'slot_1_test_TEST',
		string2: 'lot_1_EXAMPLE_STRING',
		array: ['slot_1_test', 'slot_1_test1', 'slot_1_test3'],
		rv: '1',
	};

	const secondSlotTestData = {
		num1: 9999999,
		num2: 8888888,
		string1: 'slot_2_test_TEST',
		string2: 'lot_2_EXAMPLE_STRING',
		array: ['slot_2_test', 'slot_2_test1', 'slot_2_test3'],
		rv: '1',
	};

	const firstSlotName = 'FIRST_SLOT';
	const secondSlotName = 'SECOND_SLOT';

	beforeEach(() => {
		targetingService = new TargetingService();
	});

	describe('getter', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('should return values', () => {
			extendWithExampleData();

			Object.keys(pageTargetingData).forEach((key) => {
				expect(targetingService.get(key)).to.equal(pageTargetingData[key]);
			});
		});

		it('getter should return undefined', () => {
			extendWithExampleData();

			expect(targetingService.get('RANDOM_KEY')).to.be.undefined;
		});

		it('slot should return values', () => {
			extendWithExampleData();

			Object.keys(firstSlotTestData).forEach((key) => {
				expect(targetingService.get(key, firstSlotName)).to.equal(firstSlotTestData[key]);
			});
		});

		it('for a slot should return undefined', () => {
			extendWithExampleData();

			expect(targetingService.get('RANDOM_KEY_UNDEFINED', 'RANDOM_SLOT_UNDEFINED')).to.be.undefined;
		});
	});

	describe('setter', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('should set new key', () => {
			extendWithExampleData();

			const randomKey = Math.random().toString();
			const randomValue = Math.random().toString();
			targetingService.set(randomKey, randomValue);

			expect(targetingService.get(randomKey)).to.equal(randomValue);
		});

		it('should change the existing value', () => {
			extendWithExampleData();

			const key = 'string1';
			const randomValue = Math.random().toString();
			targetingService.set(key, randomValue);

			expect(targetingService.get(key)).to.equal(randomValue);
			expect(targetingService.get(key, firstSlotName)).to.equal(firstSlotTestData[key]);
		});

		it('for a slot should set new key', () => {
			extendWithExampleData();

			const randomKey = Math.random().toString();
			const randomValue = Math.random().toString();
			const randomSlotName = Math.random().toString();
			targetingService.set(randomKey, randomValue, randomSlotName);

			expect(targetingService.get(randomKey, randomSlotName)).to.equal(randomValue);
		});

		it('for a slot should change the existing value', () => {
			extendWithExampleData();

			const key = 'string1';
			const randomValue = Math.random().toString();
			targetingService.set(key, randomValue, firstSlotName);

			expect(targetingService.get(key, firstSlotName)).to.equal(randomValue);
			expect(targetingService.get(key)).to.equal(pageTargetingData[key]);
		});
	});

	describe('clear', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('should clear all properties', () => {
			extendWithExampleData();

			targetingService.clear();

			expect(targetingService.dump()).to.be.empty;
			expect(targetingService.dump(firstSlotName)).to.not.be.empty;
			expect(targetingService.get('string1')).to.be.undefined;
		});

		it('should not throw error for non-existing page targeting', () => {
			targetingService.clear();

			expect(targetingService.dump()).to.be.empty;
		});

		it('for a slot should clear all properties', () => {
			extendWithExampleData();

			targetingService.clear(firstSlotName);

			expect(targetingService.dump()).to.not.be.empty;
			expect(targetingService.dump(firstSlotName)).to.be.empty;
			expect(targetingService.get('string1', firstSlotName)).to.be.undefined;
		});

		it('for a non-existent slot should not throw error', () => {
			const randomKey = Math.random().toString();
			targetingService.clear(randomKey);

			expect(targetingService.dump(randomKey)).to.be.empty;
		});
	});

	describe('remove', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('should remove value', () => {
			extendWithExampleData();

			const key = 'num1';
			expect(targetingService.get(key)).to.equal(pageTargetingData[key]);
			targetingService.remove(key);

			expect(targetingService.get(key)).to.be.undefined;
			expect(targetingService.get(key, firstSlotName)).to.not.be.undefined;
			expect(targetingService.get(key, secondSlotName)).to.not.be.undefined;
		});

		it('for non-existing key should not throw error', () => {
			const key = Math.random().toString();
			expect(targetingService.get(key)).to.be.undefined;
			targetingService.remove(key);

			expect(targetingService.get(key)).to.be.undefined;
		});

		it('for a slot should remove value', () => {
			extendWithExampleData();

			const key = 'num2';
			expect(targetingService.get(key, secondSlotName)).to.equal(secondSlotTestData[key]);
			targetingService.remove(key, secondSlotName);

			expect(targetingService.get(key)).to.not.be.undefined;
			expect(targetingService.get(key, firstSlotName)).to.not.be.undefined;
			expect(targetingService.get(key, secondSlotName)).to.be.undefined;
		});

		it("for non-existing slot's key should not throw error", () => {
			extendWithExampleData();
			const key = Math.random().toString();
			expect(targetingService.get(key, firstSlotName)).to.be.undefined;
			targetingService.remove(key, firstSlotName);

			expect(targetingService.get(key, firstSlotName)).to.be.undefined;
		});
	});

	describe('extend', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('existing page targeting', () => {
			extendWithExampleData();

			const newTargetingData = {
				string2: 'lorem ipsum',
				newKey: 'new value',
				newSecondKey: [],
			};

			targetingService.extend(newTargetingData);

			const newMergedData = Object.assign({}, pageTargetingData, newTargetingData);

			expect(targetingService.dump()).to.deep.equal(newMergedData);
		});

		it('empty page targeting', () => {
			expect(targetingService.dump()).to.be.empty;

			const newTargetingData = {
				string2: 'lorem ipsum',
				newKey: 'new value',
				newSecondKey: [],
			};

			targetingService.extend(newTargetingData);
			expect(targetingService.dump()).to.deep.equal(newTargetingData);
		});

		it('for a slot', () => {
			extendWithExampleData();

			const newTargetingData = {
				string2: 'lorem ipsum 2',
				newKey: 'new value 2',
				newSecondKey: ['test', 'test'],
			};

			targetingService.extend(newTargetingData, firstSlotName);

			const newMergedData = Object.assign({}, firstSlotTestData, newTargetingData);

			expect(targetingService.dump(firstSlotName)).to.deep.equal(newMergedData);
		});

		it('empty targeting for a slot', () => {
			const slotName = 'EMPTY_NEW';

			expect(targetingService.dump(slotName)).to.be.empty;

			const newTargetingData = {
				string2: 'lorem ipsum',
				newKey: 'new value',
				newSecondKey: [],
			};

			targetingService.extend(newTargetingData, slotName);
			expect(targetingService.dump(slotName)).to.deep.equal(newTargetingData);
		});
	});

	describe('dump', () => {
		beforeEach(() => {
			targetingService = new TargetingService();
		});

		it('page targeting', () => {
			extendWithExampleData();

			expect(targetingService.dump()).to.deep.equal(pageTargetingData);
		});

		it('for a slot', () => {
			extendWithExampleData();

			expect(targetingService.dump(firstSlotName)).to.deep.equal(firstSlotTestData);
			expect(targetingService.dump(secondSlotName)).to.deep.equal(secondSlotTestData);
		});
	});

	describe('onchange', () => {
		let sandbox;

		beforeEach(() => {
			targetingService = new TargetingService();
			sandbox = createSandbox();
		});

		it('should run callbacks after the change', () => {
			const callbacks = {
				first: sandbox.spy(),
				second: sandbox.spy(),
			};

			extendWithExampleData();
			targetingService.onChange(callbacks.first);
			targetingService.onChange(callbacks.second);

			const key = 'bundles';
			const newData = ['bundle#1'];
			targetingService.set(key, newData);

			expect(callbacks.first.calledWith(key, newData)).to.be.ok;
			expect(callbacks.first.calledOnce).to.be.true;
			expect(callbacks.second.calledWith(key, newData)).to.be.ok;
			expect(callbacks.second.calledOnce).to.be.true;
		});

		it('should not run callbacks after slot removeListeners', () => {
			const callbacks = {
				first: sandbox.spy(),
				second: sandbox.spy(),
			};

			extendWithExampleData();
			targetingService.onChange(callbacks.first);
			targetingService.onChange(callbacks.second);

			const key = 'bundles';
			targetingService.set(key, ['bundle#1']);

			expect(callbacks.first.calledOnce).to.be.true;
			expect(callbacks.second.calledOnce).to.be.true;

			targetingService.removeListeners();
			targetingService.set(key, []);

			expect(callbacks.first.calledTwice).to.be.false;
			expect(callbacks.second.calledTwice).to.be.false;
		});

		it('should not run callbacks after slot change', () => {
			const callbacks = {
				first: sandbox.spy(),
				second: sandbox.spy(),
			};

			extendWithExampleData();
			targetingService.onChange(callbacks.first);
			targetingService.onChange(callbacks.second);

			const key = 'bundles';
			const newData = ['bundle#1'];
			targetingService.set(key, newData, firstSlotName);

			expect(callbacks.first.calledOnce).to.be.false;
			expect(callbacks.second.calledOnce).to.be.false;
		});
	});

	function extendWithExampleData() {
		targetingService.extend(pageTargetingData);
		targetingService.extend(firstSlotTestData, firstSlotName);
		targetingService.extend(secondSlotTestData, secondSlotName);
	}
});
