import React from 'react';
import { QuarkusVersionList } from './QuarkusVersionList';
import { renderInTestApp, TestApiProvider } from "@backstage/test-utils";
import { ScaffolderRJSFFieldProps as FieldProps } from '@backstage/plugin-scaffolder-react';
import { CatalogApi, catalogApiRef } from '@backstage/plugin-catalog-react';
import { Entity } from '@backstage/catalog-model';

describe('<QuarkusVersionList />', () => {
    let entities: Entity[];
    const defaultVersionLabel = '(RECOMMENDED)';

    // const user = userEvent.setup();
    const onChange = jest.fn();
    const required = false;
    const rawErrors: string[] = [];
    const formData = undefined;

    const catalogApi: jest.Mocked<CatalogApi> = {
        getLocationById: jest.fn(),
        getEntityByName: jest.fn(),
        getEntities: jest.fn(async () => ({ items: entities })),
        addLocation: jest.fn(),
        getLocationByRef: jest.fn(),
        removeEntityByUid: jest.fn(),
    } as any;

    let props: FieldProps<string>;
    let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

    beforeEach( () => {
        Wrapper = ({ children }: { children?: React.ReactNode }) => (
            <TestApiProvider apis={[[catalogApiRef, catalogApi]]}>
                {children}
            </TestApiProvider>
        );
    });
    afterEach(() => jest.resetAllMocks());

    describe('without changes', () => {
        beforeEach(() => {
            props = {
                onChange,
                required,
                rawErrors,
                formData,
            } as unknown as FieldProps;
        });

        it('should get the default value including (RECOMMENDED)', async () => {
            const rendered = await renderInTestApp(
                <Wrapper>
                    <QuarkusVersionList {...props}/>
                </Wrapper>
            );
            // user.selectOptions()
            await new Promise((r) => setTimeout(r, 2000));
            expect(rendered.findByText(defaultVersionLabel));
        });

    });
});