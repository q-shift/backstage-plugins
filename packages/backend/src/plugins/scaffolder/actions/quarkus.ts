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
        quickstartName: z
        .string()
        .describe('The name of the quickstart'),
      }),
    },

    async handler(ctx) {
      await clone({
        fs,
        http,
        dir: `./kafka-quickstart`,
        url: `https://github.com/quarkusio/quarkus-quickstarts.git`,
        noTags: true,
        singleBranch: true, // Optional: Only clone a single branch (default is false)
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
        }),
        targetPath: z.string().optional().describe('The target path'),
      }),
    },

    async handler(ctx) {

      const apiUrl = 'https://code.quarkus.io/api/download'; // Replace with your API endpoint
      const postData = {
        // Your POST data here
      };

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
                        if (filename.startsWith('code-with-quarkus')) {
                          filename = filename.replace('code-with-quarkus/', '');
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
