"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';

import Profile from '@components/Profile';

const UserProfile = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const params = useParams(); // Gets the dynamic part of the URL, e.g., the user's ID
    
    const [userPosts, setUserPosts] = useState([]);
    const [userName, setUserName] = useState("");

    // Fetch posts for the specific user ID from the URL
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/users/${params.id}/posts`);
            const data = await response.json();

            setUserPosts(data);
            // Assuming the user's name is the same for all their posts
            if (data.length > 0) {
                setUserName(data[0].creator.username);
            }
        };

        if (params.id) fetchPosts();
    }, [params.id]); // Re-run effect if the ID in the URL changes

    const handleEdit = (post) => {
        router.push(`/update-prompt?id=${post._id}`);
    }

    const handleDelete = async (post) => {
        const hasConfirmed = confirm("Are you sure you want to delete this prompt?");

        if (hasConfirmed) {
            try {
                await fetch(`/api/prompt/${post._id.toString()}`, {
                    method: 'DELETE'
                });

                const filteredPosts = userPosts.filter((p) => p._id !== post._id);
                setUserPosts(filteredPosts);
            } catch (error) {
                console.error(error);
            }
        }
    }
    
    // Check if the logged-in user is viewing their own profile
    const isOwner = session?.user.id === params.id;

    return (
        <Profile
            name={isOwner ? "My" : `${userName}'s `}
            desc={isOwner ? "Welcome to your personalized profile page." : `Welcome to ${userName}'s profile page.`}
            data={userPosts}
            handleEdit={isOwner ? handleEdit : null}
            handleDelete={isOwner ? handleDelete : null}
        />
    );
}

export default UserProfile;