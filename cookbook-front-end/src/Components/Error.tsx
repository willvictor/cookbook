import React from "react";
import { Alert, AlertTitle } from "@material-ui/lab";

export interface Props {
  errorMessage: string;
}

const Error = (props: Props) => {
  return (
    <Alert severity="error">
      <AlertTitle>Something went wrong!</AlertTitle>
      {props.errorMessage}
    </Alert>
  );
};

export default Error;
