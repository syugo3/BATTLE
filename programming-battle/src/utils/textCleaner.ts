export const cleanGeminiResponse = (text: string): string => {
  let cleanText = text;
  
  // マークダウン記号の削除
  cleanText = cleanText
    .replace(/^```json\n/, '')
    .replace(/```$/, '')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/"{2,}/g, '"')
    .replace(/\\{2,}/g, '\\')
    .replace(/```[a-z]*|```/g, '')
    .trim();

  // 最後の閉じ括弧で切り取り
  const lastBraceIndex = cleanText.lastIndexOf('}');
  if (lastBraceIndex !== -1) {
    cleanText = cleanText.substring(0, lastBraceIndex + 1);
  }

  return cleanText;
}; 