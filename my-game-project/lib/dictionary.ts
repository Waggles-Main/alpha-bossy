// This is an asynchronous singleton pattern. It ensures we only fetch and process
// the dictionary file once, no matter how many times this module is imported.
// It holds a "promise" that resolves with the fully loaded dictionary.
let dictionaryPromise: Promise<Set<string>> | null = null;

async function loadDictionary(): Promise<Set<string>> {
  try {
    // We use the browser's fetch API to request the file from the 'public' folder.
    const response = await fetch('/NWL2023.txt');
    const fileContent = await response.text();
    
    // We split the file into lines, then for each line, we take only the first part
    // (the word) before the first space. This handles the definitions.
    const words = fileContent
      .split(/\r?\n/)
      .map(line => line.split(' ')[0])
      .filter(Boolean); // Remove any empty lines

    const dictionary = new Set(words);
    console.log('Dictionary loaded successfully via fetch.');
    return dictionary;

  } catch (error) {
    console.error('Failed to load dictionary:', error);
    // Return an empty Set on failure to prevent the app from crashing.
    return new Set();
  }
}

// This function acts as a gatekeeper to our singleton.
function getDictionary(): Promise<Set<string>> {
  if (!dictionaryPromise) {
    dictionaryPromise = loadDictionary();
  }
  return dictionaryPromise;
}

// This is the public function our app will use. It's now asynchronous.
export async function isValidWord(word: string): Promise<boolean> {
  const dictionary = await getDictionary();
  if (!word) return false;

  // The dictionary is in uppercase, so we must match that.
  return dictionary.has(word.toUpperCase());
}
