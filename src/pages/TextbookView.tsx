import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

interface TextbookSolution {
  id: number;
  textbook_id: number;
  grade_id: number;
  subject_id: number;
  page_number: number;
  task_number: string;
  task_text: string;
  solution_text: string;
  difficulty: string;
}

export default function TextbookView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [textbook, setTextbook] = useState<Textbook | null>(null);
  const [solutions, setSolutions] = useState<TextbookSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  const [searchPage, setSearchPage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [textbookRes, solutionsRes] = await Promise.all([
          fetch(`https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=textbooks`),
          fetch(`https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=textbook_solutions&textbook_id=${id}`)
        ]);

        const textbookData = await textbookRes.json();
        const solutionsData = await solutionsRes.json();

        const foundTextbook = textbookData.textbooks?.find((t: Textbook) => t.id === Number(id));
        setTextbook(foundTextbook || null);
        setSolutions(solutionsData.solutions || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!textbook) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="text-center py-12">
            <Icon name="BookX" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
            <h2 className="text-2xl font-bold mb-2">Учебник не найден</h2>
            <Button onClick={() => navigate('/library')} className="mt-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Вернуться в библиотеку
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredSolutions = solutions.filter((sol) => {
    const matchesDifficulty = !filterDifficulty || sol.difficulty === filterDifficulty;
    const matchesPage = !searchPage || sol.page_number.toString() === searchPage;
    return matchesDifficulty && matchesPage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/library')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          В библиотеку
        </Button>

        <Card className="mb-6 border-2">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex gap-2 mb-3">
                  <Badge variant="secondary">{textbook.grade_name}</Badge>
                  <Badge variant="outline">
                    <Icon name={textbook.subject_icon as any} size={14} className="mr-1" />
                    {textbook.subject_name}
                  </Badge>
                  <Badge className="bg-amber-500">{textbook.year}</Badge>
                </div>
                <CardTitle className="text-2xl mb-2">{textbook.title}</CardTitle>
                <CardDescription className="text-base">
                  <div><strong>Автор:</strong> {textbook.author}</div>
                  <div><strong>Издательство:</strong> {textbook.publisher}</div>
                </CardDescription>
              </div>
              {textbook.pdf_url && (
                <Button onClick={() => window.open(textbook.pdf_url, '_blank')}>
                  <Icon name="Download" size={16} className="mr-2" />
                  Скачать PDF
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="solutions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="solutions">
              <Icon name="BookOpen" size={16} className="mr-2" />
              Решения ({solutions.length})
            </TabsTrigger>
            <TabsTrigger value="info">
              <Icon name="Info" size={16} className="mr-2" />
              О учебнике
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solutions">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Фильтры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Сложность:</label>
                  <div className="flex gap-2 flex-wrap">
                    <Badge
                      variant={filterDifficulty === null ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent py-2 px-4"
                      onClick={() => setFilterDifficulty(null)}
                    >
                      Все
                    </Badge>
                    <Badge
                      variant={filterDifficulty === 'easy' ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent py-2 px-4"
                      onClick={() => setFilterDifficulty('easy')}
                    >
                      Лёгкие
                    </Badge>
                    <Badge
                      variant={filterDifficulty === 'medium' ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent py-2 px-4"
                      onClick={() => setFilterDifficulty('medium')}
                    >
                      Средние
                    </Badge>
                    <Badge
                      variant={filterDifficulty === 'hard' ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-accent py-2 px-4"
                      onClick={() => setFilterDifficulty('hard')}
                    >
                      Сложные
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Поиск по странице:</label>
                  <input
                    type="number"
                    placeholder="Введите номер страницы"
                    value={searchPage}
                    onChange={(e) => setSearchPage(e.target.value)}
                    className="w-full md:w-64 px-4 py-2 border rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            {filteredSolutions.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSolutions.map((solution) => (
                  <Card key={solution.id} className="hover:shadow-lg transition-all border-2 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="secondary">Стр. {solution.page_number}</Badge>
                        <Badge 
                          variant={
                            solution.difficulty === 'easy' ? 'default' : 
                            solution.difficulty === 'medium' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {solution.difficulty === 'easy' ? 'Лёгкий' : 
                           solution.difficulty === 'medium' ? 'Средний' : 
                           'Сложный'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{solution.task_number}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="font-semibold text-sm mb-1">Задание:</div>
                          <div className="text-sm text-muted-foreground">{solution.task_text}</div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm mb-1">Решение:</div>
                          <div className="text-sm">{solution.solution_text}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Решения не найдены</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => { setFilterDifficulty(null); setSearchPage(''); }}
                  >
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="info">
            <Card>
              <CardHeader>
                <CardTitle>Информация об учебнике</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-semibold mb-1">Класс:</div>
                    <div className="text-muted-foreground">{textbook.grade_name}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Предмет:</div>
                    <div className="text-muted-foreground">{textbook.subject_name}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Автор:</div>
                    <div className="text-muted-foreground">{textbook.author}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Издательство:</div>
                    <div className="text-muted-foreground">{textbook.publisher}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Год издания:</div>
                    <div className="text-muted-foreground">{textbook.year}</div>
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Решений в базе:</div>
                    <div className="text-muted-foreground">{solutions.length}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
