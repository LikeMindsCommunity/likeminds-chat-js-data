import { Base } from './base';
import { HomeFeedClient } from './homefeed';
import { applyMixins } from './utils';
import { ChatroomData } from './chatroom';
import { Member } from './user';
import { DmFeed } from './directmessage';
import { Search } from './search';
import { ExploreFeed } from './explore-feed';

class LikeMinds extends Base {}
interface LikeMinds extends HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search {}

applyMixins(LikeMinds, [HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search]);

export default LikeMinds;
