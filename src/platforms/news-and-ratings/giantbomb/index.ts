import { Container } from '@wikia/dependency-injection';
import { GiantbombPlatform } from './giantbomb-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(GiantbombPlatform);

platform.execute();
