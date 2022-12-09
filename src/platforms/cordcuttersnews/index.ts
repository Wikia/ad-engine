import { Container } from '@wikia/dependency-injection';
import { CcnPlatform } from './ccn-platform';

const container = new Container();
const platform = container.get(CcnPlatform);

platform.execute();
