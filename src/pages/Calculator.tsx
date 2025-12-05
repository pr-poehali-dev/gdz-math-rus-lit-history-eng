import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

export default function Calculator() {
  const navigate = useNavigate();
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleEqual = () => {
    try {
      const fullEquation = equation + display;
      const calculated = eval(fullEquation.replace('×', '*').replace('÷', '/'));
      setResult(calculated);
      setDisplay(calculated.toString());
      setEquation('');
    } catch (error) {
      setDisplay('Ошибка');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setResult(null);
  };

  const buttons = [
    '7', '8', '9', '÷',
    '4', '5', '6', '×',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          На главную
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
            <Icon name="Calculator" size={40} className="text-primary" />
            Калькулятор
          </h1>
          <p className="text-lg text-muted-foreground">
            Решайте примеры и получайте объяснения
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Вычисления</CardTitle>
              <CardDescription>Введите пример для решения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="bg-muted rounded-lg p-4 mb-2 text-right">
                  <div className="text-sm text-muted-foreground min-h-6">{equation}</div>
                  <div className="text-3xl font-bold">{display}</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {buttons.map((btn) => (
                  <Button
                    key={btn}
                    variant={['÷', '×', '-', '+', '='].includes(btn) ? 'default' : 'outline'}
                    size="lg"
                    className="text-xl h-16"
                    onClick={() => {
                      if (btn === '=') handleEqual();
                      else if (['÷', '×', '-', '+'].includes(btn)) handleOperator(btn);
                      else handleNumber(btn);
                    }}
                  >
                    {btn}
                  </Button>
                ))}
              </div>

              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={handleClear}
              >
                <Icon name="Trash2" size={20} className="mr-2" />
                Очистить
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Объяснение</CardTitle>
              <CardDescription>Пошаговое решение примера</CardDescription>
            </CardHeader>
            <CardContent>
              {result !== null ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Check" size={20} className="text-green-600" />
                      Ответ: {result}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Результат вычисления сохранён
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Icon name="Lightbulb" size={18} />
                      Как решать:
                    </h4>
                    <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                      <li>Выполняем действия по порядку</li>
                      <li>Следим за знаками операций</li>
                      <li>Проверяем правильность результата</li>
                    </ol>
                  </div>

                  <div className="border border-blue-500 rounded-lg p-4 bg-blue-50">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-blue-700">
                      <Icon name="Video" size={18} />
                      Видеоуроки по теме
                    </h4>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/videos')}>
                      Смотреть обучающие видео
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Icon name="Calculator" size={64} className="mx-auto mb-4 opacity-20" />
                  <p>Введите пример для получения объяснения</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6 border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="BookOpen" size={24} />
              Полезные материалы
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
