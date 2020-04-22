import { Container } from '@wikia/dependency-injection';

export type Binder<T = any> = Parameters<Container['bind']>[0];
