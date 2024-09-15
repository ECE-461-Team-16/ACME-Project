import fetchRepositoryInfo, { fetchRepositoryUsers, fetchRepositoryIssues, 
  printRepositoryUsers, printRepositoryIssues, printRepositoryInfo 
} from './GtiHubAPIcaller';

import { fetchNPMPackageInfo, printNPMPackageInfo } from './npmAPICaller';

// Determine if the URL is for GitHub or NPM
function isGitHubURL(url: string): boolean {
  return url.includes('github.com');
}

function isNPMURL(url: string): boolean {
  return url.includes('npmjs.com');
}

async function main(url: string) {
  if (!url) {
      console.log('Please provide a URL.');
      return;
  }

  if (isGitHubURL(url)) {
      const owner = 'ECE-461-Team-16'; // Example owner
      const repository = 'ACME-Project'; // Example repository

      try {
          const repositoryInfo = await fetchRepositoryInfo(owner, repository);
          const repositoryIssues = await fetchRepositoryIssues(owner, repository);
          const repositoryUsers = await fetchRepositoryUsers(owner, repository);

          printRepositoryInfo(repositoryInfo);
          printRepositoryIssues(repositoryIssues);
          printRepositoryUsers(repositoryUsers);
      } catch (error) {
          console.error('GitHub Error:', error);
      }
  } else if (isNPMURL(url)) {
      const packageName = url.split('/').pop(); // Extract the package name from the URL

      try {
          const packageInfo = await fetchNPMPackageInfo(packageName || 'browserify');
          printNPMPackageInfo(packageInfo);
      } catch (error) {
          console.error('NPM Error:', error);
      }
  } else {
      console.log('Unsupported URL format.');
  }
}

// Call the function with a different URL for testing purposes
// main('https://www.npmjs.com/package/browserify');
main('https://www.npmjs.com/package/express');
