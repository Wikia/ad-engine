import {
	RepeatableSlotPlaceholderConfig,
	SlotPlaceholderConfig,
	slotPlaceholderInjector,
} from '@wikia/core';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

describe('Slot placeholder injector', () => {
	const sandbox = createSandbox();
	let parent: HTMLDivElement;
	let anchorElement0: HTMLElement;
	let anchorElement1: HTMLElement;
	let anchorElement2: HTMLElement;
	let conflictingElement: HTMLDivElement;
	let querySelectorAll: SinonStub;

	const setViewPortHeight = (height: number): void => {
		sandbox.stub(document.documentElement, 'clientHeight').value(height);
		sandbox.stub(window, 'innerHeight').value(height);
	};

	const setScrollPosition = (position: number): void => {
		sandbox.stub(window, 'scrollY').value(position);
	};

	const setElementTopOffset = (element: HTMLElement, top: number): void => {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

		sandbox.stub(element, 'getBoundingClientRect').returns({ top: top - scrollTop } as any);
	};

	const setElementOffsetHeight = (element: HTMLElement, height: number): void => {
		sandbox.stub(element, 'offsetHeight').value(height);
	};

	beforeEach(() => {
		parent = document.createElement('div');
		anchorElement0 = document.createElement('h2');
		anchorElement1 = document.createElement('h2');
		anchorElement2 = document.createElement('h2');
		anchorElement0.id = 'anchor_0';
		anchorElement0.classList.add('anchor');
		anchorElement1.id = 'anchor_1';
		anchorElement1.classList.add('anchor');
		anchorElement2.id = 'anchor_2';
		anchorElement2.classList.add('anchor');
		conflictingElement = document.createElement('div');
		conflictingElement.id = 'conflict';
		parent.append(anchorElement0, conflictingElement, anchorElement1, anchorElement2);
		querySelectorAll = sandbox.stub(document, 'querySelectorAll');
		querySelectorAll.withArgs('.anchor').returns([anchorElement0, anchorElement1, anchorElement2]);
		querySelectorAll.withArgs('#conflict').returns([conflictingElement]);
		querySelectorAll.withArgs('#anchorElementDoesNotExist').returns([]);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should not inject slot placeholder if no anchor element found', () => {
		const slotPlaceholderConfig: SlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '#anchorElementDoesNotExist',
			insertMethod: 'append',
			avoidConflictWith: ['#conflict'],
		};

		setViewPortHeight(100);
		setElementTopOffset(anchorElement0, 1200);
		setElementOffsetHeight(anchorElement0, 50);
		setScrollPosition(0);

		const placeholder = slotPlaceholderInjector.inject(slotPlaceholderConfig);

		expect(placeholder).to.be.null;
	});

	it('slot placeholder should have classes passed in config', () => {
		const slotPlaceholderConfig: SlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '.anchor',
			insertMethod: 'append',
			avoidConflictWith: ['#conflict'],
		};

		setViewPortHeight(1000);
		setElementTopOffset(anchorElement0, 1200);
		setElementOffsetHeight(anchorElement0, 50);
		setScrollPosition(0);

		const placeholder = slotPlaceholderInjector.inject(slotPlaceholderConfig);

		expect(placeholder).to.exist;
		expect(placeholder.classList.value).to.equal('class_1 class_2');
	});

	it('should inject placeholder multiple times', () => {
		const slotPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '.anchor',
			insertMethod: 'append',
			avoidConflictWith: ['#anchorElementDoesNotExist'],
			repeatStart: 1,
			repeatLimit: 5,
		};

		const anchorElement3 = document.createElement('h2');
		anchorElement3.classList.add('anchor');

		const anchorElement4 = document.createElement('h2');
		anchorElement4.classList.add('anchor');

		const anchorElements = [
			anchorElement0,
			anchorElement1,
			anchorElement2,
			anchorElement3,
			anchorElement4,
		];

		querySelectorAll.withArgs('.anchor').returns(anchorElements);

		setViewPortHeight(1000);
		setScrollPosition(0);
		setElementTopOffset(anchorElement0, 1100);
		setElementTopOffset(anchorElement1, 1200);
		setElementTopOffset(anchorElement2, 1300);
		setElementTopOffset(anchorElement3, 1400);
		setElementTopOffset(anchorElement4, 1500);

		const repeat = slotPlaceholderInjector.injectAndRepeat(slotPlaceholderConfig, 'test ads');

		expect(repeat).to.equal(5);
	});

	it('should not inject placeholder if repeatStart > repeatLimit', () => {
		const slotPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '.anchor',
			insertMethod: 'append',
			avoidConflictWith: ['#anchorElementDoesNotExist'],
			repeatStart: 2,
			repeatLimit: 1,
		};

		const repeat = slotPlaceholderInjector.injectAndRepeat(slotPlaceholderConfig, 'test ads');

		expect(repeat).to.be.null;
	});

	it('should inject placeholder without avoidConflictWith in config', () => {
		const slotPlaceholderConfig: RepeatableSlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '.anchor',
			insertMethod: 'append',
			repeatStart: 2,
			repeatLimit: 3,
		};

		setViewPortHeight(100);
		setElementTopOffset(anchorElement0, 1200);
		setElementOffsetHeight(anchorElement0, 50);
		setElementTopOffset(anchorElement1, 1200);
		setElementOffsetHeight(anchorElement2, 50);
		setScrollPosition(0);

		const repeat = slotPlaceholderInjector.injectAndRepeat(slotPlaceholderConfig, 'test ads');

		expect(repeat).to.equal(3);
	});
});
