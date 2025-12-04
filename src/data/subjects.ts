export interface Subject {
  id: number;
  name: string;
  icon: string;
  color: string;
  tasks: number;
  trending: boolean;
}

export const subjects: Subject[] = [
  {
    id: 1,
    name: 'Математика',
    icon: 'Calculator',
    color: 'bg-gradient-to-br from-purple-500 to-purple-700',
    tasks: 1247,
    trending: true,
  },
  {
    id: 2,
    name: 'Русский язык',
    icon: 'BookOpen',
    color: 'bg-gradient-to-br from-blue-500 to-blue-700',
    tasks: 892,
    trending: false,
  },
  {
    id: 3,
    name: 'Литература',
    icon: 'BookMarked',
    color: 'bg-gradient-to-br from-orange-500 to-orange-700',
    tasks: 654,
    trending: true,
  },
  {
    id: 4,
    name: 'История',
    icon: 'Scroll',
    color: 'bg-gradient-to-br from-teal-500 to-teal-700',
    tasks: 523,
    trending: false,
  },
  {
    id: 5,
    name: 'Английский язык',
    icon: 'Languages',
    color: 'bg-gradient-to-br from-pink-500 to-pink-700',
    tasks: 734,
    trending: true,
  },
  {
    id: 6,
    name: 'Физика',
    icon: 'Atom',
    color: 'bg-gradient-to-br from-cyan-500 to-cyan-700',
    tasks: 956,
    trending: true,
  },
  {
    id: 7,
    name: 'Химия',
    icon: 'Flask',
    color: 'bg-gradient-to-br from-green-500 to-green-700',
    tasks: 678,
    trending: true,
  },
  {
    id: 8,
    name: 'Информатика',
    icon: 'Code',
    color: 'bg-gradient-to-br from-violet-500 to-violet-700',
    tasks: 543,
    trending: true,
  },
  {
    id: 9,
    name: 'ГДЗ',
    icon: 'GraduationCap',
    color: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
    tasks: 2156,
    trending: true,
  },
];
