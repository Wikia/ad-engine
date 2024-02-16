export function waitForPathFinder(callback: () => void): void {
	let called = false;

	if (window.pathfinderModulesReady) {
		callback();
		return;
	}

	const makeCall = () => {
		if (called) {
			return;
		}

		called = true;
		callback();
	};

	setTimeout(() => {
		makeCall();
	}, 500);

	window.addEventListener('PathfinderModulesLoaded', () => {
		setTimeout(() => {
			makeCall();
		}, 50);
	});
}
