import { LoggerFunctions } from '../types';

import consoleLoggerFactory from './consoleLoggerFactory';

function getStyles(bgColor: string) {
	return ['color: #fff', 'padding: 2px 4px', 'border-radius: 2px', `background-color: ${bgColor}`];
}

export function buildExperimentLoggerFunctions(identifier: string): LoggerFunctions {
	return {
		/** General important information (the fewer=the better) */
		info: consoleLoggerFactory(`PathfinderLite | ${identifier}`, 'info', getStyles('#334')),
		/** Debug info (only visible with debug param) */
		debug: consoleLoggerFactory(`PathfinderLite | ${identifier}`, 'debug', getStyles('#550')),
		/** Errors (always visible) */
		error: consoleLoggerFactory(`PathfinderLite | ${identifier}`, 'error', getStyles('#800')),
	};
}

const defaultLoggerFunctions: LoggerFunctions = {
	/** General important information (the fewer=the better) */
	info: consoleLoggerFactory('PathfinderLite', 'info', getStyles('#334')),
	/** Debug info (only visible with debug param) */
	debug: consoleLoggerFactory('PathfinderLite', 'debug', getStyles('#550')),
	/** Errors (always visible) */
	error: consoleLoggerFactory('PathfinderLite', 'error', getStyles('#800')),
};

export default defaultLoggerFunctions;
