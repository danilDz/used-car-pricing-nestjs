import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Report } from "./report.entity";
import { CreateReportDto } from "./dto/create-report.dto";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { User } from "src/users/user.entity";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(user: User, reportDto: CreateReportDto ) {
    const report = this.reportsRepository.create({...reportDto, user});
    return this.reportsRepository.save(report);
  }
}
