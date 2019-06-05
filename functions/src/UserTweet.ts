
export class UserTweet {
    // User id
    user: string = '';

    // Tweet id
    tweet: string = '';

    public isValid(): boolean {
        return (this.user !== '') && (this.tweet !== '');
    } 
}