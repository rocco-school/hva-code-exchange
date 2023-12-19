import {Answer} from "../answer";

export interface AnswerWithUser extends Answer {
    firstname: string;
    lastname: string;
}