import React from 'react';
import { ArrowUp } from 'react-bootstrap-icons';
import { useDispatch, useSelector } from 'react-redux';
import history from '../../../shared/history';
import { selectAuthUser } from '../../auth/authSlice';
import { upvoteComment, updateUpvotesReduce } from '../threadSlice';

interface UpvoteProps {
    did_upvote: number;
    voteCount: number;
    pattern: string;
    commentId: number;
    postId: string;
}

export default function CommentUpvote(props: UpvoteProps) {
    const dispatch = useDispatch();
    const authUser = useSelector(selectAuthUser);
    let { did_upvote, voteCount, pattern, commentId, postId } = props;

    return (
        <div className="arrow-holder">
            <ArrowUp onClick={() => {
                if (!authUser) {
                    history.push('/auth');

                    //dispatch(resetStateReduce());

                    return;
                }
                
                let initialIndex = 0;
                const pathArray: string[] = [];
                
                voteCount = did_upvote === 0 ? voteCount + 1 : voteCount - 1;
                did_upvote = did_upvote === 0 ? 1 : 0;

                if(pattern) {
                    // build nested path array
                    const split = pattern.split('||');
                    const splitLength = split.length - 1;
                    
                    split.forEach((item, i) => {
                        if(i === 0) {
                            initialIndex = Number(item);
                            pathArray.push('replies');
                            return;
                        }

                        pathArray.push(item);

                        if(i !== splitLength) {
                            pathArray.push('replies');
                        }
                    });
                } else {
                    initialIndex = commentId;
                }

                dispatch(updateUpvotesReduce({ initialIndex, pathArray, voteCount, did_upvote }));
                dispatch(upvoteComment(pattern ? pattern : commentId.toString(), postId, authUser.api_token!));
            }} fill='#ff4500' />
            <p className={did_upvote === 1 ? 'upvoted' : ''}>{voteCount}</p>
        </div>
    );
}