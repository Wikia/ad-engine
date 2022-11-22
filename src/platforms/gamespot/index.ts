import { Container } from '@wikia/dependency-injection';
import { GiantBombPlatform } from './gamespot-platform';

const container = new Container();
const platform = container.get(GiantBombPlatform);

platform.execute();
