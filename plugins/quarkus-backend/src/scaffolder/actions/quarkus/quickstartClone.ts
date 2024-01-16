import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import { z } from 'zod';
import { clone }  from 'isomorphic-git';
import http  from 'isomorphic-git/http/node';
import { resolveSafeChildPath } from '@backstage/backend-common';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import path from 'path';
import {examples} from "./quickstartClone.example";

export const cloneQuarkusQuickstart = () => {
  return createTemplateAction<{ url: string; targetPath: string, values: any }>({
    id: 'quarkus:quickstart:clone',
    description: 'Clones a Quarkus quickstart project from: https://github.com/quarkusio/quarkus-quickstarts',
    examples,
    schema: {
      input: z.object({
        values: z.object({
          groupId: z.string().optional().describe('The groupId'),
          artifactId: z.string().optional().describe('The artifactId'),
          version: z.string().optional().describe('The version'),
          quickstartName: z.string().describe('The name of the quickstart'),
          targetPath: z.string().optional().describe('The target path'),
          additionalProperties: z.string().optional().describe('Additional properties'),
          database: z.string().optional().describe('The database to use'),
          infoEndpoint: z.boolean().optional().describe('The info endpoint'),
          healthEndpoint: z.boolean().optional().describe('The health endpoint'),
          metricsEndpoint: z.boolean().optional().describe('The metrics endpoint'),
        }),
      }),
    },

    async handler(ctx) {
      const targetPath = ctx.input.values.targetPath ?? './';
      const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);
      const groupId = ctx.input.values.groupId;
      const artifactId = ctx.input.values.artifactId;
      const version = ctx.input.values.version;
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
            // Copy all files from cloneDir to outputDir
            const quickstartDir = path.join(cloneDir, ctx.input.values.quickstartName);
            fs.copySync(quickstartDir, ctx.workspacePath);
            // replace the artifactId in the pom.xml
            const pomPath = path.join(outputDir, 'pom.xml');
            const xml = fs.readFileSync(pomPath, 'utf8');
            const parser = new DOMParser();
            const doc = parser.parseFromString(xml, 'text/xml');
            if(groupId!==undefined) {
              doc.getElementsByTagName('groupId')[0].textContent = groupId;
            }
            if(artifactId!==undefined) {
              doc.getElementsByTagName('artifactId')[0].textContent = artifactId;
            }
            if(version!==undefined) {
              doc.getElementsByTagName('version')[0].textContent = version;
            }
            const serializer = new XMLSerializer();
            // write doc as XML back to file
            fs.writeFileSync(pomPath, serializer.serializeToString(doc));

            // If present, append additional properties to src/main/resources/application.properties
            if (ctx.input.values.additionalProperties) {
              const propertiesPath = path.join(outputDir, 'src/main/resources/application.properties');
              const propertiesContent = fs.readFileSync(propertiesPath, 'utf8');
              const updatedPropertiesContent = `${propertiesContent}\n${ctx.input.values.additionalProperties}`;
              fs.writeFileSync(propertiesPath, `${updatedPropertiesContent}`);
            }
        });
      });
    },
  });
};
