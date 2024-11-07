export interface Gif {
  type: string;
  id: string;
  url: string;
  slug: string;
  bitly_gif_url: string;
  bitly_url: string;
  embed_url: string;
  username: string;
  source: string;
  title: string;
  rating: string;
  content_url: string;
  source_tld: string;
  source_post_url: string;
  is_sticker: number;
  import_datetime: string;
  trending_datetime: string;
  images: Images;
  user: User;
  analytics_response_payload: string;
  analytics: Analytics;
  alt_text: string;
}

export interface Images {
  original: ImageDetails;
  downsized: ImageDetails;
  downsized_large: ImageDetails;
  downsized_medium: ImageDetails;
  downsized_small: VideoDetails;
  downsized_still: ImageDetails;
  fixed_height: ImageDetails;
  fixed_height_downsampled: ImageDetails;
  fixed_height_small: ImageDetails;
  fixed_height_small_still: ImageDetails;
  fixed_height_still: ImageDetails;
  fixed_width: ImageDetails;
  fixed_width_downsampled: ImageDetails;
  fixed_width_small: ImageDetails;
  fixed_width_small_still: ImageDetails;
  fixed_width_still: ImageDetails;
  looping: VideoDetails;
  original_still: ImageDetails;
  original_mp4: VideoDetails;
  preview: VideoDetails;
  preview_gif: ImageDetails;
  preview_webp: ImageDetails;
  hd: VideoDetails;
  "480w_still": ImageDetails;
}

export interface ImageDetails {
  height: string;
  width: string;
  size: string;
  url: string;
  mp4_size?: string;
  mp4?: string;
  webp_size?: string;
  webp?: string;
  frames?: string;
  hash?: string;
}

export interface VideoDetails {
  height: string;
  width: string;
  mp4_size: string;
  mp4: string;
}

export interface User {
  avatar_url: string;
  banner_image: string;
  banner_url: string;
  profile_url: string;
  username: string;
  display_name: string;
  description: string;
  instagram_url: string;
  website_url: string;
  is_verified: boolean;
}

export interface Analytics {
  onload: Event;
  onclick: Event;
  onsent: Event;
}

export interface Event {
  url: string;
}
