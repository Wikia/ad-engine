import { SlotCreator, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

describe('SlotCreator', () => {
	const sandbox = createSandbox();
	let slotCreator: SlotCreator;
	let parent: HTMLDivElement;
	let relativeElement0: HTMLDivElement;
	let relativeElement1: HTMLDivElement;
	let relativeElement2: HTMLDivElement;
	let querySelectorAll: SinonStub;

	beforeEach(() => {
		slotCreator = new SlotCreator();
		parent = document.createElement('div');
		relativeElement0 = document.createElement('div');
		relativeElement1 = document.createElement('div');
		relativeElement2 = document.createElement('div');
		relativeElement0.id = 'relative0';
		relativeElement1.id = 'relative1';
		relativeElement2.id = 'relative2';
		parent.append(relativeElement0, relativeElement1, relativeElement2);
		querySelectorAll = sandbox.stub(document, 'querySelectorAll');
		querySelectorAll
			.withArgs('#relative')
			.returns([relativeElement0, relativeElement1, relativeElement2]);
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('insertMethod', () => {
		it('should insert with append', () => {
			const slotElement = testInsertMethod('append');

			expect(relativeElement0.children.length).to.equal(
				2,
				'wrong number of relativeElement0 children',
			);
			expect(relativeElement0.children[1]).to.equal(slotElement, 'slotElement is in a wrong place');
			expect(relativeElement0.children[0].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with prepend', () => {
			const slotElement = testInsertMethod('prepend');

			expect(relativeElement0.children.length).to.equal(
				2,
				'wrong number of relativeElement0 children',
			);
			expect(relativeElement0.children[0]).to.equal(slotElement, 'slotElement is in a wrong place');
			expect(relativeElement0.children[1].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with after', () => {
			const slotElement = testInsertMethod('after');

			expect(parent.children.length).to.equal(4, 'wrong number of parent children');
			expect(parent.children[1]).to.equal(slotElement, 'slotElement is in a wrong place');
		});

		it('should insert with before', () => {
			const slotElement = testInsertMethod('before');

			expect(parent.children.length).to.equal(4, 'wrong number of parent children');
			expect(parent.children[0]).to.equal(slotElement, 'slotElement is in a wrong place');
		});

		function testInsertMethod(insertMethod: SlotCreatorConfig['insertMethod']): HTMLElement {
			const slotConfig: SlotCreatorConfig = {
				insertMethod,
				slotName: 'ad-test',
				anchorSelector: '#relative',
			};

			relativeElement0.append(document.createElement('span')); // to test append and prepend

			const slotElement = slotCreator.createSlot(slotConfig);

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");

			return slotElement;
		}
	});

	it('should contain classes passed in config', () => {
		const slotConfig: SlotCreatorConfig = {
			insertMethod: 'after',
			slotName: 'ad-test',
			anchorSelector: '#relative',
			classList: ['aa', 'bb'],
		};
		const slotElement = slotCreator.createSlot(slotConfig);

		expect(slotElement.classList.value).to.equal('gpt-ad aa bb');
	});

	describe('wrapper', () => {
		it('should create slot inside wrapper', () => {
			const wrapperElement = testWrapper({});

			expect(wrapperElement.id).to.equal('');
			expect(wrapperElement.classList.value).to.equal('', 'wrapper classList is not empty');
		});

		it('should create slot inside wrapper with config', () => {
			const wrapperElement = testWrapper({ id: 'wrapper', classList: ['aa', 'bb'] });

			expect(wrapperElement.id).to.equal('wrapper');
			expect(wrapperElement.classList.value).to.equal('aa bb', 'wrapper classList is wrong');
		});

		function testWrapper(wrapperConfig: SlotCreatorWrapperConfig): HTMLElement {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'before',
				slotName: 'ad-test',
				anchorSelector: '#relative',
			};
			const slotElement = slotCreator.createSlot(slotConfig, wrapperConfig);
			const wrapperElement = slotElement.parentElement;

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
			expect(!!wrapperElement).to.equal(true, "wrapperElement doesn't exist");

			expect(parent.children.length).to.equal(4, 'wrong number of parent children');
			expect(parent.children[0]).to.equal(wrapperElement, 'wrapperElement is in wrong place');
			expect(parent.children[1]).to.equal(relativeElement0, 'relativeElement0 is in wrong place');

			expect(wrapperElement.children.length).to.equal(1, 'wrong number of wrapper children');
			expect(wrapperElement.children[0]).to.equal(
				slotElement,
				"wrapperElement doesn't contain slotElement",
			);

			return wrapperElement;
		}
	});

	describe('anchorPosition', () => {
		describe('index', () => {
			it('should inject with index', () => {
				const slotConfig: SlotCreatorConfig = {
					insertMethod: 'after',
					slotName: 'ad-test',
					anchorSelector: '#relative',
					anchorPosition: 2,
				};
				const slotElement = slotCreator.createSlot(slotConfig);

				expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
				expect(parent.children.length).to.equal(4, 'wrong number of parent children');
				expect(parent.children[3]).to.equal(slotElement, 'slotElement is in a wrong place');
			});

			it('should throw with index', () => {
				const slotConfig: SlotCreatorConfig = {
					insertMethod: 'after',
					slotName: 'ad-test',
					anchorSelector: '#relative',
					anchorPosition: 3,
				};

				expectThrowNoPlaceToInsertError(slotConfig);
			});
		});

		describe('belowFirstViewport', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				anchorPosition: 'belowFirstViewport',
			};

			it('should inject with belowFirstViewport', () => {
				setViewPortHeight(1000);
				setElementTopOffset(relativeElement1, 1200);

				const slotElement = slotCreator.createSlot(slotConfig);

				expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
				expect(parent.children.length).to.equal(4, 'wrong number of parent children');
				expect(parent.children[2]).to.equal(slotElement, 'slotElement is in a wrong place');
			});

			it('should throw with belowFirstViewport', () => {
				setViewPortHeight(1500);
				setElementTopOffset(relativeElement1, 1200);
				expectThrowNoPlaceToInsertError(slotConfig);
			});
		});

		describe('belowScrollPosition', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				anchorPosition: 'belowScrollPosition',
			};

			it('should inject with belowScrollPosition', () => {
				setScrollPosition(1000);
				setElementTopOffset(relativeElement1, 1200);

				const slotElement = slotCreator.createSlot(slotConfig);

				expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
				expect(parent.children.length).to.equal(4, 'wrong number of parent children');
				expect(parent.children[2]).to.equal(slotElement, 'slotElement is in a wrong place');
			});

			it('should throw with belowScrollPosition', () => {
				setScrollPosition(1500);
				setElementTopOffset(relativeElement1, 1200);
				expectThrowNoPlaceToInsertError(slotConfig);
			});
		});
	});

	describe('avoidConflictWith', () => {
		beforeEach(() => {
			sandbox.stub(relativeElement0, 'offsetParent').value(true);
			sandbox.stub(relativeElement1, 'offsetParent').value(true);
			sandbox.stub(relativeElement2, 'offsetParent').value(true);
		});

		it('should throw if in the same node even if not within distance', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				anchorPosition: 0,
				avoidConflictWith: ['#conflict'],
			};
			const conflictElement = createConflictElement(true);

			relativeElement0.after(conflictElement);

			expectThrowNoPlaceToInsertError(slotConfig);
		});

		it('should throw if within distance', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				anchorPosition: 0,
				avoidConflictWith: ['#conflict'],
			};
			const conflictElement = createConflictElement(true);

			relativeElement2.after(conflictElement);

			expectThrowNoPlaceToInsertError(slotConfig);
		});

		it('should work if not within distance', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				anchorPosition: 0,
				avoidConflictWith: ['#conflict'],
			};
			const conflictElement = createConflictElement(false);

			relativeElement2.after(conflictElement);

			const slotElement = slotCreator.createSlot(slotConfig);

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
		});

		it('should work if one of slots not within distance', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'after',
				slotName: 'ad-test',
				anchorSelector: '#relative',
				avoidConflictWith: ['#conflict'],
			};
			const conflictElement = createConflictElement(true);

			relativeElement2.after(conflictElement);

			const slotElement = slotCreator.createSlot(slotConfig);

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
			expect(slotElement).to.equal(parent.children[2], 'slotElement is in a wrong place');
		});

		function createConflictElement(shouldBeWithinDistance: boolean): HTMLElement {
			const conflictElement = document.createElement('div');

			querySelectorAll.withArgs('#conflict').returns([conflictElement]);
			conflictElement.id = 'conflictElement';
			// distance = 50
			setElementOffsetHeight(conflictElement, 50);
			setElementTopOffset(conflictElement, 500);
			setElementTopOffset(relativeElement0, 600);
			// #############
			setViewPortHeight(shouldBeWithinDistance ? 60 : 40);

			return conflictElement;
		}
	});

	function setViewPortHeight(height: number): void {
		sandbox.stub(document.documentElement, 'clientHeight').value(height);
		sandbox.stub(window, 'innerHeight').value(height);
	}

	function setScrollPosition(position: number): void {
		sandbox.stub(window, 'scrollY').value(position);
	}

	function setElementTopOffset(element: HTMLElement, top: number): void {
		const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;

		sandbox.stub(element, 'getBoundingClientRect').returns({ top: top - scrollTop } as any);
	}

	function setElementOffsetHeight(element: HTMLElement, height: number): void {
		sandbox.stub(element, 'offsetHeight').value(height);
	}

	function expectThrowNoPlaceToInsertError(slotConfig: SlotCreatorConfig): void {
		try {
			slotCreator.createSlot(slotConfig);
		} catch (e) {
			expect(e.message).to.equal('No place to insert slot ad-test.');
			return;
		}

		expect(true).to.equal(false, 'createSlot should have thrown');
	}
});
