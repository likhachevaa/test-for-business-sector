import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { makeStyles } from "@material-ui/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../store/postsAction";
import {
  InputAdornment,
  Pagination,
  PaginationItem,
  Stack,
  TextField,
} from "@mui/material";
import { ReactComponent as NextSvg } from "../icons/next.svg";
import { ReactComponent as BackSvg } from "../icons/back.svg";
import SearchIcon from "@mui/icons-material/Search";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  headerTable: {
    backgroundColor: "#474955",
  },
  headerText: {
    color: "#FFFFFF !important",
    fontWeight: 600,
    "& 	.MuiTableSortLabel-icon": {
      color: "white  !important",
    },
  },
  searchStyle: {
    background: "#5A5C66",
    width: "630px",
    marginBottom: "15px",
    "& .MuiOutlinedInput-input": {
      color: "#B3B7BF",
    },
  },
  paginationStyle: {
    "& ul": {
      justifyContent: "center",
      fontStyle: "italic",
    },
    "& li:first-of-type": {
      paddingRight: "20%",
    },
    "& li:last-of-type": {
      paddingLeft: "20%",
    },
    "& .Mui-selected": {
      backgroundColor: "transparent",
      color: "#7EBC3C ",
    },
    "& .MuiPaginationItem-text": {
      fontStyle: "italic",
      fontSize: "18px",
      fontWeight: 700,
    },
  },
  tableBody: {
    "& td": {
      border: "1px solid #E3E6EC",
    },
  },
}));

const headCells = [
  {
    id: "id",
    numeric: true,
    disablePadding: true,
    label: "ID",
  },
  {
    id: "title",
    numeric: true,
    disablePadding: false,
    label: "Заголовок",
  },
  {
    id: "body",
    numeric: true,
    disablePadding: false,
    label: "Описание",
  },
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  const classes = useStyles();

  //

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            className={classes.headerTable}
            key={headCell.id}
            align={"left"}
            padding={"23px"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              className={classes.headerText}
              IconComponent={KeyboardArrowDownIcon}
              active={true}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //

  const posts = useSelector((state) => state.toolkit.posts);
  const rows = posts;

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchPosts());
  });

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const [search, setSearch] = React.useState("");
  const [filteredRows, setFilteredRows] = React.useState([]);

  const handleSearch = (event) => {
    const newString = event.target.value;
    setSearch(newString);

    if (newString) {
      const newRows = rows.filter((row) => {
        let matches = true;

        const properties = ["body", "id", "title"];
        let containsQuery = false;

        properties.forEach((property) => {
          if (
            row[property]
              .toString()
              .toLowerCase()
              .includes(newString.toString().toLowerCase())
          ) {
            containsQuery = true;
          }
        });

        if (!containsQuery) {
          matches = false;
        }
        return matches;
      });
      setFilteredRows(newRows);
    } else {
      setFilteredRows(rows);
    }
  };

  return (
    <Box sx={{ width: "80%" }}>
      <TextField
        className={classes.searchStyle}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon sx={{ color: "white" }} />
            </InputAdornment>
          ),
        }}
        onChange={handleSearch}
        placeholder={`Поиск`}
        value={search}
        size="small"
      />
      <Paper sx={{ width: "100%", mb: 2 }}>
        <TableContainer>
          <Table
            border={true}
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody className={classes.tableBody}>
              {stableSort(
                filteredRows.length > 0 ? filteredRows : rows,
                getComparator(order, orderBy)
              )
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.name)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        sx={{ width: "20px" }}
                        align="center"
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.title}</TableCell>
                      <TableCell align="left">{row.body}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <Box sx={{ width: "100%" }}>
        <Stack spacing={2}>
          <Pagination
            className={classes.paginationStyle}
            onChange={handleChangePage}
            count={rows.length / 10}
            renderItem={(item) => (
              <PaginationItem
                components={{
                  previous: BackSvg,
                  next: NextSvg,
                }}
                {...item}
              />
            )}
          />
        </Stack>
      </Box>
    </Box>
  );
}
