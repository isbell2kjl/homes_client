
export class User {
    userId?: number;
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
    // refreshToken?: string;
    // refreshTokenExpires?: Date;
    terms?: number;
    privacy?: number;
    projId_fk?: number;
    role?: number;
    

    constructor(userId?: number, userName?: string, password?: string, firstName?: string
        , lastName?: string, email?: string, state?: string, country?: string, created?: string
        , posts?: any, content?: string, token?: string, refreshToken?: string, refreshExpires?: Date,
        terms?: number, privacy?: number, projId_fk?: number, role?: number) {

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
        // this.refreshTokenExpires = refreshExpires;
        // this.refreshToken = refreshToken;
        this.terms = terms;
        this.privacy = privacy; 
        this.projId_fk = projId_fk;
        this.role = role;
    }
}