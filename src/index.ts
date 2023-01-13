import { Base } from './base';
import { HomeFeed } from './homefeed';
import { applyMixins } from './utils';
import { Chatroom } from './chatroom';
import { Member } from './user';
import { DmFeed } from './directmessage';

class LikeMinds extends Base {}
interface LikeMinds extends HomeFeed, Chatroom, Member, DmFeed {}

applyMixins(LikeMinds, [HomeFeed, Chatroom, Member, DmFeed]);

export default LikeMinds;
