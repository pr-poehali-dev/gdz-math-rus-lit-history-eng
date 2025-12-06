import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Textbook {
  id: number;
  grade_id: number;
  subject_id: number;
  title: string;
  author: string;
  publisher: string;
  year: number;
  pdf_url?: string;
  grade_name?: string;
  subject_name?: string;
  subject_icon?: string;
}

interface Grade {
  id: number;
  grade_number: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  icon: string;
}

export default function Library() {
  const navigate = useNavigate();
  const [textbooks, setTextbooks] = useState<Textbook[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, subjectsRes, textbooksRes] = await Promise.all([
          fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=grades'),
          fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=subjects'),
          fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=textbooks')
        ]);

        const gradesData = await gradesRes.json();
        const subjectsData = await subjectsRes.json();
        const textbooksData = await textbooksRes.json();

        setGrades(gradesData.grades || []);
        setSubjects(subjectsData.subjects || []);
        setTextbooks(textbooksData.textbooks || []);
        setAvailableYears(textbooksData.available_years || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGrade || selectedSubject || selectedYear) {
      fetchFilteredTextbooks();
    }
  }, [selectedGrade, selectedSubject, selectedYear]);

  const fetchFilteredTextbooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedGrade) params.append('grade_id', selectedGrade.toString());
      if (selectedSubject) params.append('subject_id', selectedSubject.toString());
      if (selectedYear) params.append('year', selectedYear.toString());
      
      const res = await fetch(`https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=textbooks&${params.toString()}`);
      const data = await res.json();
      setTextbooks(data.textbooks || []);
    } catch (error) {
      console.error('Error loading textbooks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && textbooks.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="Library" size={40} className="text-primary" />
            Библиотека учебников
          </h1>
          <p className="text-lg text-muted-foreground">
            Учебники с 2015 по 2025 год
          </p>
        </div>

        <div className="mb-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold mb-3">Класс:</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedGrade === null ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent py-2 px-4"
                onClick={() => setSelectedGrade(null)}
              >
                Все классы
              </Badge>
              {grades.map((grade) => (
                <Badge
                  key={grade.id}
                  variant={selectedGrade === grade.id ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedGrade(grade.id)}
                >
                  {grade.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Предмет:</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedSubject === null ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent py-2 px-4"
                onClick={() => setSelectedSubject(null)}
              >
                Все предметы
              </Badge>
              {subjects.map((subject) => (
                <Badge
                  key={subject.id}
                  variant={selectedSubject === subject.id ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedSubject(subject.id)}
                >
                  <Icon name={subject.icon as any} size={14} className="mr-1" />
                  {subject.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Год издания:</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedYear === null ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent py-2 px-4"
                onClick={() => setSelectedYear(null)}
              >
                Все годы
              </Badge>
              {availableYears.map((year) => (
                <Badge
                  key={year}
                  variant={selectedYear === year ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedYear(year)}
                >
                  {year}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {textbooks.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Учебники по выбранным фильтрам не найдены</p>
              <Button className="mt-4" onClick={() => { setSelectedGrade(null); setSelectedSubject(null); setSelectedYear(null); }}>
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {textbooks.map((textbook) => (
              <Card key={textbook.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex gap-2 mb-2">
                        <Badge variant="secondary">{textbook.grade_name}</Badge>
                        <Badge variant="outline">
                          <Icon name={textbook.subject_icon as any} size={14} className="mr-1" />
                          {textbook.subject_name}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{textbook.title}</CardTitle>
                    </div>
                    <Badge className="bg-amber-500">{textbook.year}</Badge>
                  </div>
                  <CardDescription>
                    <div className="space-y-1 text-sm">
                      <div><strong>Автор:</strong> {textbook.author}</div>
                      <div><strong>Издательство:</strong> {textbook.publisher}</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/library/${textbook.id}`);
                      }}
                    >
                      <Icon name="BookOpen" size={14} className="mr-1" />
                      Решения
                    </Button>
                    {textbook.pdf_url && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(textbook.pdf_url, '_blank');
                        }}
                        title="Скачать PDF"
                      >
                        <Icon name="Download" size={14} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-amber/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} />
              Другие материалы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/')}>
                <Icon name="Search" size={24} className="mb-2" />
                <span>Решебник</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/videos')}>
                <Icon name="Video" size={24} className="mb-2" />
                <span>Видеоуроки</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/calculator')}>
                <Icon name="Calculator" size={24} className="mb-2" />
                <span>Калькулятор</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/exam')}>
                <Icon name="GraduationCap" size={24} className="mb-2" />
                <span>ЕГЭ/ОГЭ</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}