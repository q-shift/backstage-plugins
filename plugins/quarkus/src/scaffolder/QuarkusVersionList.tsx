import React from 'react';
import {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";

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

export function QuarkusVersionList() {
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
      }
    });
  }, [quarkusVersion]);

  if (defaultQuarkusVersion) {
    return (
        <Autocomplete
            id="quarkus-versions"
            options={quarkusVersion}
            getOptionSelected={(option, value) => option.key === value.key}
            getOptionLabel={(quarkusVersion) => userLabel(quarkusVersion)}
            defaultValue={defaultQuarkusVersion}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Select a quarkus version"
                    size="small"
                />
            )}
        />)
  }

  return (<div>Waiting to get the default Quarkus version ...</div>)
}

export default QuarkusVersionList;
