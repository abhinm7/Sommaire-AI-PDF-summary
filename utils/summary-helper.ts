// Interface for the parsed section
interface ParsedSection {
    title: string;
    points: string[];
  }
  
  // Interface for the parsed point characteristics
  interface ParsedPoint {
    isNumbered: boolean;
    isMainPoint: boolean;
    hasEmoji: boolean;
    isEmpty: boolean;
  }
  
  // Interface for the parsed emoji point
  interface ParsedEmojiPoint {
    emoji: string;
    text: string;
  }
  
  /**
   * Parses a section string into a title and a list of points.
   * Each point is either a line starting with '*' or a standalone non-empty line.
   * @param section - The input string to parse.
   * @returns An object containing the title and an array of points.
   */
  export const parseSection = (section: string): ParsedSection => {
    if (!section?.trim()) {
      return { title: '', points: [] };
    }
  
    const [title, ...content] = section.split('\n');
    const cleanTitle = title.startsWith('#') ? title.substring(1).trim() : title.trim();
  
    const points: string[] = [];
    let currentPoint: string | null = null;
  
    content.forEach((line) => {
      const trimmedLine = line.trim();
  
      if (!trimmedLine) {
        // Empty line: finalize current point if it exists
        if (currentPoint) {
          points.push(currentPoint.trim());
          currentPoint = null;
        }
        return;
      }
  
      if (trimmedLine.startsWith('*')) {
        // New point starting with '*': finalize previous point if it exists
        if (currentPoint) {
          points.push(currentPoint.trim());
        }
        currentPoint = trimmedLine;
      } else {
        // Non-'*' line: treat as a new point
        if (currentPoint) {
          points.push(currentPoint.trim());
        }
        currentPoint = trimmedLine;
      }
    });
  
    // Finalize the last point if it exists
    if (currentPoint) {
      points.push(currentPoint.trim());
    }
  
    return {
      title: cleanTitle,
      points: points.filter(
        (point) => point && !point.startsWith('#') && !point.toLowerCase().startsWith('[choose')
      ),
    };
  };
  
  /**
   * Analyzes a point string to determine its characteristics.
   * @param point - The point string to analyze.
   * @returns An object indicating whether the point is numbered, a main point, contains an emoji, or is empty.
   */
  export function parsePoint(point: string): ParsedPoint {
    if (!point || typeof point !== 'string') {
      return { isNumbered: false, isMainPoint: false, hasEmoji: false, isEmpty: true };
    }
  
    const trimmedPoint = point.trim();
    const isNumbered = /^\d+\./.test(trimmedPoint);
    const isMainPoint = /^\*/.test(trimmedPoint);
    const emojiRegex = /[\p{Emoji}\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}]/u;
    const hasEmoji = emojiRegex.test(trimmedPoint);
    const isEmpty = !trimmedPoint;
  
    return { isNumbered, isMainPoint, hasEmoji, isEmpty };
  }
  
  /**
   * Parses a point string that starts with an emoji, extracting the emoji and text.
   * @param content - The point string to parse.
   * @returns An object with the emoji and text, or null if parsing fails.
   */
  export function parseEmojiPoint(content: string): ParsedEmojiPoint | null {
    if (!content?.trim()) {
      return null;
    }
  
    const cleanContent = content.replace(/^['*]\s*/, '').trim(); // Remove leading '*' or quote
    const matches = cleanContent.match(/^(\p{Emoji}+)(.+)$/u);
  
    if (!matches) {
      return null;
    }
  
    const [, emoji, text] = matches;
    return {
      emoji: emoji.trim(),
      text: text.trim(),
    };
  }