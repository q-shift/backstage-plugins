/* eslint-disable no-use-before-define */
import React, { useEffect } from 'react';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import useAutocomplete from '@material-ui/lab/useAutocomplete';
import { FieldProps, FieldValidation } from '@rjsf/core';
import FormControl from '@material-ui/core/FormControl';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  label: {
    display: 'block',
  },
  input: {
    width: 200,
  },
  listbox: {
    width: 200,
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: 'absolute',
    listStyle: 'none',
    backgroundColor: theme.palette.background.paper,
    overflow: 'auto',
    maxHeight: 200,
    border: '1px solid rgba(0,0,0,.25)',
    '& li[data-focus="true"]': {
      backgroundColor: '#4a8df6',
      color: 'white',
      cursor: 'pointer',
    },
    '& li:active': {
      backgroundColor: '#2977f5',
      color: 'white',
    },
  },
}));
export const QuarkusQuickstartPicker =  ({ onChange, rawErrors, required, formData }: FieldProps<string>) => {
  const classes = useStyles();
  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
  } = useAutocomplete({
    id: 'quarkus-quickstarts',
    defaultValue: quarkusQuickstarts[0],
    multiple: false,
    options: quarkusQuickstarts,
    getOptionLabel: (option) => option,
  });

  // Download the Component list
  useEffect(() => {
      axios.get('https://api.github.com/repos/quarkusio/quarkus-quickstarts/contents').then((response) => {
        response.data
        .filter(e => e.type === 'dir' && e.name.endsWith('-quickstart'))
        .forEach(e => {
          quarkusQuickstarts.push(e.name)
        })
      })
  }, []);


  // Populate value changes of autocomplete to the actual field
  useEffect(() => {
    if (value) {
      onChange(value)
    }
  }, [value]);

  return (
    <FormControl
      margin="normal"
      required={required}
      error={rawErrors?.length > 0 && !formData}>
      <div>
          <div {...getRootProps()}>
            <label className={classes.label} {...getInputLabelProps()}>
              Quarkus Quickstart
            </label>
            <input className={classes.input} {...getInputProps()} />
          </div>
          {groupedOptions.length > 0 ? (
            <ul className={classes.listbox} {...getListboxProps()}>
              {groupedOptions.map((option, index) => (
                <li {...getOptionProps({ option, index })}>{option}</li>
              ))}
            </ul>
          ) : null}
      </div>
    </FormControl>
  );
}

const quarkusQuickstarts: string[] = [ ];

export const validateQuarkusQuickstart = (value: string, validation: FieldValidation) => { 
 if (!quarkusQuickstarts.some((quickstart) => quickstart === value)) {
     validation.addError(`Unknown quickstart: ${value}`);
   }
};

export default QuarkusQuickstartPicker;
