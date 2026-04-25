// Inline plugin: rewrites `import.meta.env.X` → `process.env.X` so Vite-style
// env reads work under Jest/Node (which doesn't allow `import.meta` outside ESM).
function transformImportMetaEnv({ types: t }) {
  return {
    name: 'transform-import-meta-env',
    visitor: {
      MemberExpression(path) {
        const obj = path.node.object;
        if (
          obj &&
          obj.type === 'MetaProperty' &&
          obj.meta &&
          obj.meta.name === 'import' &&
          obj.property &&
          obj.property.name === 'meta' &&
          path.node.property &&
          path.node.property.name === 'env'
        ) {
          path.replaceWith(
            t.memberExpression(t.identifier('process'), t.identifier('env'))
          );
        }
      },
    },
  };
}

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [transformImportMetaEnv],
};
