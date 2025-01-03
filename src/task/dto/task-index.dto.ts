export class TaskIndexDto {
  id: number;
  title: string;
  slug: string;
  description: string;
  isCompleted: boolean;
  project: {
    id: number;
    name: string;
    slug: string;
  };
  assignedUsers: {
    id: number;
    firstname: string;
    lastname: string;
    slug: string;
  }[];
}
