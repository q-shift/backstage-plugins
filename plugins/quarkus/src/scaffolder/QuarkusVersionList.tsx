import React from 'react';
import {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import {FieldExtensionComponentProps} from "@backstage/plugin-scaffolder-react";

/* Example returned by code.quarkus.io/api/streams
{
    "javaCompatibility": {
      "recommended": 17,
      "versions": [
        17,
        21
      ]
    },
    "key": "io.quarkus.platform:3.8",
    "lts": false,
    "platformVersion": "3.8.2",
    "quarkusCoreVersion": "3.8.2",
    "recommended": true,
    "status": "FINAL"
  }
 */
export interface Version {
    key: string;
    quarkusCoreVersion: string;
    platformVersion: string;
    lts: boolean;
    recommended: boolean;
    javaCompatibility: javaCompatibility[];
    status: string;
}

export interface javaCompatibility {
    recommended: boolean;
    versions: string[];
}

function userLabel(v: Version) {
    const key = v.key.split(":")
    if (v.recommended) {
        return `${key[1]} (RECOMMENDED)`;
    } else if (v.status !== "FINAL") {
        return `${key[1]} (${v.status})`;
    } else {
        return key[1];
    }
}

// TODO: Review the logic of this code against this backstage similar example to see if we can improve it:
// https://github.com/backstage/backstage/blob/master/plugins/scaffolder/src/components/fields/EntityTagsPicker/EntityTagsPicker.tsx
export const QuarkusVersionList = (props: FieldExtensionComponentProps<string>) => {
    const {
        onChange,
        rawErrors,
        required,
        formData,
        idSchema,
        placeholder,
    } = props;

    const [quarkusVersion, setQuarkusVersion] = useState<Version[]>([]);
    const [defaultQuarkusVersion, setDefaultQuarkusVersion] = useState<Version>();

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiStreamsUrl = `${codeQuarkusUrl}/api/streams`

    const fetchData = async () => {
        const response = await fetch(apiStreamsUrl);
        const newData = await response.json();
        setQuarkusVersion(newData)
    }

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(() => {
        quarkusVersion.forEach(v => {
            if (v.recommended) {
                setDefaultQuarkusVersion({...v})
                // @ts-ignore: TS2345: Argument of type 'string[]' is not assignable to parameter of type 'string'.
                onChange([v.key]);
            }
        });
    }, [quarkusVersion]);

    function onSelectVersion(_: React.ChangeEvent<{}>, v: Version | null) {
        // @ts-ignore: TS2345: Argument of type 'string[]' is not assignable to parameter of type 'string'.
        onChange([v.key]);
    }

    if (defaultQuarkusVersion) {
        return (
            <FormControl
                margin="normal"
                required={required}
                error={rawErrors?.length > 0 && !formData}
            >
                <Autocomplete
                    id="quarkus-versions"
                    options={quarkusVersion}
                    getOptionSelected={(option, value) => option.key === value.key}
                    getOptionLabel={(quarkusVersion) => userLabel(quarkusVersion)}
                    defaultValue={defaultQuarkusVersion}
                    onChange={onSelectVersion}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            id={idSchema?.$id}
                            label="Select a quarkus version"
                            required={required}
                            placeholder={placeholder}
                        />
                    )}
                />
            </FormControl>)
    }

    return (<div>Waiting to get the default Quarkus version ...</div>)
}

export default QuarkusVersionList;
