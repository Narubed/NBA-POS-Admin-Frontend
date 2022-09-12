import SessionBar from "@/components/layouts/reusable/SessionSubBar";
import useCurrentUser from "@/lib/hook/useCurrentUser";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import { filter } from "lodash";
import Link from "next/link";

// material
import {
  TableContainer,
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Button,
  Stack,
  Typography,
  Container,
  Card,
  TablePagination,
  Chip,
} from "@mui/material";

import Scrollbar from "@/lib/table/Scrollbar";
import ListHead from "@/lib/table/ListHead";
import ListToolbar from "@/lib/table/ListToolbar";
import SearchNotFound from "@/lib/table/SearchNotFound";
import AdminMoreMenu from "./AdminMoreMenu";
import DialogCreateAdmin from "./DialogCreateAdmin";

const TABLE_HEAD = [
  { id: "admin_email", label: "อีเมล", alignRight: false },
  { id: "admin_name", label: "ชื่อ", alignRight: false },
  { id: "admin_date_start", label: "วันที่ลงทะเบียน", alignRight: false },
  { id: "" },
];
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

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;

    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.admin_email.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.admin_name.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function Blogs() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [isAdmins, setAdmins] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDateSelect, setDateSelect] = useState(["", ""]);
  const [isOpenDialogCreate, setOpenDialogCreate] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetcherAdmin();
    }
  }, [currentUser]);

  const fetcherAdmin = () => {
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/admins`;
    fetcherWithToken(url)
      .then((json) => {
        console.log(json.data);
        setAdmins(json.data);
      })
      .catch(() => setAdmins([]));
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Orderlist.map((n) => n._id);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    console.log(event.target.value);
    setFilterName(event.target.value);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - isAdmins.length) : 0;
  const filteredList = applySortFilter(
    isAdmins,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredList.length === 0;

  return (
    <>
      <DialogCreateAdmin
        setOpenDialogCreate={setOpenDialogCreate}
        isOpenDialogCreate={isOpenDialogCreate}
        fetcherAdmin={fetcherAdmin}
      />
      <SessionBar>
        {currentUser ? (
          <Container>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={4}
            >
              <Typography variant="h6" gutterBottom>
                <div>ผู้ดูแลระบบ</div>
              </Typography>
              <Button
                onClick={() => setOpenDialogCreate(true)}
                variant="contained"
                sx={{
                  transition: ".2s transform ease-in-out",
                  borderRadius: "15px",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                เพิ่มผู้ดูแลใหม่
              </Button>
            </Stack>
            <Card>
              <ListToolbar
                numSelected={selected.length}
                filterName={filterName}
                onFilterName={handleFilterByName}
                selected={selected}
              />
              <Scrollbar>
                <TableContainer sx={{ minWidth: 360 }}>
                  <Table>
                    <ListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={isAdmins.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredList
                        .slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                        .map((row) => {
                          const {
                            _id,
                            admin_name,
                            admin_email,
                            admin_date_start,
                          } = row;
                          const isItemSelected = selected.indexOf(_id) !== -1;

                          return (
                            <TableRow
                              hover
                              key={_id}
                              tabIndex={-1}
                              role="checkbox"
                              selected={isItemSelected}
                              aria-checked={isItemSelected}
                            >
                              <TableCell />

                              <TableCell>{admin_email}</TableCell>
                              <TableCell>{admin_name}</TableCell>

                              <TableCell>
                                {dayjs(admin_date_start)
                                  .add(543, "year")
                                  .locale("th")
                                  .format("DD MMM YYYY")}
                              </TableCell>

                              <TableCell>
                                <AdminMoreMenu
                                  row={row}
                                  fetcherAdmin={fetcherAdmin}
                                />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>
                    {isUserNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <SearchNotFound searchQuery={filterName} />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredList.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>
        ) : null}
      </SessionBar>
    </>
  );
}
