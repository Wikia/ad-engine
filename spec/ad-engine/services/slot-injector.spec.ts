import { expect } from 'chai';
import { createSandbox } from 'sinon';
import { context, slotInjector } from '../../../src/ad-engine/services';

describe('slot-injector', () => {
	const sandbox = createSandbox();
	let elementProperties;
	let conflictingElement;
	let placeholder;

	afterEach(() => {
		sandbox.restore();
	});

	beforeEach(() => {
		elementProperties = {
			getBoundingClientRect: () => ({ top: 0, left: 0 }),
			offsetParent: {
				offsetTop: 0,
				offsetParent: null,
			},
		};

		conflictingElement = {
			getBoundingClientRect: () => ({ top: 0, left: 0 }),
			classList: {
				contains: () => {},
			},
			offsetHeight: 300,
			offsetTop: 1400,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {},
		};

		placeholder = {
			getBoundingClientRect: () => ({ top: 0, left: 0 }),
			classList: {
				contains: () => {},
			},
			offsetHeight: 300,
			offsetTop: 1500,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {},
			before: () => {},
		};

		const querySelectorAll = sandbox.stub(document, 'querySelectorAll');

		querySelectorAll.withArgs('.foo').returns([conflictingElement] as any);
		querySelectorAll.withArgs('.main p').returns([placeholder] as any);

		context.set('events.pushOnScroll.ids', []);
		context.set('slots.incontent_player', {
			avoidConflictWith: '.foo',
			defaultSizes: [[1, 1]],
			insertBeforeSelector: '.main p',
			targeting: {
				loc: 'hivi',
			},
		});
	});

	it('slot container is not injected when conflictingElement is too close', () => {
		expect(slotInjector.inject('incontent_player')).to.equal(null);
		expect(context.get('events.pushOnScroll.ids').length).to.equal(0);
	});

	it('slot container is injected when conflictingElement is far away', () => {
		conflictingElement.getBoundingClientRect = () => ({ top: 2000, left: 0 });

		expect(slotInjector.inject('incontent_player')).to.not.equal(null);
		expect(context.get('events.pushOnScroll.ids.0')).to.equal('incontent_player');
	});
});
