import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dto/create-report.dto";
import { GetEstimateDto } from "./dto/get-estimate.dto";
import { User } from "../users/user.entity";
import { Report } from "./report.entity";

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
  ) {}

  create(user: User, reportDto: CreateReportDto) {
    const report = this.reportsRepository.create({ ...reportDto, user });
    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepository.findOne({
      where: { id: parseInt(id) },
    });
    if (!report) throw new NotFoundException("report not found");
    report.approved = approved;
    return this.reportsRepository.save(report);
  }

  async createEstimate({ make, model, lng, lat, mileage, year }: GetEstimateDto) {
    const result = await this.reportsRepository
      .createQueryBuilder()
      .select("*")
      .where("make = :make")
      .andWhere("model = :model")
      .andWhere("lng - :lng BETWEEN -5 AND 5")
      .andWhere("lat - :lat BETWEEN -5 AND 5")
      .andWhere("year - :year BETWEEN -3 AND 3")
      .andWhere("approved IS TRUE")
      .orderBy("ABS(mileage - :mileage)", "DESC")
      .setParameters({ make, model, lng, lat, year, mileage })
      .limit(3)
      .getRawMany();

    return result.reduce((sum, item) => sum + item.price, 0) / 3;
  }
}
