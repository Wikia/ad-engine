import { Container } from '@wikia/dependency-injection';
import { MetacriticPlatform } from './metacritic-platform';

const container = new Container();
const platform = container.get(MetacriticPlatform);

platform.execute();
