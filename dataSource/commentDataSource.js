const { DataSource } = require('apollo-datasource');
const DataLoader = require('dataloader');

class CommentDataSource extends DataSource {

    constructor() {
        super();
    }

    // Dans la DataSource on doit obligatoirement implémenter une méthode
    // initialize qui sera appelé par notre serveur apollo pour faire de
    // "l'injection de dépendance"
    initialize(config) {
        // config contiendra 2 propriété
        // - context qui servira à faire passer les dépendances
        // - cache pour la gestion interne
        this.context = config.context;
        this.client = config.context.sqlClient;
    }

    async findAllComments() {
        const result = await this.client.query('SELECT * FROM comments');
        return result.rows;
    }

    async findCommentsById(commentId) {
        await this.commentLoader.clear(commentId)
        console.log(`-- Adding ${commentId} to need dataloader`);
        return await this.commentLoader.load(commentId);
    }

    async findCommentsByProjectId(projectId) {
        await this.commentsByProjectLoader.clear(projectId);
        console.log(`-- Adding ${projectId} to need by project dataloader`);
        return await this.commentsByProjectLoader.load(projectId);
    }

    // Le constructeur de dataLoader reçoit une fonction
    // qui a pour paramètre une liste d'élément à récupérer
    commentLoader = new DataLoader(async (ids) => {
        console.log('Running batch function categoriesLoader with', ids);
        // Dans mon loader
        // Je dois trouver un moyen de récupérer les categories correspondants
        // aux id qui me sont donnés

        // On fait une requête SQL pour récupérer un batch de catégorie
        const result = await this.client.query(
            'SELECT * FROM comments WHERE id = ANY($1)',
            [ids]);

        // La fonction ANY ne garantie pas d'ordre on va donc s'assurer de regroupe
        // nos categorie sous la forme d'une tableau
        const data = ids.map(id => {
            // Je prend le tableau d'id qui m'est passé en paramètre
            // je cherche dans le résultat de ma requête SQL
            // les categories correspondantes histoire d'assurer l'ordre
            return result.rows.find( author => author.id == id);
        });

        return data;
    });

    commentsByProjectLoader = new DataLoader(async (ids) => {

        console.log('Running batch function projectsByAuthor with', ids);

        const result = await this.client.query(
            'SELECT * FROM comments WHERE project_id = ANY($1)',
            [ids]);

        // La fonction ANY ne garantie pas d'ordre on va donc s'assurer de regroupe
        // nos post sous la forme d'une tableau
        const data = ids.map(id => {
            // Je prend le tableau d'id qui m'est passé en paramètre
            // je cherche dans le résultat de ma requête SQL
            // les categories correspondantes histoire d'assurer l'ordre
            return result.rows.filter( comment => comment.project_id == id);
        });

        // Ici je dois renvoyer :
        // [
        //    [la liste des post de category_id 4 ],
        //    [la liste des post de category_id 3 ],
        //    [la liste des post de category_id 5 ]
        // ]
        return data;
    });
}

module.exports = CommentDataSource;