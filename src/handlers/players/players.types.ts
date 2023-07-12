type PlayerType = {
    name: string,
    password: string,
};

type RegistationRequestType = {
    type: "reg",
    data: string,
    id: 0,
};

type RegistationResponseType = {
        type: "reg",
        data:{
                name: string,
                index: number,
                error: boolean,
                errorText: string,
            },
        id: 0,
}

export { RegistationRequestType, PlayerType, RegistationResponseType };