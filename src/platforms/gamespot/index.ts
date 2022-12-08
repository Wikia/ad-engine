import { Container } from '@wikia/dependency-injection';
import { GameSpotPlatform } from './gamespot-platform';

const container = new Container();
const platform = container.get(GameSpotPlatform);

platform.execute();
