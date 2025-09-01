'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Course } from '../types';

interface HeroSectionProps {
  featuredCourses: Course[];
}

export function HeroSection({ featuredCourses }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || featuredCourses.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredCourses.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredCourses.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredCourses.length) % featuredCourses.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (featuredCourses.length === 0) return null;

  const currentCourse = featuredCourses[currentSlide];
  const progressPercentage = (currentCourse.completedLessons / currentCourse.totalLessons) * 100;
  const isStarted = currentCourse.completedLessons > 0;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <section className="relative h-[70vh] min-h-[500px] overflow-hidden rounded-lg">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentCourse.thumbnail}
          alt={currentCourse.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container px-4">
          <div className="max-w-2xl space-y-6">
            {/* Category Badge */}
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground">
              {currentCourse.category}
            </Badge>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              {currentCourse.title}
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-200 leading-relaxed">
              {currentCourse.description}
            </p>

            {/* Course Info */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{currentCourse.rating}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-1" />
                <span>{formatDuration(currentCourse.duration)}</span>
              </div>
              <div>
                <span>{currentCourse.totalLessons} aulas</span>
              </div>
              <Badge variant="outline" className="border-white/30 text-white">
                {currentCourse.level}
              </Badge>
            </div>

            {/* Progress (if started) */}
            {isStarted && (
              <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex justify-between text-white mb-2">
                  <span>Seu progresso</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <p className="text-white/80 text-sm mt-2">
                  {currentCourse.completedLessons} de {currentCourse.totalLessons} aulas concluídas
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href={`/course/${currentCourse.id}`}>
                <Button size="lg" className="bg-white text-black hover:bg-white/90">
                  <Play className="h-5 w-5 mr-2" />
                  {isStarted ? 'Continuar Assistindo' : 'Começar Agora'}
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
              >
                Mais Informações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {featuredCourses.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="lg"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12 p-0"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </>
      )}

      {/* Slide Indicators */}
      {featuredCourses.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredCourses.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-110' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}