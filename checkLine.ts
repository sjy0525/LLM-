import { execSync } from 'child_process';

// Function to get the number of added lines in the pull request
function getAddedLines(): number {
  try {
    const output = execSync('git diff --cached --stat').toString();
    const addedLines = output
      .split('\n')
      .map(line => line.match(/(\d+) insertions?\(\+\)/))
      .filter(Boolean)
      .reduce((sum, match) => sum + parseInt(match![1], 10), 0);
    return addedLines;
  } catch (error) {
    console.error('Error calculating added lines:', error);
    process.exit(1);
  }
}

// Main function to check if the added lines exceed the limit
function main() {
  const lineLimit = 2000;
  const addedLines = getAddedLines();

  if (addedLines > lineLimit) {
    console.error(`Error: The total number of added lines (${addedLines}) exceeds the limit of ${lineLimit} lines.`);
    process.exit(1);
  } else {
    console.log(`Line count check passed. Total added lines: ${addedLines}`);
  }
}

// Run the main function
main();