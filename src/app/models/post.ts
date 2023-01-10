export class Post {
    postId?: string;
    title?: string;
    content?: string;
    posted?: string;
    userId_fk?: number;
    userName?: string;

    constructor(id?: string, title?: string, content?: string, posted?: string
        , fk?: number, username?: string) {
        this.postId = id;
        this.title = title;
        this.content = content;
        this.posted = posted;
        this.userId_fk = fk;
        this.userName = username;
    }
}