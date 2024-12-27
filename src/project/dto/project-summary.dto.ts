import { UserSummaryDto } from "src/user/dto/user-summary.dto";

export class ProjectSummaryDto {
    id: number;
    name: string;
    description: string;
    owner: UserSummaryDto;
    participants: UserSummaryDto[];
  }