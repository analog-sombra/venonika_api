import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import {
  DeleteSessionDto,
  DeleteUserSessionsDto,
} from './dto/delete-session.dto';
import { FindOneSessionDto, FindUserSessionsDTO } from './dto/find-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  create(@Body() createSessionDto: CreateSessionDto) {
    return this.sessionService.create(createSessionDto);
  }

  @Get(':sessionId')
  findOne(@Param() params: FindOneSessionDto) {
    return this.sessionService.findOne(params.sessionId);
  }

  @Get('/user/:userId')
  findUserSessions(@Param() params: FindUserSessionsDTO) {
    return this.sessionService.findUserSessions(params.userId);
  }

  @Patch(':sessionId')
  update(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return this.sessionService.update(sessionId, updateSessionDto);
  }

  @Delete(':sessionId')
  remove(@Param() params: DeleteSessionDto) {
    return this.sessionService.remove(params.sessionId);
  }

  @Delete('/user/:userId')
  removeUserSessions(@Param() params: DeleteUserSessionsDto) {
    return this.sessionService.removeUserSessions(params.userId);
  }

  @Delete('/')
  removeExpiredSessions() {
    return this.sessionService.removeExpiredSessions();
  }
}
