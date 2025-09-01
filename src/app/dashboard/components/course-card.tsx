'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, CheckCircle, Star, User, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onToggleFavorite: (courseId: string) => void;
}

export function CourseCard({ course, onToggleFavorite }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const progressPercentage = (course.completedLessons / course.totalLessons) * 100;
  const isCompleted = course.completedLessons === course.totalLessons;
  const isStarted = course.completedLessons > 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediário':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Avançado':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card 
      className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className={`object-cover transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link href={`/course/${course.id}`}>
              <Button size="lg" className="rounded-full">
                <Play className="h-5 w-5 mr-2" />
                {isStarted ? 'Continuar' : 'Começar'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isCompleted ? (
            <Badge className="bg-green-600 hover:bg-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Concluído
            </Badge>
          ) : isStarted ? (
            <Badge className="bg-blue-600 hover:bg-blue-600">
              Em andamento
            </Badge>
          ) : null}
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full bg-black/20 hover:bg-black/40 text-white"
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(course.id);
            }}
          >
            <Star className={`h-4 w-4 ${course.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
        </div>

        {/* Duration */}
        <div className="absolute bottom-3 right-3">
          <Badge variant="secondary" className="bg-black/60 text-white border-0">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(course.duration)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title and Menu */}
          <div className="flex items-start justify-between">
            <Link href={`/course/${course.id}`} className="flex-1">
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 hover:text-primary transition-colors">
                {course.title}
              </h3>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-2">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onToggleFavorite(course.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  {course.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Ver instrutor
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.description}
          </p>

          {/* Instructor and Rating */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <User className="h-4 w-4 mr-1" />
              {course.instructor}
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{course.rating}</span>
            </div>
          </div>

          {/* Level and Lessons */}
          <div className="flex items-center justify-between">
            <Badge className={getLevelColor(course.level)}>
              {course.level}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {course.totalLessons} aulas
            </span>
          </div>

          {/* Progress */}
          {isStarted && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {course.completedLessons} de {course.totalLessons} aulas concluídas
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}