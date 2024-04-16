// app/articles/[article_id]/page.tsx
import { ReactNode, Suspense } from 'react';
import  ArticleContent  from '@/components/ArticleComponents/ArticleContent';
import { supabaseServer } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { Article, PlayerGameProfile } from '@/lib/types/types';
import Link from 'next/link';




 const fetchArticle = async (articleId: string): Promise<Article> => {
    const supabase = supabaseServer();
    const { data, error } = await supabase
        .from('articles')
        .select(`*, player_mentions`)
        .eq('id', articleId)
        .single();

    if (error) {
        throw new Error(`Failed to fetch article with ID ${articleId}: ${error.message}`);
    }

    return {
        ...data,
        player_mentions: data.player_mentions ? JSON.parse(String(data.player_mentions)) : null,
    } as Article;
  };
    
    
// app/articles/[article_id]/page.tsx
const displayArticle = (content: string, playerMentions: PlayerGameProfile[], article: Article) => {
  const playerMap = new Map<string, number>();
  playerMentions.forEach((player) => {
    if (player.Name && player.PlayerID) {
      playerMap.set(player.Name, player.PlayerID);
    }
  });

  const paragraphs = content.split('\n');
  const formattedParagraphs = paragraphs.map((paragraph, index) => {
    const processedParagraph = paragraph.replace(/\b([A-Z][a-z]+ [A-Z][a-z]+)\b/g, (match, playerName) => {
      const playerId = playerMap.get(playerName);
      if (playerId) {
        return `<a href="https://www.perfectgame.org/Players/Playerprofile.aspx?ID=${playerId}" target="_blank" className="text-blue-500">${playerName}</a>`;
      }
      return playerName;
    });

    return <p key={index} className="mb-5" dangerouslySetInnerHTML={{ __html: processedParagraph }} />;
  });

  return <>{formattedParagraphs}</>;
};
  const formatContentByParagraphs = (content: string) => {
    return content.split('\n\n');
  };
      
     // Render the article content
     const ArticlePage = async ({ params }: { params: { article_id: string } }) => {
        const article = await fetchArticle(params.article_id);
      
        return (
          <Suspense fallback={<div>Loading...</div>}>
            <ArticleContent
              article={article}
              displayArticle={displayArticle}
            />
          </Suspense>
        );
      };
  export default ArticlePage;