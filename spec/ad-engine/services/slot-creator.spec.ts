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
			expect(relativeElement0.children[1]).to.equal(slotElement, 'slotElement is in wrong place');
			expect(relativeElement0.children[0].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with prepend', () => {
			const slotElement = testInsertMethod('prepend');

			expect(relativeElement0.children.length).to.equal(
				2,
				'wrong number of relativeElement0 children',
			);
			expect(relativeElement0.children[0]).to.equal(slotElement, 'slotElement is in wrong place');
			expect(relativeElement0.children[1].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with after', () => {
			const slotElement = testInsertMethod('after');

			expect(parent.children.length).to.equal(4, 'wrong number of parent children');
			expect(parent.children[1]).to.equal(slotElement, 'slotElement is in wrong place');
		});

		it('should insert with before', () => {
			const slotElement = testInsertMethod('before');

			expect(parent.children.length).to.equal(4, 'wrong number of parent children');
			expect(parent.children[0]).to.equal(slotElement, 'slotElement is in wrong place');
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

	// function setViewPortHeight(height: number): void {
	// 	sandbox.stub(document.documentElement, 'clientHeight').value(height);
	// }
	//
	// function setScrollPosition(position: number): void {
	// 	sandbox.stub(window, 'scrollY').value(position);
	// }
});
