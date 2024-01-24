import React, { useEffect, useState } from "react";
import isEmpty from "lodash.isempty";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const UsersTable = ({ tableHeaders, tableData }) => {
    const [showTitle, setShowTitle] = useState(false);

    useEffect(() => {
        if (!isEmpty(tableHeaders) && !isEmpty(tableData)) setShowTitle(true);
    }, [showTitle, tableHeaders, tableData]);

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
        <Box>
            {showTitle && (
                <Typography variant="h2" align="center">
                    Users table
                </Typography>
            )}
            <TableContainer component={Paper} sx={{ margin: "30px 0px" }}>
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
        </Box>
    );
};

export default UsersTable;
