import * as dotenv from 'dotenv';

// stuff to grab token from .env file
dotenv.config();
const TOKEN = process.env.GITHUB_TOKEN;

// GraphQl endpoint
const GITHUB_API_URL = 'https://api.github.com/graphql';

/////// structures for different interfaces ///////
export interface RepositoryInfo {
  data: {
    repository: {
      name: string;
      owner: {
        login: string;
      };
      forks: {
        totalCount: number;
      };
    };
  };
}

export interface RepositoryIssues {
  data: {
    repository: {
      issues: {
        totalCount: number;
        edges: Array<{
          node: {
            title: string;
            createdAt: string;
            closedAt: string | null; // null if issue is still open
          };
        }>;
      };
      closedIssues: {
        totalCount: number;
      };
    };
  };
}

export interface RepositoryUsers {
  data: {
    repository: {
      mentionableUsers: {
        edges: Array<{
          node: {
            login: string;
            url: string;
            contributionsCollection: {
              contributionCalendar: {
                totalContributions: number;
              };
              commitContributionsByRepository: Array<{
                contributions: {
                  edges: Array<{
                    node: {
                      occurredAt: string; 
                    };
                  }>;
                };
              }>;
            };
          };
        }>;
      };
    };
  };
}


/////// GraphQL API calls for different information ///////

// function to call API for basic repo information
export default async function fetchRepositoryInfo(owner: string, name: string): Promise<RepositoryInfo> {
  const query = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        name
        owner {
          login
        }
        forks {
          totalCount
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if(!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result: RepositoryInfo = await response.json();
  
  return result;
}

// function to call API for issue repo information
export async function fetchRepositoryIssues(owner: string, name: string): Promise<RepositoryIssues> {
  const query = `
  query {
    repository(owner: "${owner}", name: "${name}") {
        issues(first: 10) {
            totalCount
            edges {
                node {
                    title
                    createdAt
                    closedAt
                }
            }
        }
        closedIssues: issues(states: CLOSED) {
          totalCount
        }
      }
    }
  `;
  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if(!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result: RepositoryIssues = await response.json();
  
  return result;
}

// function to call API for user repo information
export async function fetchRepositoryUsers(owner: string, name: string): Promise<RepositoryUsers> {
  const query = `
    query {
      repository(owner: "${owner}", name: "${name}") {
        mentionableUsers(first: 10) {
          edges {
            node {
              login
              url
              contributionsCollection {
                contributionCalendar {
                  totalContributions
                }
                commitContributionsByRepository {
                  contributions(first: 1) { 
                    edges {
                      node {
                        occurredAt
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(GITHUB_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if(!response.ok) {
    throw new Error(`Failed to fetch data: ${response.statusText}`);
  }

  const result: RepositoryUsers = await response.json();
  
  return result;
}


/////// print functions ///////

// print repository basic information
export function printRepositoryInfo(info: RepositoryInfo) {
    const repository = info.data.repository;
    console.log('Repository Name:', repository.name);
    console.log('Owner:', repository.owner.login);
    console.log('Forks:', repository.forks.totalCount);
} 

// print repository issue information
export function printRepositoryIssues(info: RepositoryIssues) {
  const repository = info.data.repository;
  const issues = repository.issues;

  // details of each issue (for loop from GPT)
  issues.edges.forEach((issue, index) => {
    console.log(`Issue: ${index + 1}:`);
    console.log(' Title: ', issue.node.title);
    console.log('  Created At: ', issue.node.createdAt);
    console.log('  Closed At:  ', issue.node.closedAt ? issue.node.closedAt : 'Open');
  });

  // total closed issues
  console.log('Total Closed Issues:', repository.closedIssues.totalCount);

  // total Issues
  console.log('Total Issues:', issues.totalCount);
}

// print repository user information
export function printRepositoryUsers(info: RepositoryUsers) {
  const mentionableUsers = info.data.repository.mentionableUsers;

  // check if there are no users
  if(mentionableUsers.edges.length === 0) {
    console.log("No mentionable users found.");
    return;
  }

  // print out each user (for loop from GPT)
  mentionableUsers.edges.forEach((user, index) => {
    if (!user.node) {
      console.log(`User ${index + 1}: Data is unavailable`);
      return;
    }

    console.log(`User ${index + 1}:`);
    console.log('  Login: ', user.node.login);
    console.log('  Profile URL: ',user.node.url);
    console.log('  Total Contributions: ', user.node.contributionsCollection.contributionCalendar.totalContributions);

    // print all user's first contribution
    if(user.node.contributionsCollection.commitContributionsByRepository.length > 0) {
      user.node.contributionsCollection.commitContributionsByRepository.forEach((repo, repoIndex) => {
        console.log('  Repository ', repoIndex + 1, 'Contributions:');

        if (repo.contributions.edges.length > 0) {
          repo.contributions.edges.forEach((contribution, contributionIndex) => {
            console.log(`    Contribution ${contributionIndex + 1}:`);
            console.log('      Occurred At: ', contribution.node.occurredAt);
          });
        } 
        else {
          console.log("    No contributions found.");
        }
      });
    } 
    else {
      console.log("      No repository contributions found.");
    }
  });
}

