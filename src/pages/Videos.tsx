import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Video {
  id: number;
  grade_id: number;
  subject_id: number;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: number;
  views: number;
  grade_name?: string;
  subject_name?: string;
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

export default function Videos() {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<Video[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gradesRes, subjectsRes, videosRes] = await Promise.all([
          fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=grades'),
          fetch('https://functions.poehali.dev/1c946bd1-e639-4d28-a547-ab3c32f5f380/?resource=subjects'),
          fetch('https://functions.poehali.dev/4e25411b-96b5-4dbb-b00f-b7c5a9d7763c/')
        ]);

        const gradesData = await gradesRes.json();
        const subjectsData = await subjectsRes.json();
        const videosData = await videosRes.json();

        setGrades(gradesData.grades || []);
        setSubjects(subjectsData.subjects || []);
        setVideos(videosData.videos || []);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredVideos = videos.filter((video) => {
    if (selectedGrade && video.grade_id !== selectedGrade) return false;
    if (selectedSubject && video.subject_id !== selectedSubject) return false;
    return true;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <Icon name="Loader2" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="Video" size={40} className="text-primary" />
            Видеоуроки
          </h1>
          <p className="text-lg text-muted-foreground">
            Обучающие видео по всем предметам
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Класс:</h3>
          <div className="flex gap-2 flex-wrap mb-6">
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

        {filteredVideos.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Icon name="Video" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
              <p className="text-muted-foreground">Видео по выбранным фильтрам не найдены</p>
              <Button className="mt-4" onClick={() => { setSelectedGrade(null); setSelectedSubject(null); }}>
                Сбросить фильтры
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <Card key={video.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                <CardHeader className="p-0">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-primary to-purple-600 h-48 flex items-center justify-center rounded-t-lg">
                      <Icon name="Play" size={48} className="text-white" />
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70">
                      {formatDuration(video.duration)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{video.grade_name}</Badge>
                    <Badge variant="outline">{video.subject_name}</Badge>
                  </div>
                  <CardTitle className="text-lg mb-2">{video.title}</CardTitle>
                  <CardDescription className="text-sm mb-4">{video.description}</CardDescription>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={14} />
                      <span>{video.views} просмотров</span>
                    </div>
                    <Button size="sm">
                      <Icon name="Play" size={14} className="mr-1" />
                      Смотреть
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} />
              Другие материалы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/')}>
                <Icon name="Search" size={24} className="mb-2" />
                <span>Решебник задач</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/calculator')}>
                <Icon name="Calculator" size={24} className="mb-2" />
                <span>Калькулятор</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/profile')}>
                <Icon name="User" size={24} className="mb-2" />
                <span>Личный кабинет</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
