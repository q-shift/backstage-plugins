import React from 'react';
import {useEffect, useState} from "react";
import {Autocomplete} from "@material-ui/lab";
import {TextField} from "@material-ui/core";

export interface Platform {
  platformKey: string;
  name: string;
  'current-stream-id': string // currentStreamId: string;
}

export interface QuarkusVersion {
  id: string;
  lts: boolean;
}

export function QuarkusVersionList() {
  const [platform, setPlatform] = useState<Platform[]>([]);
  const [quarkusVersion, setQuarkusVersion] = useState<QuarkusVersion[]>([]);

  const [recommendedQuarkusVersion, setRecommendedQuarkusVersion] = useState<string>();
  const [defaultQuarkusVersion, setDefaultQuarkusVersion] = useState<QuarkusVersion>();

  const codeQuarkusUrl = 'https://code.quarkus.io';
  const apiUrl = `${codeQuarkusUrl}/api/platforms`

  const fetchData = async () => {
    const response = await fetch(apiUrl);
    const newData = await response.json();
    setPlatform(newData.platforms)
    setQuarkusVersion(newData.platforms[0].streams)
  }

  useEffect(() => {
    fetchData()
  }, []);

  useEffect(() => {
    platform.forEach(p => {
      // console.log("Platform : " + p.name);
      // console.log("Recommended version is: " + p["current-stream-id"]);
      setRecommendedQuarkusVersion(p["current-stream-id"]);
    });
  }, [platform]);

  useEffect(() => {
    // console.log("Try to match the recommended version: " + recommendedQuarkusVersion);
    quarkusVersion.forEach((v) => {
      // console.log("Quarkus version: " + v.id)
      if (v.id === recommendedQuarkusVersion) {
        setDefaultQuarkusVersion({id: `${v.id} (RECOMMENDED)`, lts: v.lts})
        // defaultQuarkusVersion = v
        // console.log("Quarkus version matches the recommended !")
      }
    })
  }, [recommendedQuarkusVersion]);

  if (defaultQuarkusVersion) {
    return (
        <Autocomplete
            id="quarkus-versions"
            options={quarkusVersion}
            getOptionLabel={(quarkusVersion) => quarkusVersion.id}
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
