import { Container } from '@wikia/dependency-injection';

/*eslint @typescript-eslint/no-unused-vars: "off"*/
export type Binder<T = any> = Parameters<Container['bind']>[0];
