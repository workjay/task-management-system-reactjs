import React from "react";
import { Grid, Typography } from "@mui/material";
import TaskTable from "../components/Home/TaskTable";

export default function Home() {
  return (
    <Grid
      container
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"flex-start"}
    >
      <Grid item>
        <Typography variant="h2" fontWeight={"600"} sx={{ mt: 5, mb: 3 }}>
          Task Management System
        </Typography>
      </Grid>
      <Grid item>
        <TaskTable />
      </Grid>
    </Grid>
  );
}
