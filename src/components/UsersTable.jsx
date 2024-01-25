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
        incorrectLicenseNumber: [],
        mails: [],
        phones: [],
        duplicatesInfo: [],
    });

    const dateRegex = /^(?:(?:19|20)\d\d-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[1-9]|1[0-2])\/(?:0[1-9]|[12][0-9]|3[01])\/(?:19|20)\d\d)$/;
    const phoneRegex1 = /^\+\d{10,}$/;
    const phoneRegex2 = /^\d{10,}$/;
    const phoneRegex3 = /^\d{9,}$/;
    const licenseRegex = /^[0-9a-zA-Z]{6}$/;

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
            const licenseNumberCoords = [];
            const mails = [];
            const phones = [];
            const duplicates = [];

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
                        phones.push(phoneValue);

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
                } else if (element.toLowerCase().includes("license number")) {
                    tableData.forEach((number, i) => {
                        const licenseNumberValue = number.split(",")[idx];
                        if (!licenseRegex.test(licenseNumberValue?.trim())) {
                            licenseNumberCoords.push([idx, i]);
                        }
                    });
                } else if (element.toLowerCase().includes("mail")) {
                    tableData.forEach((mail) => {
                        const mailValue = mail.split(",")[idx];
                        mails.push(mailValue);
                    });
                }
            });

            const findDuplicateIndexes = () => {
                const indexMap = {};

                mails.forEach((value, index) => {
                    if (!indexMap[value]) {
                        indexMap[value] = [index + 1];
                    } else {
                        indexMap[value].push(index + 1);
                    }
                });
                phones.forEach((value, index) => {
                    if (!indexMap[value]) {
                        indexMap[value] = [index + 1];
                    } else {
                        indexMap[value].push(index + 1);
                    }
                });

                for (const value in indexMap) {
                    const indexes = indexMap[value];
                    if (indexes.length > 1 && value !== "undefined") {
                        duplicates.push(`Дублікат ${value} має ID: ${indexes.join(", ")}`);
                    }
                }
            };

            findDuplicateIndexes();

            setValidationResults({
                incorrectAges: agesCoords,
                incorrectExp: experienceCoords,
                incorrectIncome: incomeCoords,
                states: states,
                incorrectDates: dateCoords,
                incorrectPhones: phoneCoords,
                hasChildren: childrenCoords,
                incorrectLicenseNumber: licenseNumberCoords,
                mails: mails,
                duplicatesInfo: duplicates,
            });
        };

        validateData();
    }, [tableHeaders, tableData]);

    const parseData = (data, col) => {
        if (validationResults.states.includes(data)) {
            return data.substring(0, 2).toUpperCase();
        }

        return data;
    };

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
                <TableCell key={n} size="small" sx={{ fontWeight: "700" }}>
                    {header}
                </TableCell>
            );
        }
    };

    const renderTableCell = (data, col, row) => {
        if (row >= tableData.length - 1) return null;

        const { incorrectAges, incorrectExp, incorrectIncome, incorrectDates, incorrectPhones, hasChildren, incorrectLicenseNumber } = validationResults;

        const isAgeIncorrect = incorrectAges.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isExpIncorrect = incorrectExp.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isIncomeIncorrect = incorrectIncome.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isDateIncorrect = incorrectDates.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isPhoneIncorrect = incorrectPhones.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const isHasChildren = hasChildren.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);
        const islicenseNumberIncorect = incorrectLicenseNumber.some(([colIndex, rowIndex]) => colIndex === col && rowIndex === row);

        if (col === 0) {
            return (
                <>
                    <TableCell key={"id_" + col} component="th" scope="row">
                        {row + 1}
                    </TableCell>
                    <TableCell key={"data" + col} component="th" scope="row">
                        {parseData(data, col)}
                    </TableCell>
                </>
            );
        } else if (isAgeIncorrect || isExpIncorrect || isIncomeIncorrect || isDateIncorrect || isPhoneIncorrect || isHasChildren || islicenseNumberIncorect) {
            return (
                <TableCell sx={{ backgroundColor: "red" }} key={col}>
                    {parseData(data, col)}
                </TableCell>
            );
        } else {
            return <TableCell key={col}>{parseData(data, col)}</TableCell>;
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
                        <TableRow>{tableHeaders.map((header, index) => tableHeaderRender(header.trim(), index))}</TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((item, row) => (
                            <TableRow key={row}>{item.split(",").map((data, col) => renderTableCell(data.trim(), col, row))}</TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Typography sx={{ marginBottom: "30px" }} align="left">
                {validationResults.duplicatesInfo.map((item) => (
                    <>
                        {item}
                        <br></br>
                    </>
                ))}
            </Typography>
        </Box>
    );
};

export default UsersTable;
