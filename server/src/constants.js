export const DB_NAME = "addaloveDB";
export const options = {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: '/'
}