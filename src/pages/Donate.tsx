import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Donate() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonate = async (amount: number, productType: string) => {
    if (!email) {
      toast({
        title: "Ошибка",
        description: "Введите email для получения доступа",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/payment-processor/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: name || 'Аноним',
          amount,
          product_type: productType
        })
      });

      const data = await response.json();
      
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast({
          title: "Успех!",
          description: "Платёж обработан. Проверьте email для доступа.",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать платёж. Попробуйте позже.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto p-4 max-w-5xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="Heart" size={40} className="text-red-500" />
            Поддержать проект
          </h1>
          <p className="text-lg text-muted-foreground">
            Получите доступ к премиум материалам
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Ваши данные</CardTitle>
              <CardDescription>Для получения доступа к материалам</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email *</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Имя (необязательно)</label>
                <Input
                  type="text"
                  placeholder="Ваше имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Базовый</Badge>
                <div className="text-3xl font-bold">99₽</div>
              </div>
              <CardTitle className="text-xl">Месяц доступа</CardTitle>
              <CardDescription>Все материалы на 30 дней</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Все решения задач
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Видеоуроки
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Калькулятор с объяснениями
                </li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleDonate(99, 'basic_month')}
                disabled={loading}
              >
                {loading ? <Icon name="Loader2" className="animate-spin" /> : 'Оплатить 99₽'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-4 border-primary hover:shadow-2xl transition-all relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-purple-600">Популярно</Badge>
            </div>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge>Немецкий язык</Badge>
                <div className="text-3xl font-bold">190₽</div>
              </div>
              <CardTitle className="text-xl">Немецкий язык навсегда</CardTitle>
              <CardDescription>Полный доступ к немецкому языку</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Все учебники по немецкому
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Решения всех заданий
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Видеоуроки по грамматике
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Без ограничений по времени
                </li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-primary to-purple-600" 
                onClick={() => handleDonate(190, 'german_forever')}
                disabled={loading}
              >
                {loading ? <Icon name="Loader2" className="animate-spin" /> : 'Купить за 190₽'}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary">Годовой</Badge>
                <div className="text-3xl font-bold">599₽</div>
              </div>
              <CardTitle className="text-xl">Год доступа</CardTitle>
              <CardDescription>Экономия 589₽ за год</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4 text-sm">
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Все материалы
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Приоритетная поддержка
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  Новые материалы первыми
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Check" size={16} className="text-green-600" />
                  365 дней доступа
                </li>
              </ul>
              <Button 
                className="w-full" 
                onClick={() => handleDonate(599, 'premium_year')}
                disabled={loading}
              >
                {loading ? <Icon name="Loader2" className="animate-spin" /> : 'Оплатить 599₽'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Gift" size={24} className="text-amber-600" />
              Свободная поддержка
            </CardTitle>
            <CardDescription>Помогите проекту любой суммой</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              <Button variant="outline" onClick={() => handleDonate(50, 'donation')} disabled={loading}>
                50₽
              </Button>
              <Button variant="outline" onClick={() => handleDonate(100, 'donation')} disabled={loading}>
                100₽
              </Button>
              <Button variant="outline" onClick={() => handleDonate(250, 'donation')} disabled={loading}>
                250₽
              </Button>
              <Button variant="outline" onClick={() => handleDonate(500, 'donation')} disabled={loading}>
                500₽
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Ваша поддержка помогает развивать платформу и добавлять новые материалы
            </p>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>После оплаты доступ придёт на указанный email</p>
          <p className="mt-2">Защищённые платежи через ЮKassa</p>
        </div>
      </div>
    </div>
  );
}
