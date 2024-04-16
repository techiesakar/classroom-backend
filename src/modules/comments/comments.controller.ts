import { Body, Controller, Param, Post } from '@nestjs/common';
import { CommentsService } from './comments.services';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/current-user.decorators';
import { User } from 'src/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment-dto';

@ApiTags('Comment')
@Controller('comment')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post('assignment/:id/create')
  @ApiOperation({ summary: 'Create Comment in Assignment' })
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
