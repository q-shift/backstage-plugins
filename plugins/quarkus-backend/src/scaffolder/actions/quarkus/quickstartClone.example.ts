import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
    {
        description:
            'Clones a Quarkus quickstart project from: https://github.com/quarkusio/quarkus-quickstarts.',
        example: yaml.stringify({
            steps: [
                {
                    action: 'quarkus:quickstart:clone',
                    id: 'quarkus-quickstart-clone',
                    name: 'Clone a quickstart project',
                    input: {
                        values: {
                            groupId: 'io.quarkus',
                            artifactId:  'cool-demo',
                            version:  '1.0',
                            quickstartName: 'hibernate-orm-quickstart',
                        },
                    },
                },
            ],
        }),
    },
];
