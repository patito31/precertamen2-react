import React, {Fragment} from "react";
import "./css/bootstrap.min.css";
import { RegalosTable } from "./components/RegalosTable";
import { ComidaTable } from "./components/ComidaTable";

export function App(){
    return(
        <Fragment>
            <RegalosTable />
            <ComidaTable />
        </Fragment>
    )
}