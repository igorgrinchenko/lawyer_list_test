import { useState } from "react";
import { Container, Box } from "@mui/material";
import UsersTable from "./components/UsersTable.jsx";
import DownloadCSV from "./components/DownloadCSV";

const App = () => {
    const [tableHeaders, setTableHeaders] = useState([]);
    const [tableData, setTableData] = useState([]);

    return (
        <Box className="App">
            <Container maxWidth="xl">
                <UsersTable tableHeaders={tableHeaders} tableData={tableData} />
                <DownloadCSV setTableHeaders={setTableHeaders} setTableData={setTableData} />
            </Container>
        </Box>
    );
};

export default App;
