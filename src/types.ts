export interface InventBotIdea {
  title: string;
  category: string;
  description: string;
  impact: string;
}

export interface ArticleData {
  date: string;
  formattedDate: string;
  topic1: string;
  topic2: string;
  title: string;
  subtitle?: string;
  content: string;
  readingMinutes: number;
  keyword?: string;
  inventBotIdeas?: InventBotIdea[];
}

