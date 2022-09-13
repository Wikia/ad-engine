export enum IdentityRepositories {
	LOCAL = 'local',
	ADMS = 'adms',
}

export interface IdentityRepositoryInterface {
	get: () => Promise<string>;
}
