

syncio.onclose = function(user){
    this.emit( syncio.on.close, user );
    delete this.users[ user[syncio.user_token_key] ];
}