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

function getLastCommitMessage() {
  try {
    return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
  } catch (error) {
    console.log('⚠️  No git commits found, skipping version bump');
    process.exit(0);
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
  const commitMessage = getLastCommitMessage();
  const currentVersion = getCurrentVersion();
  
  console.log(`📝 Last commit: ${commitMessage.split('\n')[0]}`);
  console.log(`📦 Current version: ${currentVersion}`);
  
  const bumpType = determineVersionBump(commitMessage);
  console.log(`🔄 Determined bump type: ${bumpType}`);
  
  const newVersion = bumpVersion(bumpType);
  
  // Add the updated package.json to the current commit if we're in a git hook
  if (process.env.npm_lifecycle_event === 'postcommit') {
    try {
      execSync('git add package.json', { stdio: 'inherit' });
      execSync(`git commit --amend -m "${commitMessage}\n\n🤖 Auto-bumped version to ${newVersion}"`, { stdio: 'inherit' });
      console.log('📦 Version bump added to commit');
    } catch (error) {
      console.log('⚠️  Could not amend commit with version bump');
    }
  }
}

main();