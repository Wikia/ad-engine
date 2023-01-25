import { Container } from '@wikia/dependency-injection';
import { GameSpotPlatform } from './gamespot-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(GameSpotPlatform);

platform.execute();
