
import { catchError, finalize, of } from 'rxjs';
import { UserService } from '../services/user.service';

export function appInitializer(userService: UserService) {
    return () => userService.refreshToken()
        .pipe(
            // catch error to start app on success or failure
            catchError(() => of())
        );
}