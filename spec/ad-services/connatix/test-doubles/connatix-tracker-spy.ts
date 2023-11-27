import sinon from 'sinon';

class ConatixTrackerSpy {
	register(): void {}
	setPlayerApi(): void {}
	trackInit(): void {}
	trackReady(): void {}
}

export function makePlayerTrackerSpy() {
	return sinon.createStubInstance(ConatixTrackerSpy);
}
