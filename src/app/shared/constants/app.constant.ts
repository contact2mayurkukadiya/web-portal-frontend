import { environment } from "src/environments/environment";

export const APP_CONST = {
    ServerUrl: environment.hostUrl,
    Role: {
        SuperAdmin: 1,
        Admin: 2,
        SubAdmin: 3
    },
    MaxFileSizeInMB: 10
}