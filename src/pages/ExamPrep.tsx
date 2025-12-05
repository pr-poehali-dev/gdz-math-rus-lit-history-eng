import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface ExamMaterial {
  id: number;
  exam_type: string;
  subject_id: number;
  title: string;
  description: string;
  content: string;
  difficulty: string;
  subject_name?: string;
  subject_icon?: string;
}

export default function ExamPrep() {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<ExamMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ege');

  useEffect(() => {
    fetchMaterials(activeTab);
  }, [activeTab]);

  const fetchMaterials = async (type: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://functions.poehali.dev/e2c4f10f-f443-47fa-92ab-b0565d2fa160/?type=${type}`);
      const data = await res.json();
      setMaterials(data.materials || []);
    } catch (error) {
      console.error('Error loading materials:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Лёгкий';
      case 'medium': return 'Средний';
      case 'hard': return 'Сложный';
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="GraduationCap" size={40} className="text-primary" />
            Подготовка к экзаменам
          </h1>
          <p className="text-lg text-muted-foreground">
            Материалы для подготовки к ЕГЭ и ОГЭ
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="ege" className="text-lg">
              <Icon name="Award" size={20} className="mr-2" />
              ЕГЭ
            </TabsTrigger>
            <TabsTrigger value="oge" className="text-lg">
              <Icon name="BookOpen" size={20} className="mr-2" />
              ОГЭ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ege" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin text-primary" />
              </div>
            ) : materials.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="FileText" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Материалы для ЕГЭ скоро появятся</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(material.difficulty)}>
                          {getDifficultyLabel(material.difficulty)}
                        </Badge>
                        <Badge variant="outline">
                          <Icon name={material.subject_icon as any} size={14} className="mr-1" />
                          {material.subject_name}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{material.title}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Icon name="BookOpen" size={16} className="mr-2" />
                        Открыть материал
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="oge" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Icon name="Loader2" size={48} className="animate-spin text-primary" />
              </div>
            ) : materials.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Icon name="FileText" size={64} className="mx-auto mb-4 text-muted-foreground opacity-20" />
                  <p className="text-muted-foreground">Материалы для ОГЭ скоро появятся</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material) => (
                  <Card key={material.id} className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getDifficultyColor(material.difficulty)}>
                          {getDifficultyLabel(material.difficulty)}
                        </Badge>
                        <Badge variant="outline">
                          <Icon name={material.subject_icon as any} size={14} className="mr-1" />
                          {material.subject_name}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{material.title}</CardTitle>
                      <CardDescription>{material.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full">
                        <Icon name="BookOpen" size={16} className="mr-2" />
                        Открыть материал
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Target" size={24} className="text-blue-600" />
                Структура экзамена
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Подробная информация о структуре ЕГЭ и ОГЭ по всем предметам
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Clock" size={24} className="text-purple-600" />
                Тайминг экзамена
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Рекомендации по распределению времени на экзамене
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="CheckCircle" size={24} className="text-green-600" />
                Критерии оценки
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Система оценивания и критерии проверки работ
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Lightbulb" size={24} />
              Дополнительные материалы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/')}>
                <Icon name="Search" size={24} className="mb-2" />
                <span>Решебник задач</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/videos')}>
                <Icon name="Video" size={24} className="mb-2" />
                <span>Видеоуроки</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col" onClick={() => navigate('/calculator')}>
                <Icon name="Calculator" size={24} className="mb-2" />
                <span>Калькулятор</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
