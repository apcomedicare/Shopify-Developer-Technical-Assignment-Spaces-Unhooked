import fs from "fs";
import copy from "recursive-copy";
import path from "path"; // Import path module for path operations

import {
  gitIgnoreAdd,
  jsComment,
  overwriteMessage,
  flattenPath,
} from '../utils/index.js';

export const copyJS = ({ path: srcPath, isDirectory = false }) => {  
  try {
    /**
     * Check if a file already exists in theme/assets
     */
    const themeFilePath = path.join("theme/assets", flattenPath(srcPath, 'scripts'));
    const data = fs.readFileSync(themeFilePath, 'utf-8');

    /**
     * Check if the file is compiled/uncompiled
     */
    if (!data.toString().includes(jsComment)) {
      console.warn(`${overwriteMessage} Check '${srcPath}'`)
      return; // exit
    }
  } catch (e) {
    // File does not exist in theme/assets
  }

  /**
   * Begin Copying
   */
  copy(srcPath, "theme/assets", {
    overwrite: true,
    junk: true,
    ...(isDirectory
      ? {
          filter: ["**/*.js"],
        }
      : {}),
    ...(isDirectory
      ? {
          /**
           * Run during build for each file
           */
          rename: (filePath) => {
            const outputPath = path.join("assets", flattenPath(filePath, 'scripts'));

            // Add the file's theme/assets path file to .gitignore
            gitIgnoreAdd(path.join("theme", outputPath));

            return outputPath;
          },
        }
      : {
          rename: (filePath) => {
            /**
             * Run during watch on one file
             * 
             * Get filename from path passed
             * src/scripts/example.js -> component-example.js
             */
            const fileName = path.basename(srcPath);
            

            const folderName = path.basename(path.dirname(srcPath));

            const newFileName = `${folderName}-${fileName}`; // Renaming logic

            const outputPath = path.join("assets", flattenPath(srcPath, 'scripts'), newFileName);

            // Add the file's theme/assets path file to .gitignore
            gitIgnoreAdd(path.join("theme", outputPath));
            
            console.log(`📦 '${srcPath}' 📮 '${newFileName}' | Folder :- '${folderName}'`);

            return newFileName;
          },
        }),
  })
    .then((results) => {
      results.forEach(result => {
        // Get the contents of the file
        const data = fs.readFileSync(result.dest, 'utf-8');

        if (data) {
          // Prepend the message to the top of the file
          fs.writeFileSync(result.dest, `${jsComment}\r\n\r\n${data}`, 'utf-8');
        }
      });
    })
    .catch((error) => {
      console.error("Copy failed: " + error);
    });
};

// Example usage:
copyJS({
  path: "./src/scripts/example.js", // Example path to a single file
});
