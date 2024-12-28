interface FuzzySearchOptions {
  keys: string[];
  threshold?: number;
}

export function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: FuzzySearchOptions,
): T[] {
  if (!query) return items;

  const words = query.toLowerCase().split(" ");
  const { keys, threshold = 0.6 } = options;

  return items.filter(item => {
    return words.every(word => {
      return keys.some(key => {
        const value = String(item[key]).toLowerCase();

        // Calculate Levenshtein distance
        const distance = levenshteinDistance(word, value);
        const score = 1 - distance / Math.max(word.length, value.length);

        return score >= threshold || value.includes(word);
      });
    });
  });
}

function levenshteinDistance(str1: string, str2: string): number {
  const m = str1.length;
  const n = str2.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    Array(n + 1).fill(0),
  );

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j - 1] + 1,
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
        );
      }
    }
  }

  return dp[m][n];
}
