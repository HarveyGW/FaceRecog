import {
  Box,
  Button,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Content = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("All");
  const [timePeriod, setTimePeriod] = useState("All");
  const [tableData, setTableData] = useState([]);

  const getTimePeriodRange = (period) => {
    const now = new Date();
    switch (period) {
      case "Past Day":
        return {
          start: Math.floor(now.setHours(0, 0, 0, 0) / 1000),
          end: Math.floor(new Date().getTime() / 1000),
        };
      case "Past Week":
        let lastWeek = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 7
        );
        return {
          start: Math.floor(lastWeek.setHours(0, 0, 0, 0) / 1000),
          end: Math.floor(now.getTime() / 1000),
        };
      case "Past Month":
        let lastMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          now.getDate()
        );
        return {
          start: Math.floor(lastMonth.setHours(0, 0, 0, 0) / 1000),
          end: Math.floor(now.getTime() / 1000),
        };
      case "Past Year":
        let lastYear = new Date(
          now.getFullYear() - 1,
          now.getMonth(),
          now.getDate()
        );
        return {
          start: Math.floor(lastYear.setHours(0, 0, 0, 0) / 1000),
          end: Math.floor(now.getTime() / 1000),
        };
      default:
        return { start: 0, end: Math.floor(new Date().getTime() / 1000) };
    }
  };

  const fetchData = async () => {
    const { start, end } = getTimePeriodRange(timePeriod);
    const params = {
      studentName: searchTerm || undefined,
      Location: location !== "All" ? location.toLowerCase() : undefined,
      timePeriodStart: timePeriod !== "All" ? start : undefined,
      timePeriodEnd: timePeriod !== "All" ? end : undefined,
    };
    console.log(params);

    try {
      const response = await axios.get(
        "http://45.87.28.51:5000/search_attendance",
        { params }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setTableData(response.data.data);
        console.log(response.data.data);
      } else {
        console.error("Invalid data format", response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box style={{ padding: 20 }}>
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <TextField
          label="Name"
          variant="outlined"
          style={{ borderRadius: "50px" }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          variant="outlined"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <MenuItem value="All">All Locations</MenuItem>{" "}
          <MenuItem value="Cantor">Cantor</MenuItem>
          <MenuItem value="Owen">Owen</MenuItem>
        </Select>
        <Select
          variant="outlined"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <MenuItem value="All">All Time Periods</MenuItem>{" "}
          <MenuItem value="Past Day">Past Day</MenuItem>
          <MenuItem value="Past Week">Past Week</MenuItem>
          <MenuItem value="Past Month">Past Month</MenuItem>
          <MenuItem value="Past Year">Past Year</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={fetchData}>
          Search
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead style={{ backgroundColor: "#621b40" }}>
            <TableRow>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                ID
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                Student Name
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                Location
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                Present
              </TableCell>
              <TableCell
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                }}
              >
                Time
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.present.toString()}</TableCell>
                <TableCell>
                  {new Date(parseInt(row.timestamp) * 1000).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Content;
