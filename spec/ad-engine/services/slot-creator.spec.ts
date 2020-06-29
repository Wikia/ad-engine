import { SlotCreator, SlotCreatorConfig } from '@wikia/ad-engine';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';
import { createHtmlElementStub } from '../../spec-utils/html-element.stub';

describe('SlotCreator', () => {
	const sandbox = createSandbox();
	let slotCreator: SlotCreator;
	let querySelectorAll: SinonStub;

	beforeEach(() => {
		slotCreator = new SlotCreator();
		querySelectorAll = sandbox.stub(document, 'querySelectorAll');
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('insertMethod', () => {
		it('should insert with append', () => {
			testInsertMethod('append');
		});
		it('should insert with prepend', () => {
			testInsertMethod('prepend');
		});
		it('should insert with after', () => {
			testInsertMethod('after');
		});
		it('should insert with before', () => {
			testInsertMethod('before');
		});

		function testInsertMethod(insertMethod: SlotCreatorConfig['insertMethod']): void {
			const slotConfig: SlotCreatorConfig = {
				insertMethod,
				slotName: 'ad-test',
				anchorSelector: '#relative',
			};
			const relativeElement = createHtmlElementStub(sandbox, 'div');

			querySelectorAll.withArgs('#relative').returns([relativeElement]);

			const slotElement = slotCreator.createSlot(slotConfig);

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
			expect(relativeElement[insertMethod].getCalls().length).to.equal(
				1,
				`${[insertMethod]} called more than once`,
			);
			expect(relativeElement[insertMethod].getCalls()[0].args[0]).to.equal(
				slotElement,
				`element not passed to ${[insertMethod]}`,
			);
		}
	});

	describe('wrapper', () => {
		it('should create slot inside wrapper', () => {
			const slotConfig: SlotCreatorConfig = {
				insertMethod: 'before',
				slotName: 'ad-test',
				anchorSelector: '#relative',
			};
			const relativeElement = createHtmlElementStub(sandbox, 'div');

			querySelectorAll.withArgs('#relative').returns([relativeElement]);

			const slotElement = slotCreator.createSlot(slotConfig, {});
			const wrapperElement = slotElement.parentElement;

			expect(!!slotElement).to.equal(true, "slotElement doesn't exist");
			expect(!!wrapperElement).to.equal(true, "wrapperElement doesn't exist");
			expect(relativeElement.before.getCalls()[0].args[0]).to.equal(wrapperElement);
		});
	});

	// function setViewPortHeight(height: number): void {
	// 	sandbox.stub(document.documentElement, 'clientHeight').value(height);
	// }
	//
	// function setScrollPosition(position: number): void {
	// 	sandbox.stub(window, 'scrollY').value(position);
	// }
});
