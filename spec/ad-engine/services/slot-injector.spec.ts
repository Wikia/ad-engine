import { expect } from 'chai';
import sinon from 'sinon';
import { context, slotInjector } from '../../../src/ad-engine/services';

describe('slot-repeater', () => {
	let elementProperties;
	let conflictingElement;
	let placeholder;

	afterEach(() => {
		document.querySelectorAll.restore();
	});

	beforeEach(() => {
		elementProperties = {
			offsetParent: {
				offsetTop: 0,
				offsetParent: null,
			},
		};

		conflictingElement = {
			classList: {
				contains: () => {},
			},
			offsetHeight: 300,
			offsetTop: 1400,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {},
			parentNode: {
				insertBefore: () => {},
			},
		};

		placeholder = {
			classList: {
				contains: () => {},
			},
			offsetHeight: 300,
			offsetTop: 1500,
			offsetParent: elementProperties.offsetParent,
			ownerDocument: {},
			parentNode: {
				insertBefore: () => {},
			},
		};

		const querySelectorAll = sinon.stub(document, 'querySelectorAll');

		querySelectorAll.withArgs('.foo').returns([conflictingElement]);
		querySelectorAll.withArgs('.main p').returns([placeholder]);

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
		conflictingElement.offsetTop = 100;

		expect(slotInjector.inject('incontent_player')).to.not.equal(null);
		expect(context.get('events.pushOnScroll.ids.0')).to.equal('incontent_player');
	});
});
