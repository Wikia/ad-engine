export class NotImplementedException extends Error {
	/**
	 * @param parameters - pass here method input parameters as an object.
	 * @param params - standard new Error() parameters, leave empty.
	 */
	constructor(parameters = {}, ...params) {
		params[0] = 'Not Implemented Exception';
		// Pass remaining arguments (including vendor specific ones) to parent constructor
		super(...params);

		// Maintains proper stack trace for where our error was thrown (only available on V8)
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NotImplementedException);
		}

		// Custom debugging information
		this.parameters = parameters;
	}
}
