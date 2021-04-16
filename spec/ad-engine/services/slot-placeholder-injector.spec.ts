import { SlotPlaceholderConfig, slotPlaceholderInjector } from '@wikia/ad-engine';
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
		anchorElement0.classList.add('anchor');
		anchorElement1.classList.add('anchor');
		anchorElement2.classList.add('anchor');
		conflictingElement = document.createElement('div');
		conflictingElement.id = 'conflict';
		parent.append(anchorElement0, conflictingElement, anchorElement1, anchorElement2);
		querySelectorAll = sandbox.stub(document, 'querySelectorAll');
		querySelectorAll.withArgs('.anchor').returns([anchorElement0, anchorElement1, anchorElement2]);
		querySelectorAll.withArgs('#conflict').returns([conflictingElement]);
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('slot placeholder should have classes passed in config', () => {
		const slotPlaceholderConfig: SlotPlaceholderConfig = {
			classList: ['class_1', 'class_2'],
			anchorSelector: '.anchor',
			insertMethod: 'append',
			avoidConflictWith: ['#conflict'],
			repeatLimit: 3,
		};

		setViewPortHeight(1000);
		setElementTopOffset(anchorElement1, 1200);
		setElementOffsetHeight(anchorElement1, 50);
		setScrollPosition(100);

		const placeholder = slotPlaceholderInjector.inject(slotPlaceholderConfig);

		expect(placeholder.classList.value).to.equal('class_1 class_2');
	});
});
