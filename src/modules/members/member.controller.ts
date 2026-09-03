import {
  ValidationPipe, ParseIntPipe, Controller, Param, Post, Body, Get, Put,
  Req,
  Delete,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { TOKEN_NAME } from "../../config";
import {
  ApiDocument,
  PaginationParams, PaginationRequest, PaginationResponseDto,
  RequiredPermissions,
  SkipAuth,
} from "../../common";
import {
  CreateMemberRequestDto, UpdateMemberRequestDto, MemberResponseDto,
  MemberFilterParams,
} from "./_types";
import { MemberService } from "./member.service";
import { CAN_DELETE_MEMBER, CAN_UPDATE_MEMBER, CAN_VIEW_MEMBER } from "../../database/seed_data/permissions.data";
import { MemberGuard } from "../../../src/guards";
@ApiTags("Members")
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: "member",
  version: "1",
})
export class MemberController {
  constructor(private memberService: MemberService) { }

  @ApiDocument({
    requestDescription: "Get the list of all Members with optional search filter. It will be fetched with specific sets of Member otherwise rejected.",
    responseDescription: "Paginated list with data and paginate options.",
    returnDataDto: MemberResponseDto,
    pagination: true,
    successStatusCode: 200,
  })
  @ApiQuery({
    name: "search", type: "string", required: false, example: "admin",
  })
  @ApiQuery({
    name: "role_id", type: "number", required: false, example: "1",
  })
  @RequiredPermissions(CAN_VIEW_MEMBER.slug)
  @Get()
  public getMembers(@PaginationParams() pagination: PaginationRequest<MemberFilterParams>, @Req() req: any)
    : Promise<PaginationResponseDto<MemberResponseDto>> {
    pagination['params']['userId'] = req.user.id
    return this.memberService.getMembers(pagination);
  }

  @ApiDocument({
    requestDescription: "Retrieve details of a specific member by their ID.",
    responseDescription: "Successfully fetched the member details.",
    returnDataDto: MemberResponseDto,
    pagination: true,
    successStatusCode: 200,
  })
  @RequiredPermissions(CAN_VIEW_MEMBER.slug)
  @Get("/:id")
  public getMemberById(@Param("id", ParseIntPipe) id: number): Promise<MemberResponseDto> {
    return this.memberService.getMemberById(id);
  }


  @ApiDocument({
    successStatusCode: 201,
    requestDescription: "Create a new member.",
    responseDescription: "Member created successfully.",
    returnDataDto: MemberResponseDto,
    errorResponses: [HttpStatus.CONFLICT, HttpStatus.BAD_REQUEST],
  })
  @RequiredPermissions(CAN_UPDATE_MEMBER.slug)
  @Post()
  public createMember(@Body(ValidationPipe) memberDTO: CreateMemberRequestDto): Promise<MemberResponseDto> {
    return this.memberService.createMember(memberDTO);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Update a member's profile when the member initiates the update.",
    responseDescription: "Member profile updated successfully.",
    returnDataDto: MemberResponseDto,
    errorResponses: [400, 401, 404]
  })
  @RequiredPermissions(CAN_UPDATE_MEMBER.slug)
  @Put("/:id")
  public updateMember(@Param("id", ParseIntPipe) id: number, @Body(ValidationPipe) memberDTO: UpdateMemberRequestDto, @Req() req: any): Promise<MemberResponseDto> {
    return this.memberService.updateMember(id, memberDTO, req.user.id);
  }

  @ApiDocument({
    successStatusCode: 200,
    requestDescription: "Request to archive a member.",
    responseDescription: "Member archived successfully.",
    returnDataDto: MemberResponseDto,
    errorResponses: [400, 401, 404]
  })
  @UseGuards(MemberGuard)
  @RequiredPermissions(CAN_DELETE_MEMBER.slug)
  @Delete("/:id")
  public archiveMember(@Param("id", ParseIntPipe) id: number, @Req() req: any): Promise<MemberResponseDto> {
    return this.memberService.archiveMember({ id, deletedBy: req.user.id });
  }


}
