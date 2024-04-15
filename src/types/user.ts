export interface User {
    id: string,
    name: string,
    password?: string
}

export interface RoomWithTeacher {
    id: string,
    name: string,
    teacher?: User
}