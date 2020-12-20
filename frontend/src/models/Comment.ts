import { Post } from "./Post";
import { User } from "./User";

export default interface Comment {
    id: number;
    content: string;
    replies: [];
    post: Post;
    user: User;
}