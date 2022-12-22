import { Base } from "./base";
import { Posts } from "./posts";
import { HomeFeed } from "./homefeed";
import { applyMixins } from "./utils";
import { Chatroom } from "./chatroom";
import { Member } from "./user";
import { DmFeed } from "./directmessage";

class LikeMinds extends Base {}
interface LikeMinds extends Posts, HomeFeed, Chatroom, Member, DmFeed {}

applyMixins(LikeMinds, [Posts, HomeFeed, Chatroom, Member, DmFeed]);

export default LikeMinds;
