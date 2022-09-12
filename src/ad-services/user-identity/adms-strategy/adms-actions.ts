export enum ActionType {
	IDENTITY = 'identity',
}

export interface Action<T = void> {
	time: number;
	name: string;
	type: ActionType;
	payload?: T;
}
