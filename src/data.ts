import { Project, Article, Experience, CertificateFolder } from './types';

export const ACCENTS = [
  { id: 'cyan', name: 'Cyan Spark', class: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20 glow-cyan', hex: '#22d3ee' },
  { id: 'purple', name: 'Purple Dream', class: 'text-purple-400 bg-purple-400/10 border-purple-400/20 glow-purple', hex: '#c084fc' },
  { id: 'pink', name: 'Neon Coral', class: 'text-rose-400 bg-rose-400/10 border-rose-400/20 glow-rose', hex: '#fb7185' },
  { id: 'blue', name: 'Hyper Blue', class: 'text-blue-400 bg-blue-400/10 border-blue-400/20 glow-blue', hex: '#60a5fa' },
];

export const PROJECTS: Project[] = [
  {
    id: 'mini-os',
    title: 'Mini OS',
    symbol: '🖳',
    description: 'A miniature operating system in the browser recreating a full desktop workspace with custom window dragging, overlapping index control, notepad, interactive calculator, custom start menu, and an interactive CLI shell.',
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Local Storage'],
    challenges: 'Managing window coordinates dynamically while maintaining absolute coordinate systems inside nested iframe elements, ensuring z-index depth updates correctly when dragging or clicking windows, and keeping notepad records persistent.',
    whatLearned: 'Deepened understanding of viewport arithmetic, event bubbling suppression, memory-efficient state tracking, and building customized draggable shells without heavy external drag-and-drop packages.',
    liveUrl: 'https://notthatslayer.github.io/portfolioo/',
    githubUrl: 'https://github.com/notthatslayer/portfolioo',
    mockType: 'laptop'
  },
  {
    id: 'spotdemo',
    title: 'SpotDemo',
    symbol: '♫',
    description: 'A frontend media catalog designed to mock Spotify, featuring fully responsive album art displays, smooth music playing animations, track-level audio previews, list filtering, and rich glassmorphism hover animations.',
    technologies: ['React', 'CSS Modules', 'Web Audio API', 'Lucide Icons'],
    challenges: 'Ensuring seamless audio state sync between a global floating player card and individual track list items, coupled with beautiful music visualizer waves representing acoustic frequencies.',
    whatLearned: 'Mastered the HTML5 Audio interface, managed browser resource disposal for multiple loaded tracks, and created responsive layouts for dense media grids.',
    liveUrl: '#',
    githubUrl: 'https://github.com/notthatslayer',
    mockType: 'phone'
  },
  {
    id: 'budget-tracker',
    title: 'Budget Tracker',
    symbol: '⛃⛂',
    description: 'A personal finance dashboard designed to support swift micro-transactions entry, interactive monthly category breakdowns, budget cap alarm indicators, and visual spending trends.',
    technologies: ['TypeScript', 'React Hooks', 'SVG Visualizer', 'Local Storage'],
    challenges: 'Creating responsive SVG charting layouts that adjust naturally to grid scaling without importing bulky chart frameworks, keeping user entries persistent and safe.',
    whatLearned: 'Understood structural data operations for date-based logs, built light chart visualizers, and improved accessible keyboard entry for form inputs.',
    liveUrl: '#',
    githubUrl: 'https://github.com/notthatslayer',
    mockType: 'browser'
  },
  {
    id: 'red-light-green-light',
    title: 'Red Light Green Light',
    symbol: '◉',
    description: 'An interactive browser reflex game based on the famous Squid Game mechanic. Features motion detection reaction intervals, high-fidelity timer audio cues, and an offline scoreboard.',
    technologies: ['HTML5 Canvas', 'CSS Animations', 'Web Audio Cues', 'React State'],
    challenges: 'Ensuring high precision timer checks down to millisecond increments to accurately capture invalid player movement during the "Red Light" state.',
    whatLearned: 'Optimized high-frequency render updates using requestAnimationFrame, mastered sound scheduling, and handled visual transitions on state changes.',
    liveUrl: '#',
    githubUrl: 'https://github.com/notthatslayer',
    mockType: 'terminal'
  },
  {
    id: 'venting-platform',
    title: 'Venting Platform',
    symbol: '◡̈',
    description: 'An interactive therapeutic message board. Users submit their thoughts into digital envelopes that float into a space backdrop and automatically dissolve after 60 seconds of existence.',
    technologies: ['React', 'CSS Transitions', 'Client Timer Pool', 'Local Storage'],
    challenges: 'Tracking individual self-destruct timers for multiple cards in real-time, removing them safely from DOM memory without triggering structural list-shuffling glitches.',
    whatLearned: 'Designed a timed data eviction protocol in React state, crafted delicate particle fade-out animations, and managed user interaction flows.',
    liveUrl: '#',
    githubUrl: 'https://github.com/notthatslayer',
    mockType: 'phone'
  },
  {
    id: 'calculator',
    title: 'Calculator',
    symbol: '🖩',
    description: 'A polished glassmorphic calculator application supporting complex mathematical expressions, sequential operations, memory commands, and a toggleable transaction ledger history.',
    technologies: ['React State', 'Regular Expressions', 'CSS Grid'],
    challenges: 'Refining nested formula evaluation logic to prevent syntax errors on repeated decimal inputs, ensuring exact decimal point accuracy.',
    whatLearned: 'Utilized state machines to manage step-by-step operand entry, handled keyboard layout mapping, and crafted beautiful button ripple states.',
    liveUrl: '#',
    githubUrl: 'https://github.com/notthatslayer',
    mockType: 'calculator'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-inamigos',
    company: 'InAmigos Foundation',
    role: 'Content Writing Intern',
    description: 'Crafted structured and persuasive digital copy with clear focus, consistency, and audience-first messaging. Contributed to informational blog updates, social media outreach, and team content guidelines.',
    duration: 'Jun 2024 - Aug 2024'
  },
  {
    id: 'exp-marpu',
    company: 'Marpu Foundation',
    role: 'Content Specialist Intern',
    description: 'Expanded visual and written storytelling style, writing high-impact copy for community-driven initiatives. Polished content for clarity, optimized articles for searchability, and structured messaging for audience-centered impact.',
    duration: 'Mar 2024 - May 2024'
  },
  {
    id: 'exp-progoez',
    company: 'Progoez',
    role: 'Technical Writer Intern',
    description: 'Authored readable documentation, structured articles, and digital assets that blended corporate voice, clarity, and structural consistency. Managed research briefs and cross-referenced developer topics.',
    duration: 'Dec 2023 - Feb 2024'
  }
];

export const ARTICLES: Article[] = [
  {
    id: 'boredom',
    title: 'Are We Getting Bored More Easily Than Before?',
    coverUrl: 'https://picsum.photos/seed/boredom/1000/600',
    readTime: '6 min read',
    description: 'An analysis of digital attention spans, dopamine cycles, and how modern interfaces shape our neurological capacity for quiet reflection and slow digital craftsmanship.',
    date: 'Jun 15, 2026',
    topics: ['Society', 'UX Design', 'Psychology'],
    content: `# Are We Getting Bored More Easily Than Before?

## The 8-Second Attention Span Myth
We have all heard the statistic: humans now have an attention span shorter than a goldfish. While the actual science behind that specific claim is questionable, the subjective experience of modern digital life feels exactly like that. We scroll, swipe, and refresh. If a webpage takes longer than two seconds to load, we feel a twitch of restlessness.

Why does this happen? It is not that our brains have structurally changed in a decade; it is that the feedback loops of our interfaces have become incredibly optimized.

## The Dopamine Slot Machine
Every pull-to-refresh mechanism is designed to emulate a slot machine. You do not know what you will get next, and that variable reward schedule is the most addictive feedback loops in psychology. Because our apps offer infinite novelty, anything that stays still for a moment (a book, an elegant website, a slow transition) feels like a drag.

As developers and creators, we are accomplices in this design. We build for speed, and in doing so, we sometimes sacrifice depth.

## The Return of Slow Craft
There is a growing counter-movement. "Slow UX" is the practice of intentional friction. By adding deliberate moments of calm, micro-animations that require a second to resolve, and reading spaces with rich negative space, we invite visitors to slow down.

This portfolio is an experiment in that exact philosophy. It is not designed to be scanned in five seconds and forgotten. It is designed to be explored, played with, and read at a human pace.`
  },
  {
    id: 'self-destructing-messages',
    title: 'A Platform Where Messages Self-Destruct After a Minute',
    coverUrl: 'https://picsum.photos/seed/destruct/1000/600',
    readTime: '4 min read',
    description: 'The architectural design behind building temporary client-side memory loops, handling state evictions gracefully, and the product thinking of temporary digital footprints.',
    date: 'Apr 02, 2026',
    topics: ['Product Design', 'State Engines', 'TypeScript'],
    content: `# A Platform Where Messages Self-Destruct After a Minute

## The Ephemerality of Thought
Most digital interactions are logged forever. Our chat logs, search queries, and status updates persist as permanent data records. But human conversations are naturally fleeting. We say things, the sound waves disperse, and the moment becomes a memory.

Building the Venting Platform was an exploration of how ephemerality affects expression. When users know their words will vanish forever in sixty seconds, they write with unfiltered honesty.

## Architecting the Eviction Queue
From a technical perspective, the challenge lay in tracking multiple independent timers inside React's state loop without causing performance bottlenecks or visual jumpiness.

Standard timers can lead to resource leaks if not disposed of correctly. I designed a custom queue manager:

\`\`\`typescript
interface EvictionItem {
  id: string;
  createdAt: number;
  timerId: NodeJS.Timeout;
}
\`\`\`

When a new message is submitted, a state transition pushes the item into a pool and spawns a discrete setTimeout hook. Upon completion, the element undergoes a fade transition before being spliced from the collection, preventing layout shifts.

## Crafting the Visual Dissolve
The user interface should match the mechanics. Instead of suddenly deleting the element, the envelope card undergoes a multi-stage CSS animation: its opacity decreases, its vertical scale shrinks, and a particle cloud disperses. This makes the deletion feel like a natural release rather than a hard crash.`
  },
  {
    id: 'browser-operating-system',
    title: 'A Tiny Operating System in the Browser',
    coverUrl: 'https://picsum.photos/seed/minios/1000/600',
    readTime: '8 min read',
    description: 'Engineering a draggable, layered window manager inside a single-page React app, managing global state overrides, and optimizing nested viewport calculations.',
    date: 'Feb 10, 2026',
    topics: ['Web Engineering', 'TypeScript', 'Math'],
    content: `# A Tiny Operating System in the Browser

## Recreating the Desktop Feel
Web browsers have evolved from document viewers into powerful application containers. Recreating a desktop interface (with draggable windows, a start menu, a notepad, and calculators) is an excellent study in absolute layouts and drag mathematics.

To make the Mini OS feel premium, every interaction had to feel native. When you grab a window title bar, the drag must be immediate, fluid, and constrained within the laptop shell boundaries.

## Overlapping Depth (Z-Index Manager)
In a real desktop, clicking on any part of a window brings it to the foreground. In a CSS-driven layout, this requires dynamic z-index management.

Instead of arbitrary increments, the OS maintains a sorted stack of active window IDs:

\`\`\`typescript
const bringToFront = (id: string) => {
  setWindowStack((prev) => {
    const filtered = prev.filter((wId) => wId !== id);
    return [...filtered, id];
  });
};
\`\`\`

By mapping each window's CSS \`zIndex\` to its corresponding position index in the array, we guarantee a reliable order where the clicked window is always on top.

## Drag Physics & Boundary Clamping
To prevent a window from being lost outside the viewport boundaries, we track mouse move events globally, calculate coordinate deltas, and clamp the resulting positions:

\`\`\`typescript
const newX = Math.max(0, Math.min(clientX - offset.x, containerWidth - windowWidth));
const newY = Math.max(0, Math.min(clientY - offset.y, containerHeight - windowHeight));
\`\`\`

This creates a lightweight, solid desktop preview that operates on standard React state hooks without any heavyweight external coordinate handlers.`
  }
];

export const CERTIFICATE_FOLDERS: CertificateFolder[] = [
  {
    id: 'internships',
    name: 'Internships',
    icon: 'folder',
    certificates: [
      { name: 'InAmigos Content Writing Intern', url: 'https://picsum.photos/seed/cert1/800/1100', date: 'August 2024', issuer: 'InAmigos Foundation' },
      { name: 'Marpu Foundation Specialist Intern', url: 'https://picsum.photos/seed/cert2/800/1100', date: 'May 2024', issuer: 'Marpu Foundation' },
      { name: 'Progoez Technical Writing Intern', url: 'https://picsum.photos/seed/cert3/800/1100', date: 'February 2024', issuer: 'Progoez' }
    ]
  },
  {
    id: 'exp-letters',
    name: 'Experience Letters',
    icon: 'briefcase',
    certificates: [
      { name: 'InAmigos Recommendation Letter', url: 'https://picsum.photos/seed/letter1/800/1100', date: 'August 2024', issuer: 'InAmigos Foundation' },
      { name: 'Marpu Foundation Certificate of Excellence', url: 'https://picsum.photos/seed/letter2/800/1100', date: 'May 2024', issuer: 'Marpu Foundation' }
    ]
  },
  {
    id: 'completion-certs',
    name: 'Completion Certificates',
    icon: 'award',
    certificates: [
      { name: 'Google Workspace Integration Certificate', url: 'https://picsum.photos/seed/cert4/800/1100', date: 'January 2025', issuer: 'Google AI Studio Academy' },
      { name: 'Responsive Web Design Certification', url: 'https://picsum.photos/seed/cert5/800/1100', date: 'November 2023', issuer: 'FreeCodeCamp' },
      { name: 'Introduction to Python & SQL for IT', url: 'https://picsum.photos/seed/cert6/800/1100', date: 'July 2023', issuer: 'NPTEL India' }
    ]
  }
];
