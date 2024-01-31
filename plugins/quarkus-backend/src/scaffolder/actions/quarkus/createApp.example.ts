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
                            groupId: 'io.quarkus',
                            artifactId: 'cool-demo',
                            version: '1.0',
                            javaVersion: '11',
                            buildTool: 'MAVEN',
                            quickstartName: 'quarkus-getting-started',
                            extensions: ['quarkus-resteasy-reactive-jackson', 'quarkus-kubernetes', 'io.quarkus:quarkus-hibernate-orm-panache'],
                            noCode: 'true'
                        },
                    },
                },
            ],
        }),
    },
];
