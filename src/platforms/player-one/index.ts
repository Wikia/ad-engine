import { Container } from '@wikia/dependency-injection';
import { PlayerOnePlatform } from './player-one-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(PlayerOnePlatform);

platform.execute();
