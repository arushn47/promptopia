"use client";

import { useState, useEffect } from 'react';

import PromptCard from './PromptCard';

const PromptCardList = ({ data, handleTagClick, handleUserClick }) => {
  return (
    <div className='mt-16 prompt_layout'>
      {data.map((post) => (
        <PromptCard
          key={post._id}
          post={post}
          handleTagClick={handleTagClick}
        />
      ))}
    </div>
  );
}

const Feed = () => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  }

  useEffect(() => {
    const fetchPrompts = async () => {
      const response = await fetch('/api/prompt');
      const data = await response.json();
      setPosts(data);
    };

    fetchPrompts();
  }, []);

  useEffect(() => {
    if (searchText) {
      const filteredPosts = posts.filter(post =>
        post.prompt.toLowerCase().includes(searchText.toLowerCase()) ||
        post.tag.toLowerCase().includes(searchText.toLowerCase()) ||
        post.creator.username.toLowerCase().includes(searchText.toLowerCase())
      );
      setPosts(filteredPosts);
    } else {
      const fetchPrompts = async () => {
        const response = await fetch('/api/prompt');
        const data = await response.json();
        setPosts(data);
      }
      fetchPrompts();
    }
  }, [searchText]);

  const handleTagClick = (tag) => {
    setSearchText(tag);
    const filteredPosts = posts.filter(post =>
      post.tag.toLowerCase().includes(tag.toLowerCase())
    );
    setPosts(filteredPosts);
  }

  const handleUserClick = (userId) => {
    setSearchText(userId);
    const filteredPosts = posts.filter(post =>
      post.creator._id === userId
    );
    setPosts(filteredPosts);
  }

  return (
    <section className='feed'>
      <form className='relative w-full flex-center'>
        <input
          type='text'
          placeholder='Search for a tag or a username'
          value={searchText}
          onChange={handleSearchChange}
          required
          className='search_input peer'
        />
      </form>
      <PromptCardList
        data={posts}
        handleTagClick={handleTagClick}
        handleUserClick={handleUserClick}
      />
    </section>
  )
}

export default Feed