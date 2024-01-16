import {createTemplateAction} from '@backstage/plugin-scaffolder-node';
import fs from 'fs-extra';
import {resolveSafeChildPath} from '@backstage/backend-common';
import axios from 'axios';
import path from 'path';
import JSZip from 'jszip';
import {examples} from "./createApp.example";

export const createQuarkusApp = () => {
    return createTemplateAction<{ url: string; targetPath: string, values: any }>({
        id: 'quarkus:app:create',
        description: 'Generates a Quarkus application using code.quarkus.io and extensions selected',
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
                    buildTool: {
                        title: 'buildTool',
                        description: 'The java buildTool to be used: maven, gradle or gradle-kotlin-dsl',
                        type: 'string',
                        enum: ['MAVEN', 'GRADLE', 'GRADLE_KOTLIN_DSL'],
                    },
                    javaVersion: {
                        title: 'javaVersion',
                        description: 'The JDK version (e.g: 11)',
                        type: 'string'
                    },
                    targetPath: {
                        title: 'targetPath',
                        description: 'The targetPath under the workspace',
                        type: 'string'
                    },
                    extensions: {
                        title: 'extensions',
                        description: 'The Quarkus extensions to be added to the project generated',
                        type: 'array',
                        items: {
                            type: 'string',
                        },
                    },
                    additionalProperties: {
                        title: 'additionalProperties',
                        description: 'Quarkus properties to be added to src/main/resources/application.properties',
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
            const apiUrl = 'https://code.quarkus.io/api/download'; // Replace with your API endpoint
            const postData = {
                groupId: ctx.input.values.groupId ? ctx.input.values.groupId : 'org.amce',
                artifactId: ctx.input.values.artifactId ? ctx.input.values.artifactId : 'code-with-quarkus',
                version: ctx.input.values.version ? ctx.input.values.version : '1.0.0-SNAPSHOT',
                buildTool: ctx.input.values.buildTool ? ctx.input.values.buildTool : 'MAVEN',
                javaVersion: ctx.input.values.javaVersion ? ctx.input.values.javaVersion : '11',
                extensions: ctx.input.values.extensions ? ctx.input.values.extensions : [],
                database: ctx.input.values.database ? ctx.input.values.database : 'PostgreSQL',
                infoEndpoint: ctx.input.values.infoEndpoint ? ctx.input.values.infoEndpoint : 'true',
                healthEndpoint: ctx.input.values.healthEndpoint ? ctx.input.values.healthEndpoint : 'true',
                metricsEndpoint: ctx.input.values.metricsEndpoint ? ctx.input.values.metricsEndpoint : 'true',
            };

            const appDirName = ctx.input.values.artifactId ? ctx.input.values.artifactId : 'code-with-quarkus';
            const headers = {
                'Content-Type': 'application/json', // Adjust as needed
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
            };

            await axios
                .post(apiUrl, postData, {responseType: 'arraybuffer', headers})
                .then((response) => {
                    if (response.status === 200 && response.headers['content-type'] === 'application/zip') {
                        const zipData = response.data;
                        const targetPath = ctx.input.values.targetPath ?? './';
                        const outputDir = resolveSafeChildPath(ctx.workspacePath, targetPath);
                        ctx.createTemporaryDirectory().then((tempDir) => {

                            const zipFilePath = path.join(tempDir, 'downloaded.zip');
                            fs.writeFileSync(zipFilePath, zipData);

                            fs.readFile(zipFilePath, function (err, data) {
                                if (!err) {
                                    const zip = new JSZip();
                                    zip.loadAsync(data).then(function (contents) {
                                        Object.keys(contents.files).forEach(function (filename) {
                                            const zipFile = zip.file(filename);
                                            if (zipFile) {
                                                zipFile.async('nodebuffer').then(function (content) {
                                                    // if filename starts with code-with-quarkus directory remove it
                                                    if (filename.startsWith(appDirName)) {
                                                        filename = filename.replace(appDirName + '/', '');
                                                    }
                                                    const dest = path.join(outputDir, filename);
                                                    // Create directories if needed
                                                    fs.promises.mkdir(path.dirname(dest), {recursive: true}).then(() => {
                                                        fs.writeFileSync(dest, content);
                                                    })
                                                });
                                            }
                                        });
                                    });
                                }
                            });
                        });
                        // If present, append additional properties to src/main/resources/application.properties
                        if (ctx.input.values.additionalProperties) {
                            const propertiesPath = path.join(outputDir, 'src/main/resources/application.properties');
                            const propertiesContent = fs.readFileSync(propertiesPath, 'utf8');
                            const updatedPropertiesContent = `${propertiesContent}\n${ctx.input.values.additionalProperties}`;
                            fs.writeFileSync(propertiesPath, `${updatedPropertiesContent}`);
                        }
                    }
                }).catch((error) => {
                    console.error('Error making HTTP POST request:', error);
                });
        },
    });
};
