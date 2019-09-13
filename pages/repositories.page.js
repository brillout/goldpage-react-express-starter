// We use React but Goldpage also works with Vue, RNW, ...
import React from 'react';

import getRepositories from './data/getRepositories';
import fetch from '@brillout/fetch';


import RepoList from './views/RepoList';

// The page config:
export default {
  route: '/repos/:username',
  addInitialProps,
  view: Repos,
  title,
  renderToHtml: true,
};

// `getRepositories(username)` uses the GitHub API
// to load the repositories of `username`.
// `addInitialProps` makes `repositories` available
// to `view`.
async function addInitialProps({username}) {
  const repositories = await getRepositories(username);
  return {repositories};
}

function Repos({username, repositories}) {
  return (
    <div>
      Hello <b>{username}</b>,

      <br/><br/>
      Your GitHub repositories are:
      <RepoList repositories={repositories} />
    </div>
  );
}

function title({username, repositories}) {
  return (
    username+' repositories ('+repositories.length+')'
  );
}

function RepoList({repositories}) {
  if( repositories===null ){
    return <Err msg="You reached GitHub's API quota limit. Try again later."/>;
  }
  if( repositories.length===0 ){
    return <Err msg="You have no repositories"/>;
  }
  return (
    <ul>
      { repositories
      .sort((repo1, repo2) => repo2.stargazers_count - repo1.stargazers_count)
      .map(({full_name, description}) => (
        <li key={full_name}>
          {full_name}
        </li>
      )) }
      {repositories.length===10 && <li>...</li>}
    </ul>
  );
}

function Err({msg}) {
  return <div style={{marginTop: 12, marginLeft: 22, color: 'red'}}>{msg}</div>;
}

const GITHUB_API_URL = username => 'https://api.github.com/users/'+username+'/repos';

export default getRepositories;

async function getRepositories(username){
  const response = await fetch(GITHUB_API_URL(username));
  if( response.status===403 ){
    return null;
  }
  const repositories = await response.json();
  return repositories.slice(0, 10);
}
