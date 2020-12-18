import { User } from "./User";

export interface Post {
    id?: number;
    post_title: string;
    description: string;
    created_at: string;
    voteCount: number;
    comment_count: number;
    did_upvote?: number;
    user: User;
}