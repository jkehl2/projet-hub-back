const ProjectDataSource = require('./projectDataSource');
const UserDataSource = require('./userDataSource');
const CommentDataSource = require('./commentDataSource');
const NeedDataSource = require('./needDataSource');
const FavoriteDataSource = require('./favoriteDataSource');


module.exports = {
    project: new ProjectDataSource(),
    user: new UserDataSource(),
    comment: new CommentDataSource(),
    need: new NeedDataSource(),
    favorite: new FavoriteDataSource()
}