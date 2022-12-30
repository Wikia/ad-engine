export enum IdentityRepositories {
	LOCAL = 'local',
	IDENTITY_STORAGE = 'identity_storage',
	ADMS = 'adms',
	GLOBAL_IDENTITY = 'global_identity',
}

export interface IdentityRepositoryInterface {
	get: () => Promise<string>;
}
