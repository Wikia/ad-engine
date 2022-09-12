export enum StorageStrategies {
	LOCAL = 'local',
	ADMS = 'adms',
}

export interface StorageStrategyInterface {
	get: () => Promise<string>;
}
