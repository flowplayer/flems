const fs = require('fs')
    , rollup = require('rollup')
    , commonjs = require('rollup-plugin-commonjs')
    , nodeResolve = require('rollup-plugin-node-resolve')
    , uglify = require('rollup-plugin-uglify')


module.exports = rollup.rollup({
  input: 'src/srcdoc/index.js',
  plugins: [
    nodeResolve({
      browser: true
    }),
    commonjs(),
    //buble(),
    uglify.uglify({ mangle: { reserved: ['flemsLoadScript'] }, compress: true })
  ]
})
.then(bundle => bundle.generate({ format: 'iife' }))
.then(({ output: [runtime] }) => {
  fs.writeFileSync('dist/runtime.js', runtime.code)
  fs.writeFileSync('dist/runtime.html', [
    '<!DOCTYPE html>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<script type="text/javascript" charset="UTF-8">',
    '\t' + runtime.code + '//# sourceURL=runtime.js',
    '</script>'
  ].join('\n'))
})
