import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from '../services/comments.services';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../users/decorators/current-user.decorators';
import { User } from 'src/entities/user.entity';
import { CreateCommentDto } from '../dto/create-comment-dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Comment')
@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('assignment/:id/create')
  @ApiOperation({ summary: 'Create Comment in Assignment' })
  @UsePipes(new ValidationPipe({ whitelist: true }))
  createAssignComment(
    @Param('id') assignId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentService.createAssignComment(
      assignId,
      createCommentDto,
      currentUser,
    );
  }

  @Post('announcement/:id/create')
  @ApiOperation({ summary: 'Create Comment in Announcement' })
  createAnnounceComment(
    @Param('id') announceId: string,
    @Body() createCommentDto: CreateCommentDto,
    @CurrentUser() currentUser: User,
  ) {
    return this.commentService.createAnnouncementComment(
      announceId,
      createCommentDto,
      currentUser,
    );
  }
}
