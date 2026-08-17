import useCompanionDialogue from '@/hooks/useCompanionDialogue';
import DialoguePanel from './DialoguePanel';

export default function Floating33Chat({ activeNode, isOpen, onToggle }) {
  const dialogue = useCompanionDialogue({ pageState: 'world', activeNode });

  return (
    <aside className={`floating-33 ${isOpen ? 'floating-33-open' : ''}`} aria-label="33 chat">
      <button className="floating-33-button" type="button" onClick={onToggle}>
        33
      </button>
      {isOpen && (
        <DialoguePanel
          compact
          messages={dialogue.messages}
          onSend={dialogue.sendMessage}
          placeholder={activeNode ? `Ask about ${activeNode.title}...` : 'Ask about the world...'}
        />
      )}
    </aside>
  );
}
