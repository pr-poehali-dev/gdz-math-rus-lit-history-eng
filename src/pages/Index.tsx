import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { subjects } from '@/data/subjects';
import { popularTasks } from '@/data/tasks';

export default function Index() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

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

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            ГДЗ Платформа
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Быстрый поиск решений по всем школьным предметам
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
            </div>
            {searchQuery && (
              <div className="absolute w-full mt-2 bg-card rounded-2xl shadow-2xl border-2 border-border p-4 animate-scale-in z-10">
                <p className="text-sm text-muted-foreground mb-2">Результаты поиска:</p>
                <div className="space-y-2">
                  {filteredSubjects.length > 0 ? (
                    filteredSubjects.map((subject) => (
                      <Button
                        key={subject.id}
                        variant="ghost"
                        className="w-full justify-start text-left hover:bg-accent/20 transition-all"
                        onClick={() => {
                          setSelectedSubject(subject.name);
                          setSearchQuery('');
                        }}
                      >
                        <Icon name={subject.icon as any} size={18} className="mr-2" />
                        {subject.name} - {subject.tasks} задач
                      </Button>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground py-2">Ничего не найдено</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Все предметы</h2>
            <div className="flex gap-2">
              {selectedSubject && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSubject(null)}
                >
                  <Icon name="X" size={16} className="mr-1" />
                  Сбросить фильтр
                </Button>
              )}
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
          
          <div className="mb-6 flex gap-2 flex-wrap">
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">Лёгкие</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">Средние</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">Сложные</Badge>
            <div className="h-6 w-px bg-border mx-2" />
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">5 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">6 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">7 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">8 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">9 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">10 класс</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-accent py-2 px-4">11 класс</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects
              .filter((subject) => !selectedSubject || subject.name === selectedSubject)
              .map((subject, index) => (
                <Card
                  key={subject.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-slide-up border-2 hover:border-primary overflow-hidden"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => setSelectedSubject(subject.name)}
                >
                  <CardHeader className="relative pb-0">
                    <div className={`${subject.color} rounded-2xl p-6 mb-4 flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon name={subject.icon as any} size={48} className="text-white" />
                    </div>
                    {subject.trending && (
                      <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                        🔥 Популярно
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-2xl mb-2">{subject.name}</CardTitle>
                    <CardDescription className="text-base">
                      <div className="flex items-center gap-2">
                        <Icon name="FileText" size={16} />
                        <span>{subject.tasks} решений доступно</span>
                      </div>
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Icon name="TrendingUp" size={32} className="text-primary" />
            Популярные задачи
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularTasks.map((task, index) => (
              <Card
                key={task.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-primary border-2 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="secondary" className="mb-2">{task.subject}</Badge>
                      <h3 className="text-xl font-semibold">{task.task}</h3>
                      <p className="text-sm text-muted-foreground">{task.grade}</p>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Icon name="Eye" size={16} />
                      <span className="text-sm">{task.views}</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4" 
                    variant="default"
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    <Icon name="ArrowRight" size={16} className="mr-2" />
                    Посмотреть решение
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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
            Читать отзывы (1247)
          </Button>
        </div>
      </div>
    </div>
  );
}