import fs from 'fs';
import path from 'path';

// This is a "singleton" pattern. It ensures that we only load the dictionary once,
// no matter how many times this file is imported. Think of it as creating one
// master copy of the dictionary that the whole application can reference.
let dictionary: Set<string>;

function loadDictionary(): Set<string> {
  // If the dictionary is already loaded, just return it.
  if (dictionary) {
    return dictionary;
  }

  try {
    // We construct the full path to the file. `process.cwd()` gives us the root
    // of the project, and we look inside the 'public' folder for our word list.
    const filePath = path.join(process.cwd(), 'public', 'NWL2023.txt');
    
    // We read the file's content. `readFileSync` is used here because this code
    // runs once when the server starts. For other cases, an asynchronous
    // version (`readFile`) is usually better.
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // We split the file content by new lines to get an array of words,
    // then create a Set from that array for instant lookups.
    const words = fileContent.split(/\r?\n/);
    dictionary = new Set(words);

    console.log('Dictionary loaded successfully.');
    return dictionary;
  } catch (error) {
    // If the file isn't found or there's an error, we log it and return an empty Set.
    // This prevents the app from crashing.
    console.error('Failed to load dictionary:', error);
    dictionary = new Set(); // Initialize with an empty set on failure
    return dictionary;
  }
}

// Load the dictionary when the module is first imported.
const wordList = loadDictionary();

// This is the function you'll use in your game logic.
// It's a simple, clean way to check if a word exists.
export function isValidWord(word: string): boolean {
  return wordList.has(word.toUpperCase());
}
