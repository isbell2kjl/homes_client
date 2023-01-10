export class SignInRequest {
    userId?: string;
    userName?: string;
    password?: string;

    constructor(userId?: string, username?: string
        , password?: string) {
        this.userId = userId;
        this.password = password;
        this.userName = username;
    }
}
