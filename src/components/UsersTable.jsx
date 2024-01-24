import React, { useEffect, useState } from "react";
import isEmpty from "lodash.isempty";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const UsersTable = ({ tableHeaders, tableData }) => {
    const [showTitle, setShowTitle] = useState(false);
    const [incorrectAges, setIncorrectAges] = useState([]);
    const [incorrectExp, setIncorrectExp] = useState([]);
    const [incorrectIncome, setIncorrectIncome] = useState([]);
    const [states, setStates] = useState([]);

    useEffect(() => {
        if (!isEmpty(tableHeaders) && !isEmpty(tableData)) setShowTitle(true);

        const validatior = () => {
            const allAges = [];
            const agesCoords = [];
            const experienceCoords = [];
            const incomeCoords = [];
            const states = [];

            tableHeaders.forEach((element, idx) => {
                if (element.toLowerCase().includes("age")) {
                    tableData.forEach((age, i) => {
                        const ageValue = Number(age.split(",")[idx]);
                        allAges.push(ageValue);
                        if (!Number.isInteger(ageValue) || ageValue < 21 || ageValue === 0) {
                            agesCoords.push([idx, i]);
                        }
                    });
                } else if (element.toLowerCase().includes("experience")) {
                    tableData.forEach((exp, i) => {
                        const expValue = Number(exp.split(",")[idx]);
                        if (expValue > allAges[i] || expValue < 0) {
                            experienceCoords.push([idx, i]);
                        }
                    });
                } else if (element.toLowerCase().includes("income")) {
                    tableData.forEach((income, i) => {
                        const incomeValue = Number(income.split(",")[idx]);
                        if (incomeValue > 1000000) {
                            incomeCoords.push([idx, i]);
                        }
                    });
                } else if (element.toLowerCase().includes("state")) {
                    tableData.forEach((state, i) => {
                        const stateValue = state.split(",")[idx];
                        states.push(stateValue);
                    });
                }
            });

            setIncorrectAges(agesCoords);
            setIncorrectExp(experienceCoords);
            setIncorrectIncome(incomeCoords);
            setStates(states);
        };
        validatior();
    }, [showTitle, tableHeaders, tableData]);

    const tableHeaderRender = (header, n) => {
        if (n === 0) {
            return (
                <>
                    <TableCell key={"id_" + n} size="small" sx={{ fontWeight: "700" }}>
                        ID
                    </TableCell>
                    <TableCell key={"header_" + n} size="small" sx={{ fontWeight: "700" }}>
                        {header}
                    </TableCell>
                </>
            );
        } else {
            return (
                <TableCell key={n} size="small" align="right" sx={{ fontWeight: "700" }}>
                    {header}
                </TableCell>
            );
        }
    };

    const tableRowsRender = (data, col, row) => {
        if (row >= tableData.length - 1) return;

        const isAgeIncorrect = incorrectAges.find(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isExpIncorrect = incorrectExp.find(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isIncomeIncorrect = incorrectIncome.find(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);

        const parseData = () => {
            if (states.includes(data)) {
                return data.substring(0, 2).toUpperCase();
            }

            return data;
        };

        if (col === 0) {
            return (
                <>
                    <TableCell key={"id_" + col} component="th" scope="row">
                        {row + 1}
                    </TableCell>
                    <TableCell key={"data" + col} component="th" scope="row">
                        {parseData()}
                    </TableCell>
                </>
            );
        } else if (isAgeIncorrect || isExpIncorrect || isIncomeIncorrect) {
            return (
                <TableCell sx={{ backgroundColor: "red" }} key={col} align="right">
                    {parseData()}
                </TableCell>
            );
        } else {
            return (
                <TableCell sx={{ backgroundColor: "green" }} key={col} align="right">
                    {parseData()}
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
                        <TableRow>{tableHeaders.map((header, n) => tableHeaderRender(header.trim(), n))}</TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((item, row) => (
                            <TableRow key={row}>{item.split(",").map((data, col) => tableRowsRender(data.trim(), col, row))}</TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UsersTable;
