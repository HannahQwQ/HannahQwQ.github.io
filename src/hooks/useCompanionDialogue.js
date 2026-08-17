import { useState } from 'react';

const ERROR_REPLY = 'Error 404: My logic module was wrestling with a pixel, and I did not quite catch that.';
const MAX_OPENING_TURNS = 5;
const PORTFOLIO_SCOPE = [
  'portfolio',
  'world',
  'project',
  'research',
  'design',
  'three',
  'webgl',
  'avatar',
  '33',
  'mailbox',
  '作品',
  '世界',
  '项目',
  '研究',
  '设计',
  '信箱',
  '分身',
];

function isInPortfolioScope(text) {
  const source = text.toLowerCase();
  return PORTFOLIO_SCOPE.some((keyword) => source.includes(keyword));
}

function createReply(text, pageState, activeNode) {
  if (!text.trim()) return ERROR_REPLY;

  if (pageState === 'opening' && !isInPortfolioScope(text)) {
    return 'I only answer things about this portfolio world. Let us keep the signal clean.';
  }

  if (activeNode) {
    return activeNode.guide;
  }

  if (text.toLowerCase().includes('continue') || text.includes('继续')) {
    return 'Good. Build a signal, then enter the world.';
  }

  if (text.toLowerCase().includes('avatar') || text.includes('分身')) {
    return 'The first avatar is a signal, not a body. Color, scale, trail.';
  }

  return 'This world starts small: one guide, three gates, clear exits.';
}

export default function useCompanionDialogue({ pageState, activeNode } = {}) {
  const [messages, setMessages] = useState([
    {
      role: 'companion',
      text: pageState === 'opening'
        ? 'I am 33. Ask briefly, then choose how to enter.'
        : 'I am here when you need context.',
    },
  ]);
  const [turns, setTurns] = useState(0);
  const isDormant = pageState === 'opening' && turns >= MAX_OPENING_TURNS;

  const sendMessage = (text) => {
    if (isDormant) return;

    const reply = createReply(text, pageState, activeNode);
    setMessages((current) => [
      ...current,
      { role: 'visitor', text },
      { role: 'companion', text: reply },
    ]);
    setTurns((current) => current + 1);
  };

  return {
    messages,
    turns,
    maxTurns: MAX_OPENING_TURNS,
    isDormant,
    sendMessage,
  };
}
