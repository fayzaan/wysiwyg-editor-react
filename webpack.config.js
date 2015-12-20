module.exports = {
	entry: "./example/index.js",
	output: {
		path: './example',
		filename: 'bundle.js',
		publicPath: '/'
	},
	devServer: {
		inline: true,
		contentBase: './example',
		port: 3333
	},
	module: {
		loaders: [
		{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			loader: 'babel',
			query: {
				presets: [ 'es2015', 'react' ]
			}
		}]
	}
};