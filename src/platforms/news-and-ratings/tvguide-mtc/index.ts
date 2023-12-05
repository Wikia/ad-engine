import { Container } from '@wikia/dependency-injection';
import './styles.scss';
import { TvGuideMTCPlatform } from './tvguide-mtc-platform';

const container = new Container();
const platform = container.get(TvGuideMTCPlatform);

platform.execute();
