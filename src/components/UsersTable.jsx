import React, { useEffect, useState } from "react";
import isEmpty from "lodash.isempty";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const UsersTable = ({ tableHeaders, tableData }) => {
    const [showTitle, setShowTitle] = useState(false);
    const [validationResults, setValidationResults] = useState({
        incorrectAges: [],
        incorrectExp: [],
        incorrectIncome: [],
        states: [],
        incorrectDates: [],
        incorrectPhones: [],
        hasChildren: [],
    });

    const dateRegex = /^(?:(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:19|20)\d\d)$/;
    const phoneRegex1 = /^\+\d{10,}$/;
    const phoneRegex2 = /^\d{10,}$/;
    const phoneRegex3 = /^\d{9,}$/;

    useEffect(() => {
        const validateData = () => {
            if (!isEmpty(tableHeaders) && !isEmpty(tableData)) setShowTitle(true);

            const allAges = [];
            const agesCoords = [];
            const experienceCoords = [];
            const incomeCoords = [];
            const states = [];
            const dateCoords = [];
            const phoneCoords = [];
            const childrenCoords = [];

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
                } else if (element.toLowerCase().includes("date")) {
                    tableData.forEach((date, i) => {
                        const dateValue = date.split(",")[idx];
                        if (!dateRegex.test(dateValue) || new Date(dateValue) < new Date()) {
                            dateCoords.push([idx, i]);
                        }
                    });
                } else if (element.toLowerCase().includes("phone")) {
                    tableData.forEach((phone, i) => {
                        const phoneValue = phone.split(",")[idx];
                        const isPhoneNumberValid = (regex) => {
                            if (regex.test(phoneValue)) {
                                return true;
                            }
                            return false;
                        };

                        if (isPhoneNumberValid(phoneRegex1)) return;
                        phoneCoords.push([idx, i]);

                        if (isPhoneNumberValid(phoneRegex2)) return;
                        phoneCoords.push([idx, i]);

                        if (isPhoneNumberValid(phoneRegex3)) return;
                        phoneCoords.push([idx, i]);
                    });
                } else if (element.toLowerCase().includes("child")) {
                    tableData.forEach((child, i) => {
                        const childrenValue = child.split(",")[idx];
                        if (!childrenValue?.includes("true") && !childrenValue?.includes("false")) {
                            childrenCoords.push([idx, i]);
                        }
                    });
                }
            });

            setValidationResults({
                incorrectAges: agesCoords,
                incorrectExp: experienceCoords,
                incorrectIncome: incomeCoords,
                states: states,
                incorrectDates: dateCoords,
                incorrectPhones: phoneCoords,
                hasChildren: childrenCoords,
            });
        };

        validateData();
    }, [tableHeaders, tableData]);

    const parseData = (data) => {
        if (validationResults.states.includes(data)) {
            return data.substring(0, 2).toUpperCase();
        }
        return data;
    };

    const renderTableHeader = (header, index) => {
        const isIDColumn = index === 0;

        return (
            <TableCell key={isIDColumn ? `id_${index}` : `header_${index}`} size="small" align={isIDColumn ? "left" : "right"} sx={{ fontWeight: "700" }}>
                {isIDColumn ? "ID" : header}
            </TableCell>
        );
    };

    const renderTableCell = (data, col, row) => {
        if (row >= tableData.length - 1) return null;

        const { incorrectAges, incorrectExp, incorrectIncome, incorrectDates, incorrectPhones, hasChildren } = validationResults;

        const isAgeIncorrect = incorrectAges.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isExpIncorrect = incorrectExp.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isIncomeIncorrect = incorrectIncome.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isDateIncorrect = incorrectDates.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isPhoneIncorrect = incorrectPhones.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isHasChildren = hasChildren.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);

        return (
            <TableCell
                key={col}
                align="right"
                sx={{
                    backgroundColor:
                        isAgeIncorrect || isExpIncorrect || isIncomeIncorrect || isDateIncorrect || isPhoneIncorrect || isHasChildren ? "red" : "green",
                }}
            >
                {parseData(data)}
            </TableCell>
        );
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
                        <TableRow>{tableHeaders.map((header, index) => renderTableHeader(header.trim(), index))}</TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((item, row) => (
                            <TableRow key={row}>{item.split(",").map((data, col) => renderTableCell(data.trim(), col, row))}</TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default UsersTable;
