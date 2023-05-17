import { Base } from './base';
import { HomeFeedClient } from './pages/homefeed';
import { applyMixins } from './utils';
import { ChatroomData } from './pages/chatroom';
import { Member } from './pages/user';
import { DmFeed } from './pages/directmessage';
import { Search } from './pages/search';
import { ExploreFeed } from './pages/explore-feed';

class LikeMinds extends Base {}
interface LikeMinds extends HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search {}

applyMixins(LikeMinds, [HomeFeedClient, ChatroomData, ExploreFeed, Member, DmFeed, Search]);

export default LikeMinds;
