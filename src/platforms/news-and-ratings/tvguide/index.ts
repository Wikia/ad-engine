import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { TvGuidePlatform } from './tvguide-platform';

const container = new Container();
const platform = container.get(TvGuidePlatform);

platform.execute();
platform.setupPageChangeWatcher(container);
