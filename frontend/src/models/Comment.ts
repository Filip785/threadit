import { Post } from "./Post";
import { User } from "./User";

export default interface Comment {
    id: number;
    content: string;
    replies: Comment[];
    pattern: string;
    post: Post;
    user: User;
    voteCount: number;
    did_upvote: number;
    created_at: string;
}