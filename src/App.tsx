import React, { MouseEvent, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useInfiniteQuery, useMutation, useQuery } from 'react-query';
import { useScrollBy } from 'react-use-window-scroll';

import useLocalStorage from 'use-local-storage';
import { useInView } from 'react-intersection-observer';
import { ReactQueryDevtools } from 'react-query/devtools';
import axios from 'axios';
import { getUsers, addUser } from './api/public';
import './App.css';
const queryClient = new QueryClient();

export interface Owner {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface License {
  key: string;
  name: string;
  spdx_id: string;
  url: string;
  node_id: string;
}

export interface Item {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  private: boolean;
  owner: Owner;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  forks_url: string;
  keys_url: string;
  collaborators_url: string;
  teams_url: string;
  hooks_url: string;
  issue_events_url: string;
  events_url: string;
  assignees_url: string;
  branches_url: string;
  tags_url: string;
  blobs_url: string;
  git_tags_url: string;
  git_refs_url: string;
  trees_url: string;
  statuses_url: string;
  languages_url: string;
  stargazers_url: string;
  contributors_url: string;
  subscribers_url: string;
  subscription_url: string;
  commits_url: string;
  git_commits_url: string;
  comments_url: string;
  issue_comment_url: string;
  contents_url: string;
  compare_url: string;
  merges_url: string;
  archive_url: string;
  downloads_url: string;
  issues_url: string;
  pulls_url: string;
  milestones_url: string;
  notifications_url: string;
  labels_url: string;
  releases_url: string;
  deployments_url: string;
  created_at: Date;
  updated_at: Date;
  pushed_at: Date;
  git_url: string;
  ssh_url: string;
  clone_url: string;
  svn_url: string;
  homepage: string;
  size: number;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  has_issues: boolean;
  has_projects: boolean;
  has_downloads: boolean;
  has_wiki: boolean;
  has_pages: boolean;
  forks_count: number;
  mirror_url?: any;
  archived: boolean;
  disabled: boolean;
  open_issues_count: number;
  license: License;
  allow_forking: boolean;
  is_template: boolean;
  topics: string[];
  visibility: string;
  forks: number;
  open_issues: number;
  watchers: number;
  default_branch: string;
  score: number;
}

export interface IRepository {
  total_count: number;
  incomplete_results: boolean;
  items: Item[];
}

function InfiniteScroll() {
  const [scrollY, setScrollY] = useLocalStorage('scrollY', 0);
  const scrollBy = useScrollBy();

  const { ref, inView } = useInView({
    threshold: 0.3,
  });

  const fetchRepositories = async (page: number) => {
    return await axios
      .get<IRepository>(`https://api.github.com/search/repositories?q=topic:reactjs&per_page=30&page=${page}`)
      .then((resp) => resp.data);
  };

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } = useInfiniteQuery<
    IRepository,
    Error,
    IRepository,
    [string] | string
  >(
    ['projects'],
    async ({ pageParam = 1 }) => {
      return await fetchRepositories(pageParam);
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        const maxPage = lastPage.total_count / 30;
        const nextPage = allPages.length + 1;
        return nextPage <= maxPage ? nextPage : undefined;
      },
    }
  );

  useEffect(() => {
    scrollBy(0, 1000);
  }, []);

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  return (
    <>
      <div>
        <h1>Infinite Loading</h1>
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : status === 'error' ? (
          <span>Error:</span>
        ) : (
          <>
            {data?.pages?.map((page, i) => (
              <React.Fragment key={i}>
                {page.items.map((project) => (
                  <p
                    style={{
                      border: '1px solid gray',
                      borderRadius: '5px',
                      padding: '10rem 1rem',
                      background: `hsla(${project.id * 30}, 60%, 80%, 1)`,
                    }}
                    key={project.id}
                  >
                    {project.name}
                  </p>
                ))}
              </React.Fragment>
            ))}
            <div style={{ height: '1000px' }}>
              <a href="http://naver.com" onClick={() => setScrollY(window.scrollY)}>
                scroll Test
              </a>
            </div>

            <div>
              <button ref={ref} onClick={() => fetchNextPage()} disabled={!hasNextPage || isFetchingNextPage}>
                {isFetchingNextPage ? 'Loading more...' : hasNextPage ? 'Load Newer' : 'Nothing more to load'}
              </button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Background Updating...' : null}</div>
          </>
        )}
        <hr />
      </div>
    </>
  );
}

function App() {
  useEffect(() => {
    document?.querySelector('body')?.scrollTo({ top: 1000 });
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <InfiniteScroll />
    </QueryClientProvider>
  );
}

export default App;
