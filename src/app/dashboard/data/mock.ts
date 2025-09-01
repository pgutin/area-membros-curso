import { Course, Lesson, Category, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'João Silva',
  email: 'joao@exemplo.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  subscription: 'premium',
  joinedAt: '2024-01-15'
};

export const mockCategories: Category[] = [
  { id: '1', name: 'Desenvolvimento Web', icon: 'Grid', courseCount: 12 },
  { id: '2', name: 'Design UI/UX', icon: 'Star', courseCount: 8 },
  { id: '3', name: 'Marketing Digital', icon: 'Circle', courseCount: 15 },
  { id: '4', name: 'Negócios', icon: 'Circle', courseCount: 10 },
  { id: '5', name: 'Fotografia', icon: 'Circle', courseCount: 6 }
];

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'React Avançado: Do Zero ao Expert',
    description: 'Aprenda React do básico ao avançado com projetos práticos e as melhores práticas do mercado.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    duration: 1200, // 20 horas
    totalLessons: 45,
    completedLessons: 12,
    category: 'Desenvolvimento Web',
    level: 'Avançado',
    instructor: 'Maria Santos',
    rating: 4.9,
    isFavorite: true,
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Design System Completo',
    description: 'Crie design systems escaláveis e consistentes para produtos digitais modernos.',
    thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=225&fit=crop',
    duration: 800, // 13.3 horas
    totalLessons: 32,
    completedLessons: 0,
    category: 'Design UI/UX',
    level: 'Intermediário',
    instructor: 'Carlos Design',
    rating: 4.8,
    isFavorite: false,
    tags: ['Design System', 'Figma', 'UI', 'UX'],
    createdAt: '2024-01-05',
    updatedAt: '2024-01-20'
  },
  {
    id: '3',
    title: 'Next.js 15: Aplicações Full-Stack',
    description: 'Desenvolva aplicações completas com Next.js 15, incluindo autenticação, banco de dados e deploy.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    duration: 1500, // 25 horas
    totalLessons: 60,
    completedLessons: 25,
    category: 'Desenvolvimento Web',
    level: 'Avançado',
    instructor: 'Pedro Tech',
    rating: 4.9,
    isFavorite: true,
    tags: ['Next.js', 'Full-Stack', 'TypeScript', 'Prisma'],
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25'
  },
  {
    id: '4',
    title: 'Marketing Digital para Iniciantes',
    description: 'Estratégias completas de marketing digital para alavancar seu negócio online.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
    duration: 600, // 10 horas
    totalLessons: 24,
    completedLessons: 24,
    category: 'Marketing Digital',
    level: 'Iniciante',
    instructor: 'Ana Marketing',
    rating: 4.7,
    isFavorite: false,
    tags: ['SEO', 'Google Ads', 'Social Media', 'Analytics'],
    createdAt: '2024-01-08',
    updatedAt: '2024-01-22'
  },
  {
    id: '5',
    title: 'Fotografia Profissional',
    description: 'Técnicas avançadas de fotografia para criar imagens impactantes e profissionais.',
    thumbnail: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=225&fit=crop',
    duration: 900, // 15 horas
    totalLessons: 36,
    completedLessons: 8,
    category: 'Fotografia',
    level: 'Intermediário',
    instructor: 'Roberto Foto',
    rating: 4.8,
    isFavorite: true,
    tags: ['Fotografia', 'Lightroom', 'Composição', 'Iluminação'],
    createdAt: '2024-01-12',
    updatedAt: '2024-01-28'
  }
];

export const mockLessons: Lesson[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Introdução ao React 19',
    description: 'Visão geral das novidades do React 19 e configuração do ambiente.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 1200, // 20 minutos
    order: 1,
    isCompleted: true,
    watchedTime: 1200,
    resources: [
      {
        id: '1',
        title: 'Slides da Aula',
        type: 'pdf',
        url: '/resources/react-intro.pdf',
        size: '2.5 MB'
      }
    ]
  },
  {
    id: '2',
    courseId: '1',
    title: 'Hooks Avançados',
    description: 'useCallback, useMemo, useRef e hooks customizados.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 1800, // 30 minutos
    order: 2,
    isCompleted: true,
    watchedTime: 900, // 15 minutos assistidos
    resources: [
      {
        id: '2',
        title: 'Código da Aula',
        type: 'link',
        url: 'https://github.com/exemplo/hooks-avancados'
      }
    ]
  },
  {
    id: '3',
    courseId: '1',
    title: 'Context API e Zustand',
    description: 'Gerenciamento de estado global com Context API e Zustand.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 2100, // 35 minutos
    order: 3,
    isCompleted: false,
    watchedTime: 0
  }
];