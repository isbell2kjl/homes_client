export class Project {
    projectId?: number;
    projectName?: string;
    siteName?: string;
    mainTitle?: string;
    mainText?: string;
    tagline?: string;
    leftTitle?: string;
    leftText?: string;
    centerTitle?: string;
    centerText?: string;
    rightTitle?: string;
    rightText?: string;
    contactText?: string;
    contactEmail?: string;
    contactPhone?: string;
    users?: [];

    constructor(id?: number, name?: string, site?: string, mtitle?: string, mtext?: string, 
        tagline?: string, sub1title?: string, sub1text?: string, sub2title?: string, sub2text?: string, sub3title?: string, 
        sub3text?: string, ctext?: string, cemail?: string, cphone?: string, users?: any) {
        this.projectId = id;
        this.projectName = name;
        this.siteName = site;
        this.mainTitle = mtitle;
        this.mainText = mtext;
        this.tagline = tagline;
        this.leftTitle = sub1title;
        this.leftText = sub1text;
        this.centerTitle = sub2title;
        this.centerText = sub2text;
        this.rightTitle = sub3title;
        this.rightText = sub3text;
        this.contactText = ctext;
        this.contactEmail = cemail;
        this.contactPhone = cphone;
        this.users = users;
    }
}