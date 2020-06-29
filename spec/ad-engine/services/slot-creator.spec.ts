import { SlotCreator, SlotCreatorConfig, SlotCreatorWrapperConfig } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { createHtmlElementStub } from '../../spec-utils/html-element.stub';

describe('SlotCreator', () => {
	const sandbox = createSandbox();
	let slotCreator: SlotCreator;
	let parent: HTMLDivElement;
	let querySelectorAll: SinonStub;

	beforeEach(() => {
		slotCreator = new SlotCreator();
		parent = document.createElement('div');
		querySelectorAll = sandbox.stub(document, 'querySelectorAll');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('insertMethod', () => {
		it('should insert with append', () => {
			const slotElement = testInsertMethod('append');
			const relativeElement = parent.children[0];

			expect(relativeElement.children.length).to.equal(2);
			expect(relativeElement.children[1]).to.equal(slotElement, 'slotElement is in wrong place');
			expect(relativeElement.children[0].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with prepend', () => {
			const slotElement = testInsertMethod('prepend');

			const relativeElement = parent.children[0];

			expect(relativeElement.children.length).to.equal(2);
			expect(relativeElement.children[0]).to.equal(slotElement, 'slotElement is in wrong place');
			expect(relativeElement.children[1].tagName).to.equal('SPAN', 'span is in wrong place');
		});

		it('should insert with after', () => {
			const slotElement = testInsertMethod('after');

			expect(parent.children.length).to.equal(2);
			expect(parent.children[1]).to.equal(slotElement, 'slotElement is in wrong place');
		});

		it('should insert with before', () => {
			const slotElement = testInsertMethod('before');

			expect(parent.children.length).to.equal(2);
			expect(parent.children[0]).to.equal(slotElement, 'slotElement is in wrong place');
		});

		function testInsertMethod(insertMethod: SlotCreatorConfig['insertMethod']): HTMLElement {
			const slotConfig: SlotCreatorConfig = {
				insertMethod,
				slotName: 'ad-test',
				anchorSelector: '#relative',
			};
			const relativeElement = document.createElement('div');

			relativeElement.append(document.createElement('span'));
			parent.append(relativeElement);
			querySelectorAll.withArgs('#relative').returns([relativeElement]);

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
			const relativeElement = createHtmlElementStub(sandbox, 'div');

			querySelectorAll.withArgs('#relative').returns([relativeElement]);

			const slotElement = slotCreator.createSlot(slotConfig, wrapperConfig);
			const wrapperElement = slotElement.parentElement;

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
			expect(!!wrapperElement).to.equal(true, "wrapperElement doesn't exist");
			expect(relativeElement.before.getCalls()[0].args[0]).to.equal(
				wrapperElement,
				"wrapper wasn't injected by relativeElement",
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
