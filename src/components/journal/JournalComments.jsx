import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { CommentDialog } from './CommentDialog';

const JournalComments = ({ journalId, initialCommentsCount, onCommentAdded }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(initialCommentsCount);

  const handleCommentAdded = () => {
    setCommentsCount(prev => prev + 1);
    onCommentAdded?.();
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="flex items-center space-x-1 h-8 px-2"
        onClick={() => setShowComments(true)}
      >
        <MessageCircle className="h-4 w-4" />
        <span className="text-xs">{commentsCount} comments</span>
      </Button>

      <CommentDialog
        open={showComments}
        onOpenChange={setShowComments}
        journalId={journalId}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
};

export default JournalComments;