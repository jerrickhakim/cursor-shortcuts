# Development Guide

This guide is for developers working on the Cursor File Shortcuts CLI tool.

## Local Development

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Link for local testing:

   ```bash
   sudo npm run link
   ```

3. Test the CLI:

   ```bash
   s list
   s playground:save
   ```

4. Unlink when done:
   ```bash
   sudo npm run unlink
   ```

### Alternative: Direct execution

If you prefer not to use sudo, you can run the CLI directly:

```bash
node index.js list
node index.js playground:save
```

### Testing

```bash
npm test
```

This runs `node index.js list` to verify the CLI works.

### Publishing

1. Update version in `package.json`
2. Run tests: `npm test`
3. Publish: `npm publish` or `./publish.sh`

## File Structure

- `index.js` - Main CLI tool
- `package.json` - npm package configuration
- `README.md` - User documentation
- `example-shortcuts.json` - Example shortcuts file
- `publish.sh` - Publishing script
- `.gitignore` - Git ignore rules
- `.npmignore` - npm ignore rules
