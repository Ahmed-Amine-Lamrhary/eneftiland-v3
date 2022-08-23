import React from "react";

export function withRouter(Component: any) {
  return function withRouter(props: any) {
    return <Component {...props} />;
  };
}
