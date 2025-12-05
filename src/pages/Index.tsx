import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Grade {
  id: number;
  grade_number: number;
  name: string;
  description: string;
}

interface Subject {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gradesRes = await fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=grades');
        const gradesData = await gradesRes.json();
        setGrades(gradesData.grades || []);

        const subjectsRes = await fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=subjects');
        const subjectsData = await subjectsRes.json();
        setSubjects(subjectsData.subjects || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Голосовой поиск не поддерживается вашим браузером');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'ru-RU';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedGrade) params.append('grade', selectedGrade.toString());
    if (selectedSubject) params.append('subject', selectedSubject.toString());
    if (selectedDifficulty) params.append('difficulty', selectedDifficulty);
    if (searchQuery) params.append('q', searchQuery);
    
    navigate(`/task/search?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ГДЗ Платформа
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Решения задач для 1-4 классов с видеоуроками и калькулятором
          </p>
          
          <div className="max-w-2xl mx-auto relative animate-slide-up">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  type="text"
                  placeholder="Найти задачу по номеру, странице или теме..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 focus:border-primary transition-all shadow-lg"
                />
              </div>
              <Button
                size="lg"
                onClick={handleVoiceSearch}
                className={`px-6 py-6 rounded-2xl ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                title="Голосовой поиск"
              >
                <Icon name={isListening ? 'MicOff' : 'Mic'} size={20} />
              </Button>
              <Button
                size="lg"
                onClick={handleSearch}
                className="px-6 py-6 rounded-2xl"
              >
                <Icon name="Search" size={20} />
              </Button>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Выберите класс</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/auth')}
              >
                <Icon name="User" size={16} className="mr-1" />
                Войти
              </Button>
            </div>
          </div>
          
          <div className="mb-8 flex gap-3 flex-wrap">
            {grades.map((grade) => (
              <Badge
                key={grade.id}
                variant={selectedGrade === grade.id ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-accent py-3 px-6 text-base transition-all"
                onClick={() => setSelectedGrade(selectedGrade === grade.id ? null : grade.id)}
              >
                {grade.name}
              </Badge>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-4">Выберите предмет</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {subjects.map((subject, index) => (
              <Card
                key={subject.id}
                className={`group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 overflow-hidden ${
                  selectedSubject === subject.id ? 'border-primary ring-2 ring-primary' : 'hover:border-primary'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedSubject(selectedSubject === subject.id ? null : subject.id)}
              >
                <CardHeader className="relative pb-0">
                  <div className={`bg-${subject.color}-500 rounded-2xl p-6 mb-4 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon name={subject.icon as any} size={48} className="text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl text-center">{subject.name}</CardTitle>
                </CardContent>
              </Card>
            ))}
          </div>

          <h3 className="text-2xl font-bold mb-4">Уровень сложности</h3>
          <div className="mb-6 flex gap-3 flex-wrap">
            <Badge
              variant={selectedDifficulty === 'easy' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent py-3 px-6 text-base"
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'easy' ? null : 'easy')}
            >
              Лёгкие
            </Badge>
            <Badge
              variant={selectedDifficulty === 'medium' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent py-3 px-6 text-base"
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'medium' ? null : 'medium')}
            >
              Средние
            </Badge>
            <Badge
              variant={selectedDifficulty === 'hard' ? 'default' : 'outline'}
              className="cursor-pointer hover:bg-accent py-3 px-6 text-base"
              onClick={() => setSelectedDifficulty(selectedDifficulty === 'hard' ? null : 'hard')}
            >
              Сложные
            </Badge>
          </div>

          {(selectedGrade || selectedSubject || selectedDifficulty || searchQuery) && (
            <div className="flex gap-2 items-center">
              <Button onClick={handleSearch} size="lg" className="text-lg">
                <Icon name="Search" size={20} className="mr-2" />
                Найти задачи
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setSelectedGrade(null);
                  setSelectedSubject(null);
                  setSelectedDifficulty(null);
                  setSearchQuery('');
                }}
              >
                <Icon name="X" size={16} className="mr-1" />
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" onClick={() => navigate('/calculator')}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-blue-500 rounded-2xl p-4">
                  <Icon name="Calculator" size={32} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Калькулятор</CardTitle>
                  <CardDescription>Решение примеров с объяснением</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" onClick={() => navigate('/videos')}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-purple-500 rounded-2xl p-4">
                  <Icon name="Video" size={32} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Видеоуроки</CardTitle>
                  <CardDescription>Обучающие видео по темам</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary" onClick={() => navigate('/exam')}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-green-500 rounded-2xl p-4">
                  <Icon name="GraduationCap" size={32} className="text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">ЕГЭ и ОГЭ</CardTitle>
                  <CardDescription>Подготовка к экзаменам</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-12 border-2 border-primary/20 mb-8">
          <Icon name="Sparkles" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Не нашли нужное решение?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Оставьте запрос, и мы добавим решение в течение 24 часов
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            <Icon name="Send" size={20} className="mr-2" />
            Отправить запрос
          </Button>
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={() => navigate('/reviews')}>
            <Icon name="MessageCircle" size={20} className="mr-2" />
            Читать отзывы
          </Button>
        </div>
      </div>
    </div>
  );
}