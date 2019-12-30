export type TemplateTransition<T extends string = string> = (targetStateKey: T) => Promise<void>;
