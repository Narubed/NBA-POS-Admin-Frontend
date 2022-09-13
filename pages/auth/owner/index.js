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
import OwnerMoreMenu from "@/components/auth/owner/OwnerMoreMenu";

const TABLE_HEAD = [
  { id: "owner_name", label: "ชื่อ", alignRight: true },
  { id: "owner_phone", label: "เบอร์โทรศัพท์", alignRight: false },
  { id: "owner_address", label: "ที่อยู่", alignRight: true },
  { id: "owner_status", label: "สถานะ", alignRight: false },
  { id: "owner_date_start", label: "วันที่ลงทะเบียน", alignRight: false },
  { id: "owner_date_end", label: "วันที่หมดสัญญา", alignRight: false },
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
        _user.owner_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.owner_phone.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.owner_address
          .toLocaleString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function Blogs() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [isOwners, setOwners] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDateSelect, setDateSelect] = useState(["", ""]);
  const [isReports, setReports] = useState([]);

  useEffect(() => {
    if (currentUser) {
      fetcherOwners();
    }
  }, [currentUser]);

  const fetcherOwners = () => {
    const url = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/owners`;
    fetcherWithToken(url)
      .then((json) => {
        console.log(json.data);
        setOwners(json.data);
      })
      .catch(() => setOwners([]));
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

  const newProductHistoryList =
    isDateSelect[0] !== "" && isDateSelect[1] !== ""
      ? isOwners.filter(
          (item) =>
            dayjs(item.timestamp).format("YYYY-MM-DD HH:mm") >=
              dayjs(isDateSelect[0]).format("YYYY-MM-DD HH:mm") &&
            dayjs(item.timestamp).format("YYYY-MM-DD HH:mm") <=
              dayjs(isDateSelect[1]).format("YYYY-MM-DD HH:mm")
        )
      : isOwners;

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - newProductHistoryList.length)
      : 0;
  const filteredList = applySortFilter(
    newProductHistoryList,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredList.length === 0;

  const statusObj = {
    true: { color: "primary" },
    false: { color: "error" },
  };

  useEffect(() => {}, [isOwners]);

  return (
    <>
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
                <div>เจ้าของกิจการ</div>
              </Typography>
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
                      rowCount={isOwners.length}
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
                            owner_date_start,
                            owner_date_end,
                            owner_name,
                            owner_phone,
                            owner_address,
                            owner_status,
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

                              <TableCell>{owner_name}</TableCell>
                              <TableCell>{owner_phone}</TableCell>
                              <TableCell>{owner_address}</TableCell>
                              <TableCell>
                                <Chip
                                  label={owner_status ? "ออนไลน์" : "ออฟไลน์"}
                                  color={statusObj[row.owner_status].color}
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                    "& .MuiChip-label": { fontWeight: 500 },
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                {dayjs(owner_date_start)
                                  .add(543, "year")
                                  .locale("th")
                                  .format("DD MMM YYYY")}
                              </TableCell>
                              <TableCell>
                                {dayjs(owner_date_end)
                                  .add(543, "year")
                                  .locale("th")
                                  .format("DD MMM YYYY")}

                                {dayjs(owner_date_end).format() <
                                  dayjs(Date.now()).format() && (
                                  <Chip label=" หมดสัญญาเเล้ว" color="error" />
                                )}
                              </TableCell>
                              <TableCell>
                                <OwnerMoreMenu
                                  row={row}
                                  fetcherOwners={fetcherOwners}
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
