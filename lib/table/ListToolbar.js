import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

// import searchFill from '@iconify/icons-eva/search-fill';
// import trash2Fill from '@iconify/icons-eva/trash-2-fill';
// import roundFilterList from '@iconify/icons-ic/round-filter-list';
// import roundClearAll from '@iconify/icons-ic/round-clear-all';

// material
import { styled } from "@mui/material/styles";
import {
  Box,
  Radio,
  Toolbar,
  Tooltip,
  Button,
  Drawer,
  IconButton,
  Typography,
  OutlinedInput,
  InputAdornment,
  FormControlLabel,
  Stack,
  RadioGroup,
} from "@mui/material";

// import Scrollbar from '../../../utils/Scrollbar';

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: "flex",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1, 0, 3),
}));

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(["box-shadow", "width"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  "&.Mui-focused": { width: 320, boxShadow: "15px" },
  "& fieldset": {
    borderWidth: `1px !important`,
    borderColor: `${theme.palette.grey[500_32]} !important`,
  },
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
};

export default function ListToolbar({ numSelected, filterName, onFilterName }) {
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: "primary.main",
          bgcolor: "primary.lighter",
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <SearchStyle
          value={filterName}
          onChange={onFilterName}
          placeholder="ค้นหา.."
          startAdornment={
            <InputAdornment position="start">
              <Icon icon="bx:search-alt" width="28" height="28" />
            </InputAdornment>
          }
        />
      )}
    </RootStyle>
  );
}
