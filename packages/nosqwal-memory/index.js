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

                    const toSave = Object.assign({}, doc, {
                        id
                    });

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
                            const updatedDoc = Object.assign({}, newDoc, {
                                $loki: oldDoc.$loki,
                                meta: oldDoc.meta
                            });

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
                    return Promise.resolve()
                    .then(() => {
                        // NOTE: node@4 doesn't support spead opperator by default
                        options = options || {};
                        const where = options.where || {};
                        const orderBy = options.orderBy || [];
                        const limit = options.limit;
                        const offset = options.offset || 0;

                        let query = collection.chain();

                        if (orderBy.length > 0) {
                            const lokiOrderBy = orderBy.map(x => {
                                const isAsc = x[1] != null && !x[1];
                                return [x[0], isAsc];
                            });

                            query = query.compoundsort(lokiOrderBy);
                        }

                        /* where = Object.keys(where).reduce((prev, key) => {
                            return Object.assign({
                                [key.replace('[]', '')]: where[key]
                            }, prev);
                        }, {}); */

                        Object.keys(where).forEach(key => {
                            const operator = Object.keys(where[key])[0];

                            if (!['$eq', '$contains'].includes(operator)) {
                                throw new Error(`Operator: ${operator} not handled`);
                            }

                            query = query.find({
                                [key]: {
                                    [operator]: where[key][operator]
                                }
                            });
                        });

                        query = query.offset(offset);

                        if (limit != null) {
                            query = query.limit(limit);
                        }

                        const docs = query.data();

                        return docs;
                    });
                }
            };
        }
    };
};
