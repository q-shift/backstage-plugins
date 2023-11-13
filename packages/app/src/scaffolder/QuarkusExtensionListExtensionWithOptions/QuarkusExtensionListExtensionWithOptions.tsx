import { FieldExtensionComponentProps, makeFieldSchemaFromZod } from "@backstage/plugin-scaffolder";
import { z } from 'zod';
import QuarkusExtensionList from "../QuarkusExtensionList/QuarkusExtensionListExtension";

export const QuarkusExtensionListExtensionWithOptionsSchema = makeFieldSchemaFromZod(
  z.array(
    z.string()
  )
);


export const QuarkusExtensionListExtensionWithOptions = ({
  onChange,
  rawErrors,
  required,
  formData,
}: FieldExtensionComponentProps<string, { focused?: boolean }>) => {
  return (
    <QuarkusExtensionList/>
  );
};
