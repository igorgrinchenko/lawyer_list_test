import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const UsersTable = ({ tableHeaders, tableData }) => {
    const tableHeaderRender = (header, n) => {
        if (n === 0) {
            return (
                <TableCell key={n} size="small" sx={{ fontWeight: "700" }}>
                    {header}
                </TableCell>
            );
        } else {
            return (
                <TableCell key={n} size="small" align="right" sx={{ fontWeight: "700" }}>
                    {header}
                </TableCell>
            );
        }
    };

    const tableRowsRender = (data, i) => {
        if (i === 0) {
            return (
                <TableCell key={i} component="th" scope="row">
                    {data}
                </TableCell>
            );
        } else {
            return (
                <TableCell key={i} align="right">
                    {data}
                </TableCell>
            );
        }
    };
    return (
        <TableContainer component={Paper} sx={{ marginBottom: "20px" }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>{tableHeaders.map((header, n) => tableHeaderRender(header, n))}</TableRow>
                </TableHead>
                <TableBody>
                    {tableData.map((item, x) => (
                        <TableRow key={x}>{tableData[x].split(",").map((data, i) => tableRowsRender(data, i))}</TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UsersTable;
