import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { createSelector } from '@reduxjs/toolkit'

import { selectUserById } from '../users/usersSlice'
import { useGetPostsQuery } from '../api/apiSlice'

export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector((state) => selectUserById(state, userId))
  let userName = "";
  if(user && user.name) {
    userName = user.name;
  }

  const selectPostsForUser = useMemo(() => {
    const emptyArray = []
    // Return a unique selector instance for this page so that
    // the filtered results are correctly memoized
    return createSelector(
      (res) => res.data,
      (res, userId) => userId,
      (data, userId) => data?.filter((post) => post.user === userId) ?? emptyArray
    )
  }, [])

  // Use the same posts query, but extract only part of its data
  const { postsForUser } = useGetPostsQuery(undefined, {
    selectFromResult: (res) => ({
      ...res,
      // Include a field called `postsForUser` in the hook result object,
      // which will be filtered list of posts
      postsForUser: selectPostsForUser(res, userId),
    }),
  })

  const postTitles = postsForUser.map((post) => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{userName}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}