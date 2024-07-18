const path = require('path');

module.exports = {
  entry: './src/index.js',  // تأكد من تعديل مسار نقطة الدخول لمشروعك
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      // قواعد أخرى لتحميل الملفات المختلفة مثل JS, CSS, إلخ.
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.node'],
  },
};