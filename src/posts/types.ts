export declare type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export declare type NewPost = {
  title: string;
  body: string;
  userId: number;
};

export declare type InIt = {
  is_guest: boolean;
  user_unique_id: string;
  user_name: string;
};
