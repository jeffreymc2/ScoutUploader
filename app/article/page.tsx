// pages/article.tsx
"use client";
import { ReactNode, useState } from 'react';
import useGenerateArticle from '@/app/hook/useGenerateArticle';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Article, PlayerGameProfile } from '@/lib/types/types';
import  ArticleContent  from '@/components/ArticleComponents/ArticleContent'; // Fixed import statement

export interface ArticleContentProps {
  article: Article;
  displayArticle: (content: string, playerMentions: PlayerGameProfile[], article: Article) => React.ReactNode;
}

const GenerateArticlePage = () => {
  const [gameId, setGameId] = useState('');
  const { isLoading, error, article, generateArticle } = useGenerateArticle();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await generateArticle(gameId);
  };

  const displayArticle = (content: string, playerMentions: PlayerGameProfile[], article: Article) => {
    const playerMap = new Map<string, number>();
    playerMentions.forEach((player) => {
      if (player.Name && player.PlayerID) {
        playerMap.set(player.Name, player.PlayerID);
      }
    });
  
    const paragraphs = content.split('\n');
    const formattedParagraphs = paragraphs.map((paragraph, index) => {
      const processedParagraph = paragraph.replace(/\b(\w+\s+\w+)\b/g, (match, playerName) => {
        const playerId = playerMap.get(playerName);
        if (playerId) {
          return `<a href="https://www.perfectgame.org/Players/Playerprofile.aspx?ID=${playerId}" target="_blank">${playerName}</a>`;
        }
        return playerName;
      });
  
      return <p key={index} dangerouslySetInnerHTML={{ __html: processedParagraph }} />;
    });
  
    return <>{formattedParagraphs}</>;
  };
  
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          placeholder="Enter game ID"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Article'}
        </Button>
      </form>
      {article && <ArticleContent article={article} displayArticle={displayArticle} />} 
    </div>
  );
};

export default GenerateArticlePage;