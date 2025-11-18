import { Fragment, useState, useEffect, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../firebaseConfig.js";
import { Download } from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

export function ComidaTable() {
    const [comida, setComida] = useState([]);
    const tableRefComida = useRef(null);

    useEffect(() => {
        const comidaRef = collection(db, "Comida");
        const unsubscribe = onSnapshot(comidaRef, (snapshot) => { 
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Ordenar por prioridad (de menor a mayor)
            lista.sort((a, b) => b.congelado - a.congelado);
            setComida(lista);
        });
        return () => unsubscribe();
    }, []);

    const exportToPDF = () => {
        const doc = new jsPDF();
        const table = tableRefComida.current;

        if (!table) return;

        autoTable(doc, { html: table });

        doc.save("comida.pdf");
    };

    const exportToExcel = () => {
        const table = tableRefComida.current;
        if (!table) return;

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(table);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Comida");

        XLSX.writeFile(workbook, "comida.xlsx");
    };


    const exportToPNG = async () => {
        const table = tableRefComida.current;
        if (!table) return;

        const canvas = await html2canvas(table);

        const link = document.createElement("a");
        link.download = "comida.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };


    return (
        <Fragment>
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 fw-bold text-dark">Lista de Comida</h2>

                    <div className="d-flex gap-2">
                        <button 
                            onClick={exportToPDF} 
                            className="btn btn-danger d-flex align-items-center gap-1"
                        >
                            <Download size={16} /> PDF
                        </button>

                        <button 
                            onClick={exportToExcel} 
                            className="btn btn-success d-flex align-items-center gap-1"
                        >
                            <Download size={16} /> Excel
                        </button>

                        <button 
                            onClick={exportToPNG} 
                            className="btn btn-primary d-flex align-items-center gap-1"
                        >
                            <Download size={16} /> PNG
                        </button>
                    </div>
                </div>

                <div className="card shadow-sm">
                    <div className="table-responsive">
                        <table ref={tableRefComida} className="table table-bordered table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Congelado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comida.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">
                                            No hay comida registrada
                                        </td>
                                    </tr>
                                ) : (
                                    comida.map((comida) => (
                                        <tr key={comida.id}>
                                            <td>{comida.nombre}</td>
                                            <td>
                                                <span className={`badge ${comida.congelado ? "bg-success" : "bg-secondary"}`}>
                                                    {comida.congelado ? "Sí" : "No"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Fragment>

    );
}