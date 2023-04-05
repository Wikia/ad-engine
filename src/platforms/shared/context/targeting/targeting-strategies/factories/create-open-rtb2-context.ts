import { FandomContext } from '../models/fandom-context';
import { OpenRtb2Object } from '../models/open-rtb2';
import { OpenRtb2Tags } from '../providers/open-rtb2-tags';

export function createOpenRtb2Context(fandomContext: FandomContext): OpenRtb2Object {
	return new OpenRtb2Tags(fandomContext).get();
}
