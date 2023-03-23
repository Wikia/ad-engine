import '@abraham/reflection';
import { container } from 'tsyringe';
import { GiantbombPlatform } from './giantbomb-platform';
import './styles.scss';

const platform = container.resolve(GiantbombPlatform);

platform.execute();
