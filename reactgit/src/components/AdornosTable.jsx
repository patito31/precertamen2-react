import { Fragment, useState, useEffect, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from "../firebaseConfig.js";
import { Download } from 'lucide-react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx";

export function AdornosTable() {
    const [adornos, setAdornos] = useState([]);
    const tableRefAdornos = useRef(null);

    useEffect(() => {
        const adornosRef = collection(db, "Adornos");
        const unsubscribe = onSnapshot(adornosRef, (snapshot) => { 
            const lista = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            // Ordenar por prioridad (de menor a mayor)
            lista.sort((a, b) => a.cantidad - b.cantidad);
            setAdornos(lista);
        });
        return () => unsubscribe();
    }, []);

    const exportToPDF = () => {
        const doc = new jsPDF();
        const table = tableRefAdornos.current;

        if (!table) return;

        autoTable(doc, { html: table });

        doc.save("adornos.pdf");
    };

    const exportToExcel = () => {
        const table = tableRefAdornos.current;
        if (!table) return;

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.table_to_sheet(table);

        XLSX.utils.book_append_sheet(workbook, worksheet, "Adornos");

        XLSX.writeFile(workbook, "adornos.xlsx");
    };


    const exportToPNG = async () => {
        const table = tableRefAdornos.current;
        if (!table) return;

        const canvas = await html2canvas(table);

        const link = document.createElement("a");
        link.download = "adornos.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };


    return (
        <Fragment>
            <div className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="h4 fw-bold text-dark">Lista de adornos</h2>

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
                        <table ref={tableRefAdornos} className="table table-bordered table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {adornos.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="text-center py-4 text-muted">
                                            No hay adornos registrada
                                        </td>
                                    </tr>
                                ) : (
                                    adornos.map((adornos) => (
                                        <tr key={adornos.id}>
                                            <td>{adornos.nombre}</td>
                                            <td>{adornos.cantidad}</td>
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