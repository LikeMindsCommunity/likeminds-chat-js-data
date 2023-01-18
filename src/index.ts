import { Base } from './base';
import { HomeFeed } from './homefeed';
import { applyMixins } from './utils';
import { Chatroom } from './chatroom';
import { Member } from './user';
import { DmFeed } from './directmessage';
import { Search } from './search';

class LikeMinds extends Base {}
interface LikeMinds extends HomeFeed, Chatroom, Member, DmFeed, Search {}

applyMixins(LikeMinds, [HomeFeed, Chatroom, Member, DmFeed, Search]);

export default LikeMinds;
