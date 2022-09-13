export enum ActionType {
	IDENTITY = 'identity',
}

export interface Action<T = unknown> {
	time: number;
	name: string;
	type: ActionType;
	payload?: T;
}

export interface IdentityAction extends Action {
	type: ActionType.IDENTITY;
	payload: {
		identityType: string;
		identityToken: string;
	};
}

export interface ActiveData {
	IDENTITY?: IdentityAction[];
}
