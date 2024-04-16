// components/ArticleContent.tsx
import { Article, PlayerGameProfile } from '@/lib/types/types';

interface ArticleContentProps {
  article: Article;
  displayArticle: (content: string, playerMentions: PlayerGameProfile[], article: Article) => React.ReactNode;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ article, displayArticle }) => {
  const { content, player_mentions } = article;

  return <>{displayArticle(content || '', player_mentions || [], article)}</>;
};

export default ArticleContent;