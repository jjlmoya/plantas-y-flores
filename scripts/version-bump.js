#!/usr/bin/env node

/**
 * Automatic version bumping based on conventional commits
 * 
 * This script analyzes the last commit message and automatically
 * bumps the version according to conventional commit standards:
 * 
 * - feat: MINOR version bump
 * - fix: PATCH version bump
 * - BREAKING CHANGE: MAJOR version bump
 * - chore, docs, style, refactor, test: PATCH version bump
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

function getCommitMessage() {
  // In pre-commit hook, get the staged commit message
  if (process.env.GIT_COMMIT_MESSAGE) {
    return process.env.GIT_COMMIT_MESSAGE;
  }
  
  // Try to get from git log if we're in post-commit
  try {
    return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  } catch (error) {
    // If no commits exist, default to patch bump
    console.log('⚠️  No git commits found, defaulting to patch bump');
    return 'fix: initial version bump';
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function determineVersionBump(commitMessage) {
  const message = commitMessage.toLowerCase();
  
  // Check for breaking changes first
  if (message.includes('breaking change') || message.includes('!:')) {
    return 'major';
  }
  
  // Check for features
  if (message.startsWith('feat:') || message.startsWith('feature:')) {
    return 'minor';
  }
  
  // Everything else gets a patch bump
  // This includes: fix, chore, docs, style, refactor, test, etc.
  return 'patch';
}

function bumpVersion(bumpType) {
  try {
    const command = `npm run version:${bumpType}`;
    execSync(command, { stdio: 'inherit' });
    
    const newVersion = getCurrentVersion();
    console.log(`✅ Version bumped to ${newVersion} (${bumpType})`);
    return newVersion;
  } catch (error) {
    console.error('❌ Failed to bump version:', error.message);
    process.exit(1);
  }
}

function main() {
  const commitMessage = getCommitMessage();
  const currentVersion = getCurrentVersion();
  
  console.log(`📝 Commit message: ${commitMessage.split('\n')[0]}`);
  console.log(`📦 Current version: ${currentVersion}`);
  
  const bumpType = determineVersionBump(commitMessage);
  console.log(`🔄 Determined bump type: ${bumpType}`);
  
  const newVersion = bumpVersion(bumpType);
  
  console.log(`✅ Version bumped to ${newVersion}`);
}

main();