export class Comment {
    comId?: string;
    task?: string;
    text?: string;
    comDate?: string;
    postId_fk?: number;
    usrId_fk?: number;
    userName?: string;

    constructor(comId?: string, task?: string, text?: string, comDate?: string
        , post_fk?: number, usr_fk?: number, username?: string) {
        this.comId = comId;
        this.task = task;
        this.text = text;
        this.comDate = comDate;
        this.postId_fk = post_fk;
        this.usrId_fk = usr_fk;
        this.userName = username;
    }
}
