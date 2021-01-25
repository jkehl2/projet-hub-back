const CategoryDataSource = require('./categoryDataSource');
const PostDataSource = require('./postDataSource');
const AuthorDataSource = require('./authorDataSource');
const ProjectDataSource = require('./projectDataSource');
const UserDataSource = require('./userDataSource');
const CommentDataSource = require('./commentDataSource');
const NeedDataSource = require('./needDataSource');
const FavoriteDataSource = require('./favoriteDataSource');


module.exports = {
    category: new CategoryDataSource(),
    post: new PostDataSource(),
    author: new AuthorDataSource(),
    project: new ProjectDataSource(),
    user: new UserDataSource(),
    comment: new CommentDataSource(),
    need: new NeedDataSource(),
    favorite: new FavoriteDataSource()
}