import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { QuarkusApplicationInfo, QuarkusConsolePlugin } from "../src/index";
import { CatalogEntityPage } from '@backstage/plugin-catalog';

createDevApp()
    .registerPlugin(QuarkusConsolePlugin)
    .addPage({
        element: <QuarkusApplicationInfo />,
        title: "Root Page",
        path: "/quarkus",
    })
    .addPage({ element: <CatalogEntityPage /> })
    .render();