import { Post } from "./Post";
import { User } from "./User";

export default interface Comment {
    id: number;
    content: string;
    replies: [];
    pattern: string;
    post: Post;
    user: User;
    created_at: string;
}