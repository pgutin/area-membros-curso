'use client';

import { useState } from 'react';
import { Play, CheckCircle, Clock, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Lesson } from '@/app/dashboard/types';

interface LessonListProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lesson: Lesson) => void;
  courseTitle: string;
}

export function LessonList({ 
  lessons, 
  currentLessonId, 
  onLessonSelect, 
  courseTitle 
}: LessonListProps) {
  const [isOpen, setIsOpen] = useState(true);

  const completedLessons = lessons.filter(lesson => lesson.isCompleted).length;
  const totalLessons = lessons.length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0);

  return (
    <Card className="h-fit">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <CardTitle className="text-lg line-clamp-2">{courseTitle}</CardTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{totalLessons} aulas</span>
                  <span>{formatDuration(totalDuration)}</span>
                </div>
              </div>
              {isOpen ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{Math.round(progressPercentage)}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {completedLessons} de {totalLessons} aulas concluídas
              </p>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="space-y-2">
              {lessons.map((lesson, index) => {
                const isCurrentLesson = lesson.id === currentLessonId;
                const watchedPercentage = lesson.duration > 0 ? (lesson.watchedTime / lesson.duration) * 100 : 0;

                return (
                  <div
                    key={lesson.id}
                    className={`group relative rounded-lg border p-3 cursor-pointer transition-all hover:bg-muted/50 ${
                      isCurrentLesson 
                        ? 'bg-primary/10 border-primary' 
                        : 'border-border'
                    }`}
                    onClick={() => onLessonSelect(lesson)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Lesson Number/Status */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium">
                        {lesson.isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-600 fill-current" />
                        ) : isCurrentLesson ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-muted-foreground">{index + 1}</span>
                        )}
                      </div>

                      {/* Lesson Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-medium line-clamp-2 ${
                            isCurrentLesson ? 'text-primary' : ''
                          }`}>
                            {lesson.title}
                          </h4>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDuration(lesson.duration)}
                            </Badge>
                          </div>
                        </div>

                        {lesson.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        )}

                        {/* Progress for partially watched lessons */}
                        {lesson.watchedTime > 0 && !lesson.isCompleted && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Assistido</span>
                              <span>{Math.round(watchedPercentage)}%</span>
                            </div>
                            <Progress value={watchedPercentage} className="h-1" />
                          </div>
                        )}

                        {/* Resources indicator */}
                        {lesson.resources && lesson.resources.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Circle className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {lesson.resources.length} recurso{lesson.resources.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Play button overlay on hover */}
                    {!isCurrentLesson && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="rounded-full">
                          <Play className="h-4 w-4 mr-1" />
                          Assistir
                        </Button>
                      </div>
                    )}

                    {/* Current lesson indicator */}
                    {isCurrentLesson && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}