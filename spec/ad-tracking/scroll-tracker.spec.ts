import { context } from '@wikia/ad-engine';
import { ScrollTracker } from '@wikia/ad-tracking';
import { communicationService, eventsRepository } from '@wikia/communication/index';
import { expect } from 'chai';
import { createSandbox, SinonFakeTimers } from 'sinon';
import { stubScrollSpeedCalculator } from '../ad-engine/services/scroll-speed-calculator.stub';

/**
 * The use of Promise.resolve() is required for testing Promise-based code.
 * See https://stackoverflow.com/questions/55440400/
 * testing-that-promise-resolved-not-until-timeout-sinon-chai#
 * for explanation.
 */

describe('ScrollTracker', () => {
	const sandbox = createSandbox();
	let clock: SinonFakeTimers;

	function buildFakeElement(): Partial<HTMLElement> {
		return {
			addEventListener: sandbox.stub().callsFake((eventName, cb) => {
				cb();
			}),
			removeEventListener: sandbox.stub(),
		};
	}

	beforeEach(() => {
		sandbox.stub(context, 'get').returns(true);
		sandbox.stub(document, 'getElementsByClassName').callsFake((className) => {
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
	});

	it('should call scrollSpeedCalculator.setAverageSessionScrollSpeed once timeouts complete', async () => {
		const { scrollSpeedCalculatorStub } = stubScrollSpeedCalculator(sandbox);
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
		await Promise.resolve();

		expect(scrollSpeedCalculatorStub.setAverageSessionScrollSpeed.getCall(0).args[0]).to.deep.equal(
			[scrolls[1] - scrolls[0]],
		);
	});

	it('should not call scrollSpeedCalculator.setAverageSessionScrollSpeed if one timer is cancelled', async () => {
		const { scrollSpeedCalculatorStub } = stubScrollSpeedCalculator(sandbox);
		const tracker = new ScrollTracker([0, 200, 1000], 'fake');

		tracker.initScrollSpeedTracking();

		clock.tick(500);
		await Promise.resolve();

		communicationService.emit(eventsRepository.PLATFORM_BEFORE_PAGE_CHANGE);

		clock.tick(700);
		await Promise.resolve();
		await Promise.resolve();
		await Promise.resolve();

		expect(scrollSpeedCalculatorStub.setAverageSessionScrollSpeed.notCalled).to.equal(true);
	});
});
