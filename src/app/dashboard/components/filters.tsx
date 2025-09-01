'use client';

import { useState } from 'react';
import { Filter, Grid, List, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Category } from '../types';

interface FiltersProps {
  categories: Category[];
  selectedCategory: string;
  selectedLevel: string;
  selectedStatus: string;
  sortBy: string;
  viewMode: 'grid' | 'list';
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  onStatusChange: (status: string) => void;
  onSortChange: (sort: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalCourses: number;
  filteredCount: number;
}

export function Filters({
  categories,
  selectedCategory,
  selectedLevel,
  selectedStatus,
  sortBy,
  viewMode,
  onCategoryChange,
  onLevelChange,
  onStatusChange,
  onSortChange,
  onViewModeChange,
  totalCourses,
  filteredCount
}: FiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  const levels = ['Todos', 'Iniciante', 'Intermediário', 'Avançado'];
  const statuses = ['Todos', 'Não iniciado', 'Em andamento', 'Concluído'];
  const sortOptions = [
    { value: 'recent', label: 'Mais recentes' },
    { value: 'popular', label: 'Mais populares' },
    { value: 'rating', label: 'Melhor avaliados' },
    { value: 'progress', label: 'Meu progresso' },
    { value: 'alphabetical', label: 'A-Z' }
  ];

  const activeFiltersCount = [
    selectedCategory !== 'Todos',
    selectedLevel !== 'Todos',
    selectedStatus !== 'Todos'
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    onCategoryChange('Todos');
    onLevelChange('Todos');
    onStatusChange('Todos');
    onSortChange('recent');
  };

  return (
    <div className="space-y-6">
      {/* Categories Carousel */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant={selectedCategory === 'Todos' ? 'default' : 'outline'}
            onClick={() => onCategoryChange('Todos')}
            className="whitespace-nowrap"
          >
            Todos os cursos
            <Badge variant="secondary" className="ml-2">
              {totalCourses}
            </Badge>
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'outline'}
              onClick={() => onCategoryChange(category.name)}
              className="whitespace-nowrap"
            >
              {category.name}
              <Badge variant="secondary" className="ml-2">
                {category.courseCount}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Mobile Filter Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
                <SheetDescription>
                  Refine sua busca por cursos
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <h3 className="font-medium mb-3">Nível</h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <Button
                        key={level}
                        variant={selectedLevel === level ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => onLevelChange(level)}
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-medium mb-3">Status</h3>
                  <div className="space-y-2">
                    {statuses.map((status) => (
                      <Button
                        key={status}
                        variant={selectedStatus === status ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => onStatusChange(status)}
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={clearAllFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          {/* Desktop Filters */}
          <div className="hidden md:flex items-center gap-4">
            <Select value={selectedLevel} onValueChange={onLevelChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Nível" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={onStatusChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" onClick={clearAllFilters} className="text-muted-foreground">
                Limpar filtros ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Results Count */}
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {filteredCount} de {totalCourses} cursos
          </span>

          {/* Sort */}
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* View Mode */}
          <div className="flex border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}