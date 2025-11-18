import React, {Fragment} from "react";
import "./css/bootstrap.min.css";
import { RegalosTable } from "./components/RegalosTable";
import { ComidaTable } from "./components/ComidaTable";
import { AdornosTable } from "./components/AdornosTable";

export function App(){
    return(
        <Fragment>
            <RegalosTable />
            <ComidaTable />
            <AdornosTable />
        </Fragment>
    )
}