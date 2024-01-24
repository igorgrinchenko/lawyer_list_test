import React, { useRef } from "react";
import { Box, Button } from "@mui/material";

const DownloadCSV = ({ setTableHeaders, setTableData }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFile = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = handleFileLoad;
            reader.readAsText(file);
        }
    };

    const handleFileLoad = (event) => {
        const csvData = event.target.result;
        parseCSV(csvData);
    };

    const parseCSV = (csvData) => {
        const rows = csvData.split("\n");
        const headers = rows.shift();

        setTableHeaders(headers.split(","));
        setTableData(rows);
    };

    return (
        <Box>
            <Button variant="contained" color="success" fullWidth onClick={handleButtonClick}>
                Import users
            </Button>
            <input type="file" accept=".csv" ref={fileInputRef} style={{ display: "none" }} onChange={handleFile} />
        </Box>
    );
};

export default DownloadCSV;
