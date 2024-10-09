import React, { useEffect } from "react";

export default function Homepage({ setActiveItem }) {
  useEffect(() => {
    setActiveItem("home");
  }, []);
  return <div>Homepage</div>;
}
