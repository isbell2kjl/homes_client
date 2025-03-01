export class Post {
    postId?: string;
    title?: string;
    content?: string;
    posted?: Date;
    photoURL?: string;
    visible?: number;
    archive?: number;
    userId_fk?: number;
    userName?: string;
    comment? : []

    constructor(posted: Date = new Date(), id?: string, title?: string, content?: string,
        photourl?: string, visible?: number, archive?: number, fk?: number, username?: string, comment?: []) {
        this.postId = id;
        this.title = title; 
        this.content = content;
        this.posted = posted;
        this.photoURL = photourl;
        this.visible = visible;
        this.archive = archive;
        this.userId_fk = fk;
        this.userName = username;
        this.comment = comment
    }
}