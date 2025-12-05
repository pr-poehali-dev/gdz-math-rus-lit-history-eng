import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const students = [
  { id: 1, name: 'Анна Петрова', grade: '9А', completedTasks: 45 },
  { id: 2, name: 'Дмитрий Ковалев', grade: '9А', completedTasks: 38 },
  { id: 3, name: 'Елена Смирнова', grade: '9Б', completedTasks: 52 },
  { id: 4, name: 'Максим Тихонов', grade: '9Б', completedTasks: 41 },
];

const assignments = [
  { 
    id: 1, 
    title: 'Квадратные уравнения', 
    subject: 'Алгебра', 
    class: '9А',
    deadline: '20.12.2024',
    completed: 18,
    total: 25,
  },
  { 
    id: 2, 
    title: 'Причастные обороты', 
    subject: 'Русский язык', 
    class: '9Б',
    deadline: '22.12.2024',
    completed: 12,
    total: 22,
  },
];

export default function TeacherPanel() {
  const navigate = useNavigate();
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedClass, setSelectedClass] = useState('9А');

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Задание успешно создано и отправлено ученикам!');
    setTaskTitle('');
    setTaskDescription('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <Icon name="ArrowLeft" size={20} className="mr-2" />
              На главную
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Панель учителя</h1>
              <p className="text-muted-foreground">Управление заданиями и учениками</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/profile')}>
            <Icon name="User" size={20} className="mr-2" />
            Профиль
          </Button>
        </div>

        <Tabs defaultValue="assignments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="assignments">Задания</TabsTrigger>
            <TabsTrigger value="students">Ученики</TabsTrigger>
            <TabsTrigger value="create">Создать задание</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="space-y-4">
            <div className="grid gap-4">
              {assignments.map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="mb-2">{assignment.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge variant="secondary">{assignment.subject}</Badge>
                          <Badge variant="outline">{assignment.class}</Badge>
                        </div>
                      </div>
                      <Badge className="bg-blue-500">
                        <Icon name="Clock" size={14} className="mr-1" />
                        До {assignment.deadline}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-muted-foreground">Выполнено:</span>
                          <span className="font-semibold">
                            {assignment.completed} / {assignment.total}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(assignment.completed / assignment.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      <Button variant="outline" className="ml-4">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Подробнее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Список учеников</CardTitle>
                <CardDescription>Прогресс по выполненным заданиям</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.grade} класс</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{student.completedTasks} задач</p>
                        <p className="text-sm text-muted-foreground">выполнено</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Создать новое задание</CardTitle>
                <CardDescription>Отправьте задание ученикам выбранного класса</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAssignment} className="space-y-4">
                  <div>
                    <label className="block mb-2 font-semibold">Название задания</label>
                    <Input
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="Например: Решить уравнения №45-50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold">Описание</label>
                    <Textarea
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      placeholder="Подробное описание задания, страницы учебника..."
                      className="min-h-32"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 font-semibold">Класс</label>
                      <select
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="w-full rounded-md border border-input bg-background px-3 py-2"
                      >
                        <option value="9А">9А</option>
                        <option value="9Б">9Б</option>
                        <option value="9В">9В</option>
                        <option value="10А">10А</option>
                        <option value="11А">11А</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold">Срок выполнения</label>
                      <Input type="date" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Icon name="Send" size={20} className="mr-2" />
                    Отправить задание ученикам
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
