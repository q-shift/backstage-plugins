import {TemplateExample} from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
    {
        description: 'Generate a quarkus application using code.quarkus.io',
        example: yaml.stringify({
            steps: [
                {
                    action: 'quarkus:app:create',
                    id: 'quarkus-app-create',
                    name: 'Create a Quarkus app',
                    input: {
                        values: {
                            streamKey: 'io.quarkus.platform:3.8',
                            groupId: 'io.quarkus',
                            artifactId: 'cool-demo',
                            version: '1.0',
                            buildTool: 'MAVEN',
                            javaVersion: '17',
                            infoEndpoint: 'true',
                            extensions: ['quarkus-resteasy-reactive-jackson', 'quarkus-kubernetes', 'io.quarkus:quarkus-hibernate-orm-panache'],
                            starterCode: 'true'
                        },
                    },
                },
            ],
        }),
    },
];
