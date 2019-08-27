import { context, events, eventService, scrollSpeedCalculator } from '@wikia/ad-engine';
import { ScrollTracker } from '@wikia/ad-tracking';
import { expect } from 'chai';
import { createSandbox, SinonFakeTimers, SinonStub } from 'sinon';

/**
 * The use of Promise.resolve() is required for testing Promise-based code.
 * See https://stackoverflow.com/questions/55440400/
 * testing-that-promise-resolved-not-until-timeout-sinon-chai#
 * for explanation.
 */

describe('ScrollTracker', () => {
	const sandbox = createSandbox();
	let getElementsStub: SinonStub;
	let contextGetStub: SinonStub;
	let clock: SinonFakeTimers;
	let emittedEvents: any[];

	function buildFakeElement(): Partial<HTMLElement> {
		return {
			addEventListener: sandbox.stub().callsFake((eventName, cb, options) => {
				cb();
			}),
			removeEventListener: sandbox.stub(),
		};
	}

	beforeEach(() => {
		contextGetStub = sandbox.stub(context, 'get').returns(true);
		emittedEvents = [];
		getElementsStub = sandbox.stub(document, 'getElementsByClassName');
		getElementsStub.callsFake((className) => {
			return (
				{
					fake: [buildFakeElement()],
				}[className] || []
			);
		});
		clock = sandbox.useFakeTimers();
	});

	afterEach(() => {
		sandbox.restore();
		eventService.removeAllListeners();
	});

	it('should emit events.SCROLL_TRACKING_TIME_CHANGED events', async () => {
		const scrollYStub = sandbox.stub(window, 'scrollY').value(10);

		eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (time, position) => {
			emittedEvents.push({ time, position });
		});

		const tracker = new ScrollTracker([0, 1000], 'fake');

		tracker.initScrollSpeedTracking();

		clock.tick(500);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(1);
		expect(emittedEvents[0].time).to.equal(0);
		expect(emittedEvents[0].position).to.equal(10);

		scrollYStub.value(400);

		clock.tick(700);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(2);
		expect(emittedEvents[1].time).to.equal(1000);
		expect(emittedEvents[1].position).to.equal(400);
	});

	it('should not emit events.SCROLL_TRACKING_TIME_CHANGED events if is disabled in context', async () => {
		contextGetStub.returns(false);

		eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (event) => {
			emittedEvents.push(event);
		});

		const tracker = new ScrollTracker([0, 1000], 'fake');

		tracker.initScrollSpeedTracking();

		clock.tick(1000);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(0);
	});

	it('should not emit events.SCROLL_TRACKING_TIME_CHANGED events if no element found based on class name', async () => {
		eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (event) => {
			emittedEvents.push(event);
		});

		const tracker = new ScrollTracker([0, 1000], 'nonExistent');

		tracker.initScrollSpeedTracking();

		clock.tick(1000);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(0);
	});

	it('should cancel timers if BEFORE_PAGE_CHANGE_EVENT happens', async () => {
		eventService.on(events.SCROLL_TRACKING_TIME_CHANGED, (time, position) => {
			emittedEvents.push({ time, position });
		});

		const tracker = new ScrollTracker([0, 1000], 'fake');

		tracker.initScrollSpeedTracking();

		clock.tick(500);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(1);

		eventService.emit(events.BEFORE_PAGE_CHANGE_EVENT);

		clock.tick(700);
		await Promise.resolve();

		expect(emittedEvents.length).to.equal(1);
	});

	it('should call scrollSpeedCalculator.getAverageSessionScrollSpeed once timeouts complete', async () => {
		const setAvgSpeedStub = sandbox.stub(scrollSpeedCalculator, 'setAverageSessionScrollSpeed');
		const scrolls = [10, 400];
		const scrollYStub = sandbox.stub(window, 'scrollY').value(scrolls[0]);

		const tracker = new ScrollTracker([0, 1000], 'fake');

		tracker.initScrollSpeedTracking();

		clock.tick(500);
		await Promise.resolve();

		scrollYStub.value(scrolls[1]);

		clock.tick(700);
		await Promise.resolve();
		await Promise.resolve();

		expect(setAvgSpeedStub.calledWith([scrolls[1] - scrolls[0]])).to.equal(true);
	});
});
