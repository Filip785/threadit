import React from 'react';
import { useParams } from 'react-router';

export default function Thread() {
    const params: { thread: string } = useParams();

    // strategy for fetching data? ideally post title / post description are fetched only when full page reload (state is empty)
    // the comments probably should be fetched on each hit (either from frontpage or from full page reload)

    return (
        <h1>Thread ID: {params.thread}</h1>
    );
}