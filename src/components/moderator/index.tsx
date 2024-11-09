"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ComponentCreator } from "./ComponentCreator";
import ComponentList from "./ComponentList";

const Boom = () => {

  return (
    <>
    <ComponentCreator />
    <ComponentList />
    </>
  );
};

export default Boom;