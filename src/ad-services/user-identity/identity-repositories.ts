export enum IdentityRepositories {
	LOCAL = 'local',
	IDENTITY_STORAGE = 'identity_storage',
	ADMS = 'adms',
}

export interface IdentityRepositoryInterface {
	get: () => Promise<string>;
}
