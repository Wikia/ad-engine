export const checkDateRange = (start?: number, end?: number): boolean => {
	const currentTime = Date.now();
	let result = true;

	// if there's start date, check it
	if (typeof start === 'number' && currentTime < start) {
		result &&= false;
	}

	// if there's end date, check it
	if (typeof end === 'number' && currentTime > end) {
		result &&= false;
	}

	return result;
};
