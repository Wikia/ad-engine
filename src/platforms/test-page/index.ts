import { Container } from '@wikia/dependency-injection';
import { TestPagePlatform } from './test-page-platform';

const container = new Container();
const platform = container.get(TestPagePlatform);

platform.execute();
