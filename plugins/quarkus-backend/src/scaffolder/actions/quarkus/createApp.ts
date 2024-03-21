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
                    quarkusVersion: {
                        title: 'quarkusVersion',
                        description: 'The version of the quarkus framework',
                        type: 'string'
                    },
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
                    starterCode: {
                        title: 'starterCode',
                        description: 'Generate for the project some code to start ?',
                        type: 'boolean'
                    }
                },
            },
        },

        async handler(ctx) {
            const apiUrl = 'https://code.quarkus.io/api/download'; // Replace with your API endpoint
            const allExtensions = ctx.input.values.extensions ? ctx.input.values.extensions : [];
            let noCode: string = "false";

            if (ctx.input.values.infoEndpoint) {
                allExtensions.push('quarkus-info');
            }

            if (ctx.input.values.metricsEndpoint) {
                allExtensions.push('quarkus-micrometer');
                allExtensions.push('quarkus-micrometer-registry-prometheus');
            }

            if (ctx.input.values.healthEndpoint) {
                allExtensions.push('quarkus-smallrye-health');
            }

            if (ctx.input.values.database && ctx.input.values.database !== 'none') {
                allExtensions.push(ctx.input.values.database);
            }
            // If the starterCode is true, then the value passed to "noCode" will be "false"
            // to generate the starter code, otherwise "noCode" will be equal to "true"
            if (! ctx.input.values.starterCode) {
                noCode = "true";
            }
            const postData = {
                streamKey: ctx.input.values.quarkusVersion ? ctx.input.values.quarkusVersion : 'io.quarkus.platform:3.8',
                groupId: ctx.input.values.groupId ? ctx.input.values.groupId : 'org.acme',
                artifactId: ctx.input.values.artifactId ? ctx.input.values.artifactId : 'code-with-quarkus',
                version: ctx.input.values.version ? ctx.input.values.version : '1.0.0-SNAPSHOT',
                buildTool: ctx.input.values.buildTool ? ctx.input.values.buildTool : 'MAVEN',
                javaVersion: ctx.input.values.javaVersion ? ctx.input.values.javaVersion : '17',
                extensions: allExtensions,
                noCode: noCode
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
