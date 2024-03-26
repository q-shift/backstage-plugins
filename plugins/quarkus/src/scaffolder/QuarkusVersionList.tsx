import React from "react";
import FormControl from "@material-ui/core/FormControl";
import {FieldExtensionComponentProps} from "@backstage/plugin-scaffolder-react";
import {Progress, Select, SelectItem} from "@backstage/core-components";
import useAsync from 'react-use/lib/useAsync';

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

function findRecommendedVersion(versions: Version[]) {
    let recommendedVersion = '';
    versions.forEach((v: Version) => {
        if (v.recommended) {
            recommendedVersion = v.key
        }
    })
    return recommendedVersion;
}

export const QuarkusVersionList = (props: FieldExtensionComponentProps<string>) => {
    const {
        onChange,
        rawErrors,
        required,
        formData,
    } = props;

    const codeQuarkusUrl = 'https://code.quarkus.io';
    const apiStreamsUrl = `${codeQuarkusUrl}/api/streams`

    const {loading, value} = useAsync(async () => {
        const response = await fetch(apiStreamsUrl);
        const newData = await response.json();

        const recommendedVersion = findRecommendedVersion(newData);
        console.log(`Recommended version: ${recommendedVersion}`)
        formData !== undefined ? formData : onChange(recommendedVersion !== '' ? recommendedVersion : newData[0].key);

        return newData;
    });

    const versionItems: SelectItem[] = value
        ? value?.map((i: Version) => ({label: userLabel(i), value: i.key}))
        : [{label: 'Loading...', value: 'loading'}];

    if (loading) {
        return <Progress/>;
    } else {
        return (
            <FormControl
                margin="normal"
                required={required}
                error={rawErrors?.length > 0 && !formData}
            >
                <Select
                    native
                    label="Quarkus versions"
                    onChange={s => {
                        onChange(String(Array.isArray(s) ? s[0] : s))
                    }}
                    selected={formData}
                    items={versionItems}
                />
            </FormControl>)
    }
}

export default QuarkusVersionList;
