import React from "react";
import { createDevApp } from "@backstage/dev-utils";
import { QuarkusApplicationInfo, QuarkusConsolePlugin } from "../src/index";

createDevApp()
    .registerPlugin(QuarkusConsolePlugin)
    .addPage({
        element: <QuarkusApplicationInfo />,
        title: "Root Page",
        path: "/quarkus",
    })
    .render();