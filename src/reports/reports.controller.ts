import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportDto } from "./dto/report.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "../guards/auth.guard";
import { CurrentUser } from "src/users/decorators/current-user.decorator";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { User } from "src/users/user.entity";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(user, body);
  }
}
