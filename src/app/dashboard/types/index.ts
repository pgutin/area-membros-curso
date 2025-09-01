export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number; // em minutos
  totalLessons: number;
  completedLessons: number;
  category: string;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  instructor: string;
  rating: number;
  isFavorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // em segundos
  order: number;
  isCompleted: boolean;
  watchedTime: number; // em segundos
  resources?: Resource[];
  transcript?: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
  size?: string;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  lessonId: string;
  watchedTime: number;
  isCompleted: boolean;
  lastWatched: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  courseCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subscription: 'free' | 'premium' | 'pro';
  joinedAt: string;
}