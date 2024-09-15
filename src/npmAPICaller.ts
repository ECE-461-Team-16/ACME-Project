const fetch = require('node-fetch');

// Interface for the structure of the NPM API response
interface NPMRegistryResponse {
    'dist-tags': {
        latest: string;
    };
    versions: {
        [version: string]: {
            name: string;
            version: string;
            description: string;
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
            license: string;
        };
    };
    time: Record<string, string>;
}

// Interface for the structure of the NPM package info
export interface NPMPackageInfo {
    name: string;
    version: string;
    description: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
    license: string;
    downloads: number;
}

// Function to fetch NPM package information
export async function fetchNPMPackageInfo(packageName: string): Promise<NPMPackageInfo> {
    const response = await fetch(`https://registry.npmjs.org/${packageName}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch NPM package info for ${packageName}`);
    }

    const data: any = await response.json();

    // Ensure necessary fields are present before proceeding
    if (!data['dist-tags'] || !data.versions || !data.time) {
        throw new Error('Incomplete data from NPM registry');
    }

    const latestVersion = data['dist-tags'].latest;
    const latestData = data.versions[latestVersion];

    return {
        name: latestData.name,
        version: latestData.version,
        description: latestData.description,
        dependencies: latestData.dependencies || {},
        devDependencies: latestData.devDependencies || {},
        license: latestData.license,
        downloads: Object.keys(data.time).length // Number of versions as a proxy for downloads
    };
}

// Function to print NPM package information
export function printNPMPackageInfo(info: NPMPackageInfo) {
    console.log(`Package Name: ${info.name}`);
    console.log(`Version: ${info.version}`);
    console.log(`Description: ${info.description}`);
    console.log(`License: ${info.license}`);
    console.log(`Total Downloads: ${info.downloads}`);
    
    console.log('Dependencies:');
    Object.entries(info.dependencies).forEach(([dep, version]) => {
        console.log(`  ${dep}: ${version}`);
    });
    
    console.log('Dev Dependencies:');
    Object.entries(info.devDependencies).forEach(([dep, version]) => {
        console.log(`  ${dep}: ${version}`);
    });
}

