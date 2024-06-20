export class Post {
    postId?: string;
    title?: string;
    content?: string;
    posted?: string;
    photoURL?: string;
    visible?: number;
    userId_fk?: number;
    userName?: string;
    comment? : []

    constructor(id?: string, title?: string, content?: string, posted?: string, 
        photourl?: string, visible?: number, fk?: number, username?: string, comment?: []) {
        this.postId = id;
        this.title = title;
        this.content = content;
        this.posted = posted;
        this.photoURL = photourl;
        this.visible = visible;
        this.userId_fk = fk;
        this.userName = username;
        this.comment = comment
    }
}