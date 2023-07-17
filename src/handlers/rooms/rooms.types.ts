type CreateRoomType = {
    type: "create_room",
    data: string,
    id: 0,
}

type AddUserToRoomType = {
    type: "add_user_to_room",
    data: string, //indexRoom
    id: 0,
}

export type RoomType = {
    player1: number,
    player2: number | null,
}

export type RoomsRequestType = CreateRoomType | AddUserToRoomType;