import { Container } from '@wikia/dependency-injection';
import { TvGuidePlatform } from './tvguide-platform';

const container = new Container();
const platform = container.get(TvGuidePlatform);

platform.execute();
