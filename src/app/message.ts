import { User } from "./user";

export interface Message{
    user1: User,
    user2: User,
    content: string,
    date: string
}