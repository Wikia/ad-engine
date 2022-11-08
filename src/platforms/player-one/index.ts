import { Container } from '@wikia/dependency-injection';
import { PlayerOnePlatform } from './player-one-platform';

const container = new Container();
const platform = container.get(PlayerOnePlatform);

platform.execute();
