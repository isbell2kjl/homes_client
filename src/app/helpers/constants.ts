// export const baseURL: string = 'https://localhost:7279/api';
// export const baseURL: string = 'https://myproperties.ddns.net/api';
//export const baseURL: string = 'https://myadvantageproperties.com/api';

//Use relative path since Angular and the API are served from the same Nginx server.
//Angular will automatically call the backend on the same domain the app is loaded from (www or non-www).
export const baseURL: string = '/api';

//webSite=true if used as public website or false if used for internal tracking only.
export const webSite: boolean = true;

export const StrongPasswordRegx: RegExp =  
/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

export const EmailFormatRegx: RegExp =
/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;

export const MyRecaptchaKey: string ="6LdNGyEqAAAAAD94Gnk-Uv6_Ia0pzbHyJ99jQQjM";
