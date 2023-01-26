import { Container } from '@wikia/dependency-injection';
import { GamefaqsPlatform } from './gamefaqs-platform';
import './styles.scss';

const container = new Container();
const platform = container.get(GamefaqsPlatform);

platform.execute();
