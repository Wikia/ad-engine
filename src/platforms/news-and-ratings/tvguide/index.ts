import { container } from 'tsyringe';
import './styles.scss';
import { TvGuidePlatform } from './tvguide-platform';

const platform = container.resolve(TvGuidePlatform);

platform.execute();
platform.setupPageChangeWatcher();
