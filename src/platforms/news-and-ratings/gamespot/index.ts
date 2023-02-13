import { container } from 'tsyringe';
import { GameSpotPlatform } from './gamespot-platform';
import './styles.scss';

const platform = container.resolve(GameSpotPlatform);

platform.execute();
