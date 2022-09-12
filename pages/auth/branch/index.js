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
import Image from "next/image";

import Scrollbar from "@/lib/table/Scrollbar";
import ListHead from "@/lib/table/ListHead";
import ListToolbar from "@/lib/table/ListToolbar";
import SearchNotFound from "@/lib/table/SearchNotFound";
// import OwnerMoreMenu from "./OwnerMoreMenu";
import imagesicon from "../../../public/images/NoImage.png";
import OwnerName from "./components/OwnerName";
import BranchMoreMenu from "./components/BranchMoreMenu";

const TABLE_HEAD = [
  { id: "branch_name", label: "ชื่อสาขา", alignRight: true },
  { id: "owner_name", label: "ชื่อเจ้าของ", alignRight: false },
  { id: "branch_status", label: "สถานะ", alignRight: true },
  { id: "owner_status", label: "สถานะ", alignRight: true },
  { id: "branch_vat_address", label: "ที่อยู่สาขา", alignRight: false },
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
        _user.branch_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.branch_vat_name.toLowerCase().indexOf(query.toLowerCase()) !==
          -1 ||
        _user.branch_vat_address
          .toLocaleString()
          .toLowerCase()
          .indexOf(query.toLowerCase()) !== -1
    );
  }

  return stabilizedThis.map((el) => el[0]);
}

export default function Blogs() {
  const { fetcherWithToken, currentUser } = useCurrentUser();
  const [isBranch, setBranch] = useState([]);
  const [isOwners, setOwners] = useState([]);

  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("name");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isDateSelect, setDateSelect] = useState(["", ""]);

  useEffect(() => {
    if (currentUser) {
      fetcherOwners();
    }
  }, [currentUser]);

  const fetcherOwners = () => {
    const urlBranch = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/branch`;
    fetcherWithToken(urlBranch)
      .then((json) => {
        console.log(json.data);
        setBranch(json.data);
      })
      .catch(() => setBranch([]));

    const urlOwner = `${process.env.NEXT_PUBLIC_ADMIN_POS_BACKEND}/owners`;
    fetcherWithToken(urlOwner)
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

  const newProductHistoryList = isBranch;

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

  useEffect(() => {}, [isBranch]);

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
                <div>รายชื่อสาขาทั้งหมด</div>
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
                      rowCount={isBranch.length}
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
                            branch_owner_id,
                            branch_name,
                            branch_number,
                            branch_status,
                            branch_image,
                            branch_phone,
                            branch_status_vat,
                            branch_vat_name,
                            branch_vat_number,
                            branch_vat_address,
                            branch_withholding_tax,
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

                              <TableCell>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  {branch_image === "ไม่มี" ? (
                                    <Image
                                      src={imagesicon.src}
                                      alt={imagesicon.src}
                                      width={40}
                                      height={40}
                                      objectFit="cover"
                                      quality={20}
                                    />
                                  ) : (
                                    <Image
                                      alt={`${process.env.NEXT_PUBLIC_DRIVE_SELECT_IMAGE}${branch_image}`}
                                      src={`${process.env.NEXT_PUBLIC_DRIVE_SELECT_IMAGE}${branch_image}`}
                                      width={40}
                                      height={40}
                                      objectFit="cover"
                                      quality={20}
                                    />
                                  )}
                                  <Typography variant="subtitle2" noWrap>
                                    <div style={{ color: "orange" }}>
                                      {branch_name}
                                    </div>
                                    <div
                                      style={{
                                        fontWeight: "bold",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {branch_vat_name === "ไม่มี"
                                        ? null
                                        : branch_vat_name}
                                    </div>
                                  </Typography>
                                </Stack>
                              </TableCell>
                              <TableCell>
                                <OwnerName
                                  ownerId={branch_owner_id}
                                  isOwners={isOwners}
                                />
                              </TableCell>
                              {/*  <TableCell>{owner_address}</TableCell> */}
                              <TableCell>
                                <Chip
                                  label={branch_status ? "ออนไลน์" : "ออฟไลน์"}
                                  color={statusObj[row.branch_status].color}
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                    "& .MuiChip-label": { fontWeight: 500 },
                                  }}
                                />
                              </TableCell>

                              <TableCell>
                                {" "}
                                <Chip
                                  label={
                                    branch_status_vat
                                      ? "เป็นผู้จดทะเบียน"
                                      : "ไม่เป็นผู้จดทะเบียน"
                                  }
                                  color={statusObj[row.branch_status_vat].color}
                                  sx={{
                                    height: 24,
                                    fontSize: "0.75rem",
                                    textTransform: "capitalize",
                                    "& .MuiChip-label": { fontWeight: 500 },
                                  }}
                                />
                              </TableCell>
                              <TableCell>{branch_vat_address}</TableCell>
                              <TableCell>
                                <BranchMoreMenu
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
