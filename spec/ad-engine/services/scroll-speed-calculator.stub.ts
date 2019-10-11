import { ScrollSpeedCalculator } from '@wikia/ad-engine';
import { SinonSandbox, SinonStub } from 'sinon';

export type ScrollSpeedCalculatorStub = { [key in keyof ScrollSpeedCalculator]: SinonStub };

export function createScrollSpeedCalculatorStub(sandbox: SinonSandbox): ScrollSpeedCalculatorStub {
	return {
		setAverageSessionScrollSpeed: sandbox.stub(),
	} as any;
}

export function stubScrollSpeedCalculator(
	sandbox: SinonSandbox,
	scrollSpeedCalculatorStub: ScrollSpeedCalculatorStub = createScrollSpeedCalculatorStub(sandbox),
): {
	scrollSpeedCalculatorMakeStub: SinonStub;
	scrollSpeedCalculatorStub: ScrollSpeedCalculatorStub;
} {
	const scrollSpeedCalculatorMakeStub = sandbox
		.stub(ScrollSpeedCalculator, 'make')
		.returns(scrollSpeedCalculatorStub as any);

	return {
		scrollSpeedCalculatorMakeStub,
		scrollSpeedCalculatorStub,
	};
}
