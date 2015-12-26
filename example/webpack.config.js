module.exports = {
	entry: "./index.jsx",
	output: {
		path: '/',
		filename: 'bundle.js',
		publicPath: '/'
	},
	devServer: {
		inline: true,
		contentBase: './',
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