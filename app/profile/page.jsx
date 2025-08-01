"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/Profile';

const MyProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPrompts = async () => {
            const response = await fetch(`/api/users/${session?.user.id}/posts`);
            const data = await response.json();
            setPosts(data);
        };

        if(session?.user.id) fetchPrompts();
    }, []);

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    }
    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if(hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'DELETE'
                });

                const filteredPosts = posts.filter((p) => p._id !== post._id);
                setPosts(filteredPosts);
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <Profile
            name="My "
            desc="Welcome to your profile page. Here you can see all your posts and manage them."
            data={posts}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
        />
    )
}

export default MyProfile