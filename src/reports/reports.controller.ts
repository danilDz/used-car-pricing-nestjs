import {
  Body,
  Controller,
  Post,
  UseGuards,
  Patch,
  Param,
  Get,
  Query
} from "@nestjs/common";
import { CreateReportDto } from "./dto/create-report.dto";
import { ReportDto } from "./dto/report.dto";
import { ApproveReportDto } from "./dto/approve-report.dto";
import { GetEstimateDto } from "./dto/get-estimate.dto";
import { ReportsService } from "./reports.service";
import { AuthGuard } from "../guards/auth.guard";
import { AdminGuard } from "../guards/admin.guard";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { Serialize } from "../interceptors/serialize.interceptor";
import { User } from "../users/user.entity";

@Controller("reports")
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportsService.create(user, body);
  }

  @Patch("/:id")
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.changeApproval(id, body.approved);
  }

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }
}
