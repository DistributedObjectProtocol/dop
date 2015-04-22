

syncio.scope.create = function( name, data_scope, data_client ) {

	var scope = {

		app: this,

		name: name,

		data: data_scope,

		data_client: data_client,

		clients: []

	};

	scope.index = this.scope.push(scope)-1;

	this.scope_name.push(name);

	return scope;

};
