import { ConsoleFunction, LoggingType } from '../types';

import { isDebug, isOnBrowser } from '../env';

const BACKUP_ORIGIN_TIME = Date.now(); // fallback for timeorigin

function noopLog() {
	// noop;
}

function getTimeDelta() {
	const currentTimeStamp = Date.now();
	const originTime = isOnBrowser() ? window.performance?.timeOrigin : BACKUP_ORIGIN_TIME;
	const delta = currentTimeStamp - originTime;
	const secondsResult = delta / 1000;
	return secondsResult.toFixed(4);
}

function typeToFunction(type: LoggingType): ConsoleFunction {
	if (type === 'error') {
		return console.error;
	}

	if (type === 'debug') {
		if (isDebug()) {
			return console.debug;
		}
		return noopLog;
	}

	return console.log;
}

const consoleLog = (
	type: LoggingType,
	prefix: string,
	styles: string,
	message: string,
	...data: Array<any>
) => {
	const func = typeToFunction(type);
	const fullMessage = `%c${prefix} | ${getTimeDelta()}s | ${message}`;
	if (data.length) {
		func(fullMessage, styles, ...data);
	} else {
		func(fullMessage, styles);
	}
};

const consoleLoggerFactory = (
	prefix: string,
	type: LoggingType,
	styles: Array<string> = [],
): ConsoleFunction => {
	return (message: string, ...data: Array<any>) =>
		consoleLog(type, prefix, styles.join(';'), message, ...data);
};

export default consoleLoggerFactory;
