'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Star, User, Clock, CheckCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from './components/video-player';
import { LessonList } from './components/lesson-list';
import { mockCourses, mockLessons } from '@/app/dashboard/data/mock';
import { Course, Lesson } from '@/app/dashboard/types';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const foundCourse = mockCourses.find(c => c.id === courseId);
    const courseLessons = mockLessons.filter(l => l.courseId === courseId);

    if (foundCourse) {
      setCourse(foundCourse);
      setLessons(courseLessons);
      
      // Set first lesson as current if no lesson is completed
      const firstIncompleteLesson = courseLessons.find(l => !l.isCompleted);
      setCurrentLesson(firstIncompleteLesson || courseLessons[0] || null);
    }
    
    setIsLoading(false);
  }, [courseId]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    if (!currentLesson) return;

    // Update watched time
    setLessons(prev => prev.map(lesson => 
      lesson.id === currentLesson.id 
        ? { ...lesson, watchedTime: currentTime }
        : lesson
    ));

    // Mark as completed if watched 90% or more
    if (currentTime / duration >= 0.9 && !currentLesson.isCompleted) {
      setLessons(prev => prev.map(lesson => 
        lesson.id === currentLesson.id 
          ? { ...lesson, isCompleted: true, watchedTime: duration }
          : lesson
      ));

      // Update course progress
      if (course) {
        const updatedCompletedLessons = lessons.filter(l => 
          l.isCompleted || l.id === currentLesson.id
        ).length;
        
        setCourse(prev => prev ? {
          ...prev,
          completedLessons: updatedCompletedLessons
        } : null);
      }
    }
  };

  const handleVideoComplete = () => {
    if (!currentLesson) return;

    // Mark current lesson as completed
    setLessons(prev => prev.map(lesson => 
      lesson.id === currentLesson.id 
        ? { ...lesson, isCompleted: true, watchedTime: lesson.duration }
        : lesson
    ));

    // Auto-play next lesson
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    const nextLesson = lessons[currentIndex + 1];
    
    if (nextLesson) {
      setTimeout(() => {
        setCurrentLesson(nextLesson);
      }, 2000);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Curso não encontrado</h1>
          <Link href="/dashboard">
            <Button>Voltar ao Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const progressPercentage = lessons.length > 0 ? (completedLessons / lessons.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold truncate max-w-md">{course.title}</h1>
              <p className="text-sm text-muted-foreground">
                {completedLessons} de {lessons.length} aulas • {Math.round(progressPercentage)}% concluído
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              {course.level}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            {currentLesson ? (
              <>
                <VideoPlayer
                  videoUrl={currentLesson.videoUrl}
                  title={currentLesson.title}
                  onProgress={handleVideoProgress}
                  onComplete={handleVideoComplete}
                  initialTime={currentLesson.watchedTime}
                />

                {/* Lesson Info */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                        <p className="text-muted-foreground">{currentLesson.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {currentLesson.isCompleted && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Concluída
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <Tabs defaultValue="overview" className="w-full">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                        <TabsTrigger value="resources">Recursos</TabsTrigger>
                        <TabsTrigger value="transcript">Transcrição</TabsTrigger>
                      </TabsList>

                      <TabsContent value="overview" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <Clock className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Duração</p>
                            <p className="text-xs text-muted-foreground">
                              {Math.floor(currentLesson.duration / 60)}:{(currentLesson.duration % 60).toString().padStart(2, '0')}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <Circle className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Ordem</p>
                            <p className="text-xs text-muted-foreground">
                              Aula {currentLesson.order}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <User className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Instrutor</p>
                            <p className="text-xs text-muted-foreground">
                              {course.instructor}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-muted rounded-lg">
                            <Star className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                            <p className="text-sm font-medium">Avaliação</p>
                            <p className="text-xs text-muted-foreground">
                              {course.rating}/5
                            </p>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="resources" className="space-y-4">
                        {currentLesson.resources && currentLesson.resources.length > 0 ? (
                          <div className="space-y-3">
                            {currentLesson.resources.map((resource) => (
                              <div key={resource.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <h4 className="font-medium">{resource.title}</h4>
                                  <p className="text-sm text-muted-foreground capitalize">
                                    {resource.type} {resource.size && `• ${resource.size}`}
                                  </p>
                                </div>
                                <Button size="sm" asChild>
                                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                    Abrir
                                  </a>
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Nenhum recurso disponível para esta aula.
                          </p>
                        )}
                      </TabsContent>

                      <TabsContent value="transcript" className="space-y-4">
                        {currentLesson.transcript ? (
                          <div className="prose prose-sm max-w-none">
                            <p>{currentLesson.transcript}</p>
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-center py-8">
                            Transcrição não disponível para esta aula.
                          </p>
                        )}
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="aspect-video flex items-center justify-center">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Nenhuma aula selecionada</h3>
                  <p className="text-muted-foreground">
                    Selecione uma aula na lista ao lado para começar.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Lesson List */}
          <div className="space-y-6">
            <LessonList
              lessons={lessons}
              currentLessonId={currentLesson?.id || ''}
              onLessonSelect={handleLessonSelect}
              courseTitle={course.title}
            />

            {/* Course Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Instrutor</p>
                    <p className="font-medium">{course.instructor}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Duração</p>
                    <p className="font-medium">{formatDuration(course.duration)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nível</p>
                    <p className="font-medium">{course.level}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Avaliação</p>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-muted-foreground text-sm mb-2">Descrição</p>
                  <p className="text-sm">{course.description}</p>
                </div>

                <div>
                  <p className="text-muted-foreground text-sm mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}