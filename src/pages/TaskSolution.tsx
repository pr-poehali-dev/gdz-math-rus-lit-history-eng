import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useNavigate, useParams } from 'react-router-dom';
import { getTaskById, tasks } from '@/data/tasks';



export default function TaskSolution() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const taskId = id ? parseInt(id) : 1;
  const currentTask = getTaskById(taskId);
  
  if (!currentTask) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Задача не найдена</h1>
          <Button onClick={() => navigate('/')}>
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
        </div>
      </div>
    );
  }

  const relatedTasks = tasks
    .filter(t => t.subject === currentTask.subject && t.id !== currentTask.id)
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      title: `Задача №${t.id}`,
      subject: t.subject,
      difficulty: t.difficulty
    }));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Лёгкая':
        return 'bg-green-500';
      case 'Средняя':
        return 'bg-yellow-500';
      case 'Сложная':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад к каталогу
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 animate-fade-in">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{currentTask.subject}</Badge>
                      <Badge variant="outline">{currentTask.grade}</Badge>
                      <Badge className={getDifficultyColor(currentTask.difficulty)}>
                        {currentTask.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl mb-2">Задача №{currentTask.id}</CardTitle>
                    <p className="text-muted-foreground">
                      {currentTask.chapter} → {currentTask.topic}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Icon name="Eye" size={16} />
                      <span>{currentTask.views}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLiked(!isLiked)}
                      className={isLiked ? 'text-red-500' : ''}
                    >
                      <Icon name="Heart" size={16} className="mr-1" fill={isLiked ? 'currentColor' : 'none'} />
                      {currentTask.likes + (isLiked ? 1 : 0)}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 rounded-xl p-6 mb-6 border-2 border-primary/20">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Icon name="FileQuestion" size={20} className="text-primary" />
                    Условие задачи
                  </h3>
                  <p className="text-lg">{currentTask.question}</p>
                </div>

                <Tabs defaultValue="steps" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="steps">Пошаговое решение</TabsTrigger>
                    <TabsTrigger value="full">Полное решение</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="steps" className="space-y-4">
                    {currentTask.steps.map((step, index) => (
                      <Card
                        key={step.id}
                        className={`transition-all duration-300 ${
                          index === currentStep
                            ? 'border-2 border-primary shadow-lg scale-105'
                            : 'border-border opacity-60'
                        }`}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                              {step.id}
                            </div>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {step.formula && (
                            <div className="bg-secondary/50 rounded-lg p-3 mb-3 font-mono text-center">
                              {step.formula}
                            </div>
                          )}
                          <p className="whitespace-pre-line text-base leading-relaxed">
                            {step.content}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <div className="flex items-center justify-between mt-6">
                      <Button
                        variant="outline"
                        disabled={currentStep === 0}
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                      >
                        <Icon name="ChevronLeft" size={20} className="mr-1" />
                        Предыдущий шаг
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        Шаг {currentStep + 1} из {currentTask.steps.length}
                      </span>
                      <Button
                        variant="outline"
                        disabled={currentStep === currentTask.steps.length - 1}
                        onClick={() => setCurrentStep(Math.min(currentTask.steps.length - 1, currentStep + 1))}
                      >
                        Следующий шаг
                        <Icon name="ChevronRight" size={20} className="ml-1" />
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="full" className="space-y-4">
                    {currentTask.steps.map((step) => (
                      <div key={step.id}>
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">
                            {step.id}
                          </span>
                          {step.title}
                        </h4>
                        {step.formula && (
                          <div className="bg-secondary/50 rounded-lg p-3 mb-2 font-mono text-center">
                            {step.formula}
                          </div>
                        )}
                        <p className="whitespace-pre-line mb-4 ml-10 text-muted-foreground">
                          {step.content}
                        </p>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <div className="bg-accent/20 rounded-xl p-6 border-2 border-accent/30">
                  <h3 className="font-semibold text-xl mb-3 flex items-center gap-2">
                    <Icon name="CheckCircle" size={24} className="text-accent" />
                    Ответ
                  </h3>
                  <p className="text-xl font-mono mb-3">{currentTask.answer}</p>
                  <p className="text-muted-foreground">{currentTask.explanation}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2 animate-fade-in sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Lightbulb" size={20} className="text-yellow-500" />
                  Похожие задачи
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {relatedTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="cursor-pointer hover:shadow-lg transition-all hover:border-primary border"
                    onClick={() => navigate(`/task/${task.id}`)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{task.title}</h4>
                        <Icon name="ArrowRight" size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{task.subject}</Badge>
                        <Badge className={`${getDifficultyColor(task.difficulty)} text-xs`}>
                          {task.difficulty}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-primary/10 to-secondary/10 animate-fade-in">
              <CardContent className="p-6 text-center">
                <Icon name="MessageCircle" size={40} className="mx-auto mb-3 text-primary" />
                <h3 className="font-semibold text-lg mb-2">Есть вопросы?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Задайте вопрос по решению задачи
                </p>
                <Button className="w-full">
                  <Icon name="Send" size={16} className="mr-2" />
                  Задать вопрос
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}