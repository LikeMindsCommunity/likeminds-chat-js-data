export interface EmojiData {
  id: string;
  name: string;
  native: string;
  unified: string;
  keywords: string[];
  shortcodes: string[];
  skin?: number;
  src?: string;
  aliases?: string[];
  emoticons?: string[];
}
