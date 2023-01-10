export class User {
    userId?: string;
    userName?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    state?: string;
    country?: string;
    created?: string;
    posts?: [];
    content?: string;
    token?: string;

    constructor(userId?: string, userName?: string, password?: string, firstName?: string
        , lastName?: string, email?: string, state?: string, country?: string, created?: string
        , posts?: any, content?: string, token?: string) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.state = state;
        this.country = country;
        this.created = created;
        this.posts = posts;
        this.content = content;
        this.token = token;
    }
}