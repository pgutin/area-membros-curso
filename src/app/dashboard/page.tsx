'use client';

import { useState, useMemo } from 'react';
import { Header } from './components/header';
import { HeroSection } from './components/hero-section';
import { Filters } from './components/filters';
import { CourseCard } from './components/course-card';
import { mockCourses, mockCategories } from './data/mock';
import { Course } from './types';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState(mockCourses);

  // Featured courses for hero section (top 3 by rating)
  const featuredCourses = useMemo(() => {
    return [...courses]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== 'Todos' && course.category !== selectedCategory) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'Todos' && course.level !== selectedLevel) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'Todos') {
        const isCompleted = course.completedLessons === course.totalLessons;
        const isStarted = course.completedLessons > 0;
        
        if (selectedStatus === 'Concluído' && !isCompleted) return false;
        if (selectedStatus === 'Em andamento' && (!isStarted || isCompleted)) return false;
        if (selectedStatus === 'Não iniciado' && isStarted) return false;
      }

      return true;
    });

    // Sort courses
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.rating - a.rating;
        case 'rating':
          return b.rating - a.rating;
        case 'progress':
          const aProgress = (a.completedLessons / a.totalLessons) * 100;
          const bProgress = (b.completedLessons / b.totalLessons) * 100;
          return bProgress - aProgress;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }
    });

    return filtered;
  }, [courses, searchQuery, selectedCategory, selectedLevel, selectedStatus, sortBy]);

  const handleToggleFavorite = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isFavorite: !course.isFavorite }
        : course
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      
      <main className="container px-4 py-8 space-y-8">
        {/* Hero Section */}
        {!searchQuery && selectedCategory === 'Todos' && (
          <HeroSection featuredCourses={featuredCourses} />
        )}

        {/* Filters */}
        <Filters
          categories={mockCategories}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          selectedStatus={selectedStatus}
          sortBy={sortBy}
          viewMode={viewMode}
          onCategoryChange={setSelectedCategory}
          onLevelChange={setSelectedLevel}
          onStatusChange={setSelectedStatus}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
          totalCourses={courses.length}
          filteredCount={filteredCourses.length}
        />

        {/* Search Results Header */}
        {searchQuery && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              Resultados para "{searchQuery}"
            </h2>
            <p className="text-muted-foreground">
              {filteredCourses.length} curso{filteredCourses.length !== 1 ? 's' : ''} encontrado{filteredCourses.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Courses Grid/List */}
        {filteredCourses.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold">Nenhum curso encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outros termos.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}