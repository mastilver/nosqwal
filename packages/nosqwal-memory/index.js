'use strict';

const cuid = require('cuid');
const Loki = require('lokijs');

module.exports = function () {
    const db = new Loki();

    return {
        defineCollection(collectionName) {
            const collection = db.addCollection(collectionName);

            return {
                create(doc) {
                    const id = cuid();

                    const toSave = Object.assign({
                        id
                    }, doc);

                    collection.insert(toSave);
                    return Promise.resolve(toSave);
                },

                get(id) {
                    const doc = collection.findOne({
                        id
                    });

                    if (doc == undefined) {
                        return Promise.reject(new Error(`Could not find document with id: ${id}`));
                    }

                    return Promise.resolve(Object.assign({}, doc));
                },

                update(newDoc) {
                    return this.get(newDoc.id)
                        .then(oldDoc => {
                            const updatedDoc = Object.assign({}, newDoc);
                            updatedDoc.$loki = oldDoc.$loki;

                            collection.update(updatedDoc);
                            return updatedDoc;
                        });
                },

                delete(id) {
                    return this.get(id)
                        .then(doc => {
                            collection.remove(doc.$loki);
                        });
                },

                query(options) {
                    // NOTE: node@4 doesn't support spead opperator by default
                    options = options || {};
                    const where = options.where;
                    const orderBy = options.orderBy || [];
                    const limit = options.limit;
                    const offset = options.offset || 0;

                    let query = collection.chain();

                    if (orderBy.length > 0) {
                        const lokiOrderBy = orderBy.map(x => [x[0], !x[1]]);

                        query = query.compoundsort(lokiOrderBy);
                    }

                    query = query.offset(offset);

                    if (limit != null) {
                        query = query.limit(limit);
                    }

                    const docs = query
                                .find(where)
                                .data();

                    return Promise.resolve(docs);
                }
            };
        }
    };
};
