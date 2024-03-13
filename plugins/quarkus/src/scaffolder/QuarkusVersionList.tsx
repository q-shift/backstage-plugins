import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

export type Item = {
  label: string;
  value: string | number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

type SelectComponentProps = {
  value: string;
  items: Item[];
  label: string;
  onChange: (value: string) => void;
  defaultValue: string | null | undefined;
};

const renderItems = (items: Item[]) => {
  return items.map(item => {
    return (
      <MenuItem value={item.value} key={item.label}>
        {item.label}
      </MenuItem>
    );
  });
};

interface QuarkusVersionType {
  id: string
}

const QuarkusVersions: QuarkusVersionType[] = [];
export const QuarkusVersionList = ({
  value,
  items,
  label,
  onChange,
}: SelectComponentProps): JSX.Element => {
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const val = event.target.value as string;
    onChange(val);
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      disabled={items.length === 0}
    >
      <InputLabel>{label}</InputLabel>
      <Select label={label} value={value} onChange={handleChange}>
        {renderItems(items)}
      </Select>
    </FormControl>
  );
};
