import React, { useEffect } from "react";
import styles from "./index.module.less";
export const ReactFileChunk = (props) => {
  const { children } = props;
  useEffect(() => {
    console.log("888888");
  });
  return <div className={styles.name}>{children} </div>;
};
