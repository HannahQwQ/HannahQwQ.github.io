export const WORLD_AREAS = [
  {
    id: 'projects',
    title: 'Project Gate',
    route: '/project/first-world',
    area: 'Works',
    position: [3.45, 0.55, -1.55],
    color: '#58c7d7',
    trigger: ['hover', 'click'],
    result: 'open-project-preview',
    fallbackClassName: 'fallback-node-projects',
    fallbackLabel: 'Project Gate',
    guide: 'This is the work gate. Inspect the context before entering details.',
    preview: {
      title: 'First World Prototype',
      summary: 'A compact 3D portfolio MVP for world structure, 33, and object-driven navigation.',
      stack: ['React', 'R3F', 'Drei', 'Three.js'],
      actionLabel: 'Open project',
    },
  },
  {
    id: 'about',
    title: 'Archive Wall',
    route: '/about',
    area: 'Profile',
    position: [-2.7, 0.55, -3.55],
    color: '#e8d26a',
    trigger: ['hover', 'click'],
    result: 'open-about-preview',
    fallbackClassName: 'fallback-node-about',
    fallbackLabel: 'Archive Wall',
    guide: 'This wall keeps the human context close to the technical work.',
    preview: {
      title: 'Computer Science x Design',
      summary: 'Background, research direction, stack, and the design logic behind this world.',
      stack: ['Computer Vision', '3D Human Generation', 'WebGL', 'Interaction Design'],
      actionLabel: 'Read archive',
    },
  },
  {
    id: 'mailbox',
    title: 'Letter Box',
    route: '/mailbox',
    area: 'Message',
    position: [-3.25, 0.55, 2.55],
    color: '#f07f6f',
    trigger: ['hover', 'click'],
    result: 'open-mailbox-preview',
    fallbackClassName: 'fallback-node-mailbox',
    fallbackLabel: 'Letter Box',
    guide: 'Leave a question here. Answered notes become part of the wall.',
    preview: {
      title: 'Anonymous Letter Box',
      summary: 'A quiet route for visitors to leave questions without turning 33 into a general chatbot.',
      stack: ['Cloudflare Worker', 'React', 'Offline fallback'],
      actionLabel: 'Open mailbox',
    },
  },
];

export const DEFAULT_VISITOR_SIGNAL = {
  nickname: 'Visitor',
  color: '#58c7d7',
  scale: 'Balanced',
  trail: 'Soft trace',
};

export const VISITOR_SIGNAL_OPTIONS = {
  colors: ['#58c7d7', '#e8d26a', '#f07f6f', '#9b8cff'],
  scales: ['Compact', 'Balanced', 'Tall'],
  trails: ['Soft trace', 'Pulse line', 'Quiet glow'],
};
