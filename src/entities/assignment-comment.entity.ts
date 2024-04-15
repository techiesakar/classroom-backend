import { ManyToOne } from "typeorm";
import { Comment } from "./comment.entity";
import { Assignment } from "./assignment.entity";

export class AssignmentComment {
    @ManyToOne(() => Comment, comment => comment.announcement)
    comment: Comment

    @ManyToOne(() => Assignment, assignment => assignment.comments)
    assignment: Assignment
}