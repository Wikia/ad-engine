import { Container } from '@wikia/dependency-injection';
import { TvguidePlatform } from './tvguide-platform';

const container = new Container();
const platform = container.get(TvguidePlatform);

platform.execute();
