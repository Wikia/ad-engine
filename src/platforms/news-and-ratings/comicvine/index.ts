import { Container } from '@wikia/dependency-injection';
import { ComicvinePlatform } from './comicvine-platform';

const container = new Container();
const platform = container.get(ComicvinePlatform);

platform.execute();
