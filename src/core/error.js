

syncio.error = {

    // REQUEST_UNIQUE: 'The id of the request should be unique (incrementing numericaly) for every request',

	SYNC_MUST_BE_OBJECT: 'The property "object" of the method sync() only accept Objects',
	SYNC_NO_REPEAT: 'You can not sync the same object with different names',
    SYNC_NO_INNER: 'Syncio can not sync objects that are inside into another objects already synced',
	SYNC_NO_INSTANCED: 'Seems like this object is already registered in other instance of syncio. Object sync must be unique',
};