import { container } from 'tsyringe';
import { GamefaqsPlatform } from './gamefaqs-platform';
import './styles.scss';

const platform = container.resolve(GamefaqsPlatform);

platform.execute();
