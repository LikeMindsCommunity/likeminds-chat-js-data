import LMChatClient from '.';
import { LMSDKCallbacks } from './LMCallback';

const lmChatClient = LMChatClient.setLMSDKCallbacks({} as any)
    .setApiKey('xapikey')
    .setPlatformCode('xplatformcode')
    .setVersionCode(1)
    .build();
