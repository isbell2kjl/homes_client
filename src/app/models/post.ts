export class Post {
    postId?: string;
    title?: string;
    content?: string;
    posted?: string;
    photoURL?: string;
    userId_fk?: number;
    userName?: string;
    comment? : []

    constructor(id?: string, title?: string, content?: string, posted?: string, photourl?: string
        , fk?: number, username?: string, comment?: []) {
        this.postId = id;
        this.title = title;
        this.content = content;
        this.posted = posted;
        this.photoURL = photourl;
        this.userId_fk = fk;
        this.userName = username;
        this.comment = comment
    }
}