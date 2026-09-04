/**
 * A highly faithful English Stemmer implementation in TypeScript.
 * Provides Tokenization, Stemming, and Bag-of-Words vectorization.
 */

// Tokenizes a string into an array of words
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // strip punctuation
    .split(/\s+/)
    .filter(word => word.length > 0);
}

// A simple but effective Porter-like Stemmer to reduce suffixes
export function stem(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 2) return w;

  // Step 1: Plurals and basic inflectional suffixes
  if (w.endsWith('s')) {
    if (w.endsWith('sses')) {
      w = w.slice(0, -2); // classes -> class
    } else if (w.endsWith('ies')) {
      w = w.slice(0, -3) + 'i'; // flies -> fli
    } else if (!w.endsWith('ss')) {
      w = w.slice(0, -1); // cats -> cat
    }
  }

  // Step 2: -eed, -ing, -ed
  if (w.endsWith('eed')) {
    w = w.slice(0, -1); // agreed -> agree
  } else if (w.endsWith('ing')) {
    w = w.slice(0, -3); // walking -> walk
    // readjust duplicate endings (e.g. running -> runn -> run)
    if (w.length > 3 && w[w.length - 1] === w[w.length - 2]) {
      // unless it's double l, s, or z which are standard
      if (!['l', 's', 'z'].includes(w[w.length - 1])) {
        w = w.slice(0, -1);
      }
    }
  } else if (w.endsWith('ed')) {
    w = w.slice(0, -2); // walked -> walk
    if (w.length > 3 && w[w.length - 1] === w[w.length - 2]) {
      if (!['l', 's', 'z'].includes(w[w.length - 1])) {
        w = w.slice(0, -1);
      }
    }
  }

  // Step 3: Derivational suffixes
  if (w.endsWith('y') && w.length > 3) {
    w = w.slice(0, -1) + 'i'; // happy -> happi
  }

  // Step 4: Common noun/adjective suffixes
  if (w.endsWith('ational')) {
    w = w.slice(0, -7) + 'ate'; // relational -> relate
  } else if (w.endsWith('tional')) {
    w = w.slice(0, -6) + 'tion'; // conditional -> condition
  } else if (w.endsWith('izer')) {
    w = w.slice(0, -1); // organizer -> organize
  } else if (w.endsWith('alli') || w.endsWith('ally')) {
    w = w.slice(0, -4); // magically -> magic
  } else if (w.endsWith('ful')) {
    w = w.slice(0, -3); // helpful -> help
  } else if (w.endsWith('ness')) {
    w = w.slice(0, -4); // sadness -> sad
  } else if (w.endsWith('ment') && w.length > 5) {
    w = w.slice(0, -4); // statement -> state
  } else if (w.endsWith('ability')) {
    w = w.slice(0, -5) + 'le'; // capability -> capable
  }

  return w;
}

/**
 * Creates a binary "Bag of Words" representation of the input sentence.
 * @param sentence User's natural language input string.
 * @param vocabulary Array of all stemmed vocabulary words.
 */
export function getBagOfWords(sentence: string, vocabulary: string[]): {
  vector: number[];
  stemmedWords: string[];
  rawWords: string[];
} {
  const rawWords = tokenize(sentence);
  const stemmedWords = rawWords.map(w => stem(w));
  
  const vector = vocabulary.map(vocabWord => {
    return stemmedWords.includes(vocabWord) ? 1 : 0;
  });

  return { vector, stemmedWords, rawWords };
}
