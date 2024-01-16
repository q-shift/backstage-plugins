import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
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
          input: {
              type: 'object',
              properties: {
                  groupId: {
                      title: 'groupId',
                      description: 'The maven groupId',
                      type: 'string'
                  },
                  artifactId: {
                      title: 'artifactId',
                      description: 'The maven artifactId',
                      type: 'string'
                  },
                  version: {
                      title: 'version',
                      description: 'The maven version',
                      type: 'string'
                  },
                  targetPath: {
                      title: 'targetPath',
                      description: 'The targetPath under the workspace',
                      type: 'string'
                  },
                  additionalProperties: {
                      title: 'additionalProperties',
                      description: 'Quarkus properties to be added to src/main/resources/application.properties',
                      type: 'string'
                  },
                  quickstartName: {
                      title: 'quickstartName',
                      description: 'The name of the quickstart github project to be cloned',
                      type: 'string'
                  },
                  database: {
                      title: 'database',
                      description: 'The backend database to be connected for Hibernate, Panache, JPA, etc extensions',
                      type: 'string'
                  },
                  infoEndpoint: {
                      title: 'infoEndpoint',
                      description: 'The information endpoint',
                      type: 'boolean'
                  },
                  healthEndpoint: {
                      title: 'healthEndpoint',
                      description: 'The health endpoint',
                      type: 'boolean'
                  },
                  metricsEndpoint: {
                      title: 'metricsEndpoint',
                      description: 'The metrics endpoint',
                      type: 'boolean'
                  },
              },
          },
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
