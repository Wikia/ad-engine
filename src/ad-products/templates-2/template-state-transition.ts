export type Transition<T extends string = string> = (targetStateKey: T) => Promise<void>;
