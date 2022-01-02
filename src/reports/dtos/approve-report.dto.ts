import { IsBoolean, isBoolean } from "class-validator"

export class ApproveReportDto {
    @IsBoolean()
    approved: boolean
}