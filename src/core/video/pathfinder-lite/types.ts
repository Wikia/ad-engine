export enum BucketType {
	/** Bucket is valid when it's not part of a restricted value */
	Valid = 'Valid',

	/** Bucket is invalid (does not conform to valid characters) */
	Invalid = 'Invalid',
}

/** Logger type for dev console */
export type LoggingType = 'info' | 'debug' | 'error';

/** Console function for building logger functionality */
export type ConsoleFunction = (message: string, ...data: Array<any>) => void;

/** Logger function for dev console */
export interface LoggerFunctions {
	info: ConsoleFunction;
	debug: ConsoleFunction;
	error: ConsoleFunction;
}

/** Information needed to define an experiment */
export interface ExperimentInfo {
	name: string;
	buckets: string[];
	disabled?: boolean;
	startDate?: number;
	endDate?: number;
}

/** Extended functionality added to the experiment definition */
export interface Experiment extends ExperimentInfo {
	log: LoggerFunctions;
}
