import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface Puzzle {
  id: number;
  grade_id: number;
  subject_id: number;
  puzzle_type: string;
  puzzle_image_url?: string;
  puzzle_text: string;
  answer: string;
  hint: string;
  difficulty: string;
  grade_name?: string;
}

export default function Puzzles() {
  const navigate = useNavigate();
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [revealed, setRevealed] = useState<{ [key: number]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPuzzles();
  }, []);

  const fetchPuzzles = async () => {
    try {
      const res = await fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=puzzles');
      const data = await res.json();
      setPuzzles(data.puzzles || []);
    } catch (error) {
      console.error('Error loading puzzles:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAnswer = (puzzleId: number, correctAnswer: string) => {
    const userAnswer = userAnswers[puzzleId]?.toLowerCase().trim();
    const correct = correctAnswer.toLowerCase().trim();
    
    if (userAnswer === correct) {
      alert('🎉 Правильно! Молодец!');
      setRevealed({ ...revealed, [puzzleId]: true });
    } else {
      alert('❌ Неправильно. Попробуй ещё раз или возьми подсказку!');
    }
  };

  const filteredPuzzles = puzzles.filter((puzzle) => {
    const matchesGrade = !selectedGrade || puzzle.grade_id === selectedGrade;
    const matchesDifficulty = !selectedDifficulty || puzzle.difficulty === selectedDifficulty;
    return matchesGrade && matchesDifficulty;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="Puzzle" size={40} className="text-primary" />
            Ребусы
          </h1>
          <p className="text-lg text-muted-foreground">
            Разгадывайте ребусы и тренируйте логику
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Фильтры</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Класс:</label>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={selectedGrade === null ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedGrade(null)}
                >
                  Все классы
                </Badge>
                {[1, 2, 3, 4].map((grade) => (
                  <Badge
                    key={grade}
                    variant={selectedGrade === grade ? 'default' : 'outline'}
                    className="cursor-pointer hover:bg-accent py-2 px-4"
                    onClick={() => setSelectedGrade(grade)}
                  >
                    {grade} класс
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Сложность:</label>
              <div className="flex gap-2 flex-wrap">
                <Badge
                  variant={selectedDifficulty === null ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedDifficulty(null)}
                >
                  Все
                </Badge>
                <Badge
                  variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedDifficulty('easy')}
                >
                  Лёгкие
                </Badge>
                <Badge
                  variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedDifficulty('medium')}
                >
                  Средние
                </Badge>
                <Badge
                  variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-accent py-2 px-4"
                  onClick={() => setSelectedDifficulty('hard')}
                >
                  Сложные
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPuzzles.map((puzzle) => (
            <Card key={puzzle.id} className="border-2 hover:shadow-lg transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary">{puzzle.grade_name || `${puzzle.grade_id} класс`}</Badge>
                  <Badge 
                    variant={
                      puzzle.difficulty === 'easy' ? 'default' : 
                      puzzle.difficulty === 'medium' ? 'secondary' : 
                      'destructive'
                    }
                  >
                    {puzzle.difficulty === 'easy' ? 'Лёгкий' : 
                     puzzle.difficulty === 'medium' ? 'Средний' : 
                     'Сложный'}
                  </Badge>
                </div>
                <CardTitle className="text-lg">Ребус #{puzzle.id}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 text-center min-h-32 flex items-center justify-center">
                  <div className="text-2xl font-bold text-primary">
                    {puzzle.puzzle_text}
                  </div>
                </div>

                {!revealed[puzzle.id] ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Твой ответ:</label>
                      <Input
                        type="text"
                        placeholder="Введи ответ..."
                        value={userAnswers[puzzle.id] || ''}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [puzzle.id]: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            checkAnswer(puzzle.id, puzzle.answer);
                          }
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        onClick={() => checkAnswer(puzzle.id, puzzle.answer)}
                      >
                        <Icon name="Check" size={16} className="mr-2" />
                        Проверить
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => alert(`💡 Подсказка: ${puzzle.hint}`)}
                      >
                        <Icon name="Lightbulb" size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold">
                      <Icon name="Check" size={20} className="text-green-600" />
                      Правильно!
                    </div>
                    <div className="text-lg font-bold text-green-800">Ответ: {puzzle.answer}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPuzzles.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="Puzzle" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Ребусы по выбранным фильтрам не найдены</p>
              <Button 
                className="mt-4" 
                onClick={() => { setSelectedGrade(null); setSelectedDifficulty(null); }}
              >
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
