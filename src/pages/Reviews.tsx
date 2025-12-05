import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

const reviews = [
  {
    id: 1,
    name: 'Анна П.',
    grade: '9 класс',
    rating: 5,
    text: 'Отличная платформа! Все решения подробные и понятные. Сдала алгебру на 5!',
    date: '15.11.2024',
  },
  {
    id: 2,
    name: 'Дмитрий К.',
    grade: '11 класс',
    rating: 5,
    text: 'Готовился к ЕГЭ, очень помогло. Пошаговые решения - это именно то, что нужно.',
    date: '12.11.2024',
  },
  {
    id: 3,
    name: 'Елена С.',
    grade: '8 класс',
    rating: 4,
    text: 'Хороший сайт, много предметов. Иногда не хватает решений по новым учебникам.',
    date: '10.11.2024',
  },
  {
    id: 4,
    name: 'Максим Т.',
    grade: '10 класс',
    rating: 5,
    text: 'Подписка за 99 рублей - лучшее вложение! Экономлю кучу времени на домашке.',
    date: '08.11.2024',
  },
];

export default function Reviews() {
  const navigate = useNavigate();
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Спасибо за отзыв! Он будет опубликован после модерации.');
    setNewReview('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Отзывы учеников</h1>
          <div className="flex items-center justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Icon key={star} name="Star" size={24} className="text-yellow-500" fill="currentColor" />
            ))}
          </div>
          <p className="text-lg text-muted-foreground">4.9 из 5 на основе 1247 отзывов</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Оставить отзыв</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-2 font-semibold">Ваша оценка</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Icon
                        name="Star"
                        size={32}
                        className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}
                        fill={star <= rating ? 'currentColor' : 'none'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold">Ваш отзыв</label>
                <Textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Расскажите о своём опыте использования платформы..."
                  className="min-h-32"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Icon name="Send" size={20} className="mr-2" />
                Отправить отзыв
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{review.name}</p>
                      <Badge variant="outline">{review.grade}</Badge>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={16}
                          className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                          fill={star <= review.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-muted-foreground">{review.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
