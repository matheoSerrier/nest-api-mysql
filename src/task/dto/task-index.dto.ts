export class TaskIndexDto {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  project: {
    id: number;
    name: string;
  };
  assignedUsers: {
    id: number;
    firstname: string;
    lastname: string;
    slug: string;
  }[];
}
