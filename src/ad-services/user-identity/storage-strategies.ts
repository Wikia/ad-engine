export enum StorageStrategies {
	LOCAL = 'local',
	ADMS = 'ADMS',
}

export interface StorageStrategyInterface {
	get: () => Promise<string>;
}
