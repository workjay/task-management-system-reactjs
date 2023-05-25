import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Switch,
  TablePagination,
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CreateOrUpdateTaskDialog from "./CreateOrUpdateTaskDialog";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { visuallyHidden } from "@mui/utils";
import { deleteTaskApi, getTasksApi, updateTaskApi } from "../../apis/tasks";
import CreateTask from "./CreateTask";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    "& .MuiTableSortLabel-root:hover": {
      color: theme.palette.common.white,
      fontWeight: 600,
    },
    "& .Mui-active": {
      color: theme.palette.common.white,
      "& .MuiTableSortLabel-icon": {
        color: theme.palette.common.white,
      },
    },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const headCells = [
  {
    id: "title",
    label: "Title",
    align: "left",
  },
  {
    id: "description",
    label: "Description",
    align: "left",
  },
  {
    id: "status",
    label: "Status",
    align: "center",
  },
  {
    id: "action",
    label: "Action",
    align: "center",
    disableSorting: true,
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              disabled={
                typeof headCell?.disableSorting === "boolean"
                  ? headCell?.disableSorting
                  : false
              }
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

export default function TaskTable() {
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("status");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [isLoadingTask, setIsLoadingTask] = useState(false);

  const getLatestRows = async () => {
    setIsLoadingTask(true);
    const response = await getTasksApi({
      size: rowsPerPage,
      page,
      order,
      orderBy,
    });
    if (response?.status) {
      setRows(response?.data);
      setTotalRows(response?.count);
    } else {
      toast.error(response?.message, 5000);
    }
    setIsLoadingTask(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [openEditDialog, setOpenEditDialog] = useState(null);
  const [openDeleteConfirmationDialog, setOpenDeleteConfirmationDialog] =
    useState(null);
  const [deleteTaskLoading, setDeleteTaskLoading] = useState(null);
  const [toggleTaskStatusLoading, setToggleTaskStatusLoading] = useState(null);

  const handleDeleteDialogClose = async (value) => {
    setOpenDeleteConfirmationDialog(null);
    if (value) {
      setDeleteTaskLoading(openDeleteConfirmationDialog?._id);
      const response = await deleteTaskApi(openDeleteConfirmationDialog?._id);
      if (response?.status) {
        setRows((pre) =>
          pre?.filter((item) => item?._id !== response?.data?.id)
        );
        setTotalRows((pre) => pre - 1);
        getLatestRows();
        toast.success(response?.message, 5000);
      } else {
        toast.error(response?.message, 5000);
      }
      setDeleteTaskLoading(null);
    }
  };

  const toggleTaskStatus = (task) => async (e) => {
    setToggleTaskStatusLoading(task?._id);
    const response = await updateTaskApi(task?._id, {
      status: e.target?.checked,
    });
    if (response?.status) {
      setRows((pre) =>
        pre?.map((item) =>
          item?._id === response?.data?._id ? response?.data : item
        )
      );
    } else {
      toast.error(response?.message, 5000);
    }
    setToggleTaskStatusLoading(null);
  };

  const addOrUpdateTask = (type, data) => {
    if (type === "add") {
      setRows((pre) => [data, ...pre]);
      setTotalRows((pre) => pre + 1);
      if (page !== 0) {
        setPage(0);
      }
    } else {
      setRows((pre) =>
        pre?.map((item) => (item?._id === data?._id ? data : item))
      );
    }
  };

  useEffect(() => {
    getLatestRows();
  }, [rowsPerPage, page, order, orderBy]);
  return (
    <>
      <CreateTask addOrUpdateTask={addOrUpdateTask} />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 1100 }}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {isLoadingTask ? (
                <StyledTableRow
                  style={{
                    height: 53 * rows,
                  }}
                >
                  <StyledTableCell colSpan={4} align="center">
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      justifyContent={"center"}
                    >
                      Loading... <CircularProgress size={20} sx={{ ml: 1 }} />
                    </Box>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                <>
                  {rows?.slice(0, rowsPerPage)?.map((row, index) => {
                    return (
                      <StyledTableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                      >
                        <StyledTableCell align="left">
                          {row.title}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {row.description}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          {Boolean(toggleTaskStatusLoading) &&
                          toggleTaskStatusLoading === row?._id ? (
                            <CircularProgress size={20} />
                          ) : (
                            <Tooltip
                              arrow
                              title={
                                row?.status ? "Completed" : `Mark as complete`
                              }
                            >
                              <Switch
                                checked={row?.status}
                                onChange={toggleTaskStatus(row)}
                              />
                            </Tooltip>
                          )}
                        </StyledTableCell>
                        <StyledTableCell align="center">
                          <Box
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                          >
                            <Tooltip arrow title="Edit task">
                              <IconButton
                                onClick={() => setOpenEditDialog(row)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip arrow title="Delete task">
                              <IconButton
                                onClick={() =>
                                  setOpenDeleteConfirmationDialog(row)
                                }
                              >
                                {Boolean(deleteTaskLoading) &&
                                deleteTaskLoading === row?._id ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <DeleteIcon />
                                )}
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <CreateOrUpdateTaskDialog
          open={Boolean(openEditDialog)}
          handleClose={() => setOpenEditDialog(null)}
          task={openEditDialog}
          addOrUpdateTask={addOrUpdateTask}
        />
        <DeleteConfirmationDialog
          open={Boolean(openDeleteConfirmationDialog)}
          handleClose={handleDeleteDialogClose}
        />
      </Paper>
    </>
  );
}
