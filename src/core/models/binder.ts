import { InjectionToken, ValueProvider } from 'tsyringe';

/*eslint @typescript-eslint/no-unused-vars: "off"*/
export type Binder<T = any> = [InjectionToken<T>, ValueProvider<T>];
