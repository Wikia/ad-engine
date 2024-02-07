export enum BucketType {
	/** Bucket is valid and not part of Control buckets nor isn't a restricted value */
	Valid = 'Valid',

	/** Bucket is invalid (is part of Control buckets or does not conform to valid characters) */
	Invalid = 'Invalid',

	/** Bucket is part of Control buckets */
	Control = 'Control',
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
