export function transformPriceFromCpm(cpm, maxCpm = 20) {
	const defaultCpm = 20;

	if (maxCpm < defaultCpm) {
		maxCpm = defaultCpm;
	}

	let result = Math.floor(maxCpm).toFixed(2);

	if (cpm === 0) {
		result = '0.00';
	} else if (cpm < 0.05) {
		result = '0.01';
	} else if (cpm < 5.00) {
		result = (Math.floor(cpm * 20) / 20).toFixed(2);
	} else if (cpm < 10.00) {
		result = (Math.floor(cpm * 10) / 10).toFixed(2);
	} else if (cpm < 20.00) {
		result = (Math.floor(cpm * 2) / 2).toFixed(2);
	} else if (cpm < maxCpm) {
		result = Math.floor(cpm).toFixed(2);
	}

	return result;
}
