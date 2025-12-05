import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface User {
  email: string;
  name: string;
  isPremium?: boolean;
  role?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/auth');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleSubscribe = () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const handleTeacherPanel = () => {
    if (user?.role === 'teacher') {
      navigate('/teacher');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
          <div className="flex gap-2">
            {user?.role === 'teacher' && (
              <Button variant="default" onClick={handleTeacherPanel}>
                <Icon name="GraduationCap" size={20} className="mr-2" />
                Панель учителя
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={20} className="mr-2" />
              Выйти
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.isPremium ? (
                <Badge className="w-full justify-center py-2 bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Icon name="Crown" size={16} className="mr-2" />
                  Premium подписка
                </Badge>
              ) : (
                <Button onClick={handleSubscribe} className="w-full">
                  <Icon name="Crown" size={20} className="mr-2" />
                  Оформить Premium за 99₽/мес
                </Button>
              )}
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Решено задач</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Избранное</span>
                  <span className="font-semibold">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Рейтинг</span>
                  <span className="font-semibold">-</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Мои задачи</CardTitle>
              <CardDescription>История решений и избранное</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="history">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="history">История</TabsTrigger>
                  <TabsTrigger value="favorites">Избранное</TabsTrigger>
                  <TabsTrigger value="assignments">Задания</TabsTrigger>
                </TabsList>

                <TabsContent value="history" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>История решений пуста</p>
                    <Button variant="link" onClick={() => navigate('/')}>
                      Перейти к задачам
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="favorites" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Heart" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Избранных задач пока нет</p>
                  </div>
                </TabsContent>

                <TabsContent value="assignments" className="space-y-4">
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="ClipboardList" size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Заданий от учителей пока нет</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {user.isPremium && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Premium возможности</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <Icon name="Infinity" className="text-yellow-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold">Безлимитный доступ</p>
                    <p className="text-sm text-muted-foreground">Ко всем решениям</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Download" className="text-yellow-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold">Скачивание PDF</p>
                    <p className="text-sm text-muted-foreground">Решений офлайн</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="Sparkles" className="text-yellow-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold">Без рекламы</p>
                    <p className="text-sm text-muted-foreground">Чистый интерфейс</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Icon name="HeadphonesIcon" className="text-yellow-600 mt-1" size={24} />
                  <div>
                    <p className="font-semibold">Поддержка 24/7</p>
                    <p className="text-sm text-muted-foreground">Приоритетная помощь</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}