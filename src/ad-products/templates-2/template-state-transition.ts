export type Transition<T extends string> = (targetStateKey: T) => Promise<void>;
