import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { z } from 'zod';
import { clone }  from 'isomorphic-git';
import http  from 'isomorphic-git/http/node';
import { resolveSafeChildPath } from '@backstage/backend-common';

const axios = require('axios');
const os = require('os');
const path = require('path');
var JSZip = require("jszip");

export const cloneQuarkusQuickstart = () => {
  return createTemplateAction({
    id: 'quarkus:quickstart:clone',
    schema: {
      input: z.object({
        values: z.object({
          groupId: z.string().optional().describe('The groupId'),
          artifactId: z.string().optional().describe('The artifactId'),
          version: z.string().optional().describe('The version'),
          quickstartName: z.string().describe('The name of the quickstart'),
        }),
      }),
    },

    async handler(ctx) {
      ctx.createTemporaryDirectory().then((tempDir) => {
        const cloneDir = path.join(tempDir, 'downloaded.zip');
        clone({
          fs,
          http,
          dir: cloneDir,
          url: `https://github.com/quarkusio/quarkus-quickstarts.git`,
          noTags: true,
          singleBranch: true, // Optional: Only clone a single branch (default is false)
        }).then(() => {
            //Copy all files from cloneDir to outputDir
            const quickstartDir = path.join(cloneDir, ctx.input.values.quickstartName);
            fs.copySync(quickstartDir, ctx.workspacePath);
            //replace the artifactId in the pom.xml
            const pomPath = path.join(outputDir, 'pom.xml');
            const xml = fs.readFileSync(pomPath, 'utf8');
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');
            doc.getElementsByTagName('groupId')[0].textContent = ctx.input.values.groupId;
            doc.getElementsByTagName('artifactId')[0].textContent = ctx.input.values.artifactId;
            doc.getElementsByTagName('version')[0].textContent = ctx.input.values.version;
            //write doc as XML back to file
            fs.writeFileSync(pomPath, doc.documentElement.outerHTML);
        });
      });
    },
  });
};

export const createQuarkusApp = () => {
  return createTemplateAction({
    id: 'quarkus:app:create',
    schema: {
      input: z.object({
        values: z.object({
          groupId: z.string().optional().describe('The groupId'),
          artifactId: z.string().optional().describe('The artifactId'),
          version: z.string().optional().describe('The version'),
          buildTool: z.enum(['MAVEN', 'GRADLE', 'GRADLE_KOTLIN_DSL']).optional().describe('The buildTool to use'),
          extensions: z.array(z.string()).optional().describe('The extensions'),
          javaVersion: z.string().optional().describe('The java version'),
          targetPath: z.string().optional().describe('The target path'),
        }),
      }),
    },

    async handler(ctx) {
      const apiUrl = 'https://code.quarkus.io/api/download'; // Replace with your API endpoint
      const postData = {
        groupId: ctx.input.values.groupId ? ctx.input.values.groupId : 'org.amce',
        artifactId: ctx.input.values.artifactId ? ctx.input.values.artifactId : 'code-with-quarkus',
        version: ctx.input.values.version ? ctx.input.values.version : '1.0.0-SNAPSHOT',
        buildTool: ctx.input.values.buildTool ? ctx.input.values.buildTool : 'MAVEN',
        javaVersion: ctx.input.values.javaVersion ? ctx.input.values.javaVersion : '11',
        extensions: ctx.input.values.extensions ? ctx.input.values.extensions : []
      };

      var appDirName = ctx.input.values.artifactId ? ctx.input.values.artifactId : 'code-with-quarkus';
      const headers = {
        'Content-Type': 'application/json', // Adjust as needed
      };

      await axios
      .post(apiUrl, postData, { responseType: 'arraybuffer', headers })
      .then((response) => {
        if (response.status === 200 && response.headers['content-type'] === 'application/zip') {
          const zipData = response.data;
          ctx.createTemporaryDirectory().then((tempDir) => {
            const targetPath = ctx.input.targetPath ?? './';
            const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);

            const zipFilePath = path.join(tempDir, 'downloaded.zip');
            fs.writeFileSync(zipFilePath, zipData);

            fs.readFile(zipFilePath, function(err, data) {
              if (!err) {
                var zip = new JSZip();
                zip.loadAsync(data).then(function(contents) {
                  Object.keys(contents.files).forEach(function(filename) {
                    var zipFile = zip.file(filename);
                    if (zipFile) {
                      zipFile.async('nodebuffer').then(function(content) {
                        //if filename starts with code-with-quarkus directory remove it
                        if (filename.startsWith(appDirName)) {
                          filename = filename.replace(appDirName + '/', '');
                        }
                        var dest = path.join(outputDir, filename);
                        //Create directories if needed
                        fs.promises.mkdir(path.dirname(dest), { recursive: true }).then(() => {
                          fs.writeFileSync(dest, content);
                        })
                      });
                    }
                  });
                });
              }
            });
          });
        } 
      }) .catch((error) => {
        console.error('Error making HTTP POST request:', error);
      });
    },
  });
};
