export interface Project {
  id: string;
  title: string;
  symbol: string;
  description: string;
  technologies: string[];
  challenges: string;
  whatLearned: string;
  liveUrl: string;
  githubUrl: string;
  mockType: 'laptop' | 'phone' | 'browser' | 'terminal' | 'calculator';
}

export interface Article {
  id: string;
  title: string;
  coverUrl: string;
  readTime: string;
  description: string;
  date: string;
  topics: string[];
  content: string; // Structured markdown or paragraphs for the premium reader
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  duration: string;
}

export interface Certificate {
  name: string;
  url: string;
  date: string;
  issuer: string;
}

export interface CertificateFolder {
  id: string;
  name: string;
  icon: string;
  certificates: Certificate[];
}

export interface FloatingWindow {
  id: string; // unique window ID
  title: string;
  type: 'project' | 'article' | 'certificate' | 'custom';
  contentId?: string; // ID of the project, article, or certificate folder
  isOpen: boolean;
  isMinimized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}
